import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert } from 'react-native';
import PageTitle from '../components/PageTitle';
import PrimaryButton from '../components/ButtonPrimary'
import { globalStyles } from '../styles/GlobalStyles';
import MapOpenLayers from '../components/MapOpenLayers';
import { useFocusEffect } from '@react-navigation/native';

import { db } from '../database/createdatabase';

const HomeScreen = ({ navigation }) => {
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const BASE_URL = 'https://c7e42vwpel.execute-api.us-east-1.amazonaws.com/yordialcantara'
    const API_KEY = 'yvCOAEXOaj2wge5Uh1czv5WaI9rVeEdW1K6w3bh9';

    // Obtener datos desde la apI
    const fetchTypesFromAPI = async () => {
        try {
            const response = await fetch(BASE_URL + '/photo-types', {
                method: 'GET',
                headers: { 'x-api-key': API_KEY, }
            });

            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching types from API:', error);
            throw error;
        }
    };

    // Función para guardar los tipos en la base de datos local
    const saveTypesToLocalDB = (types) => {
        db.transaction(tx => {
            types.data.forEach(type => {
                tx.executeSql(
                    `INSERT OR IGNORE INTO Types (uuid, name, description) VALUES (?, ?, ?)`,
                    [type.uuid, type.name, type.description],
                    () => { },
                    error => console.error('Error al guardar tipo:', error)
                );
            });
        });
    };

    // Función PARA DESCARGAR LOS TIPOS DE DATO Y GUARDAR EN LOCAL
    const onButtonPress = async () => {
        try {
            // Obtener datos de la api
            const types = await fetchTypesFromAPI();

            // Guardar los tipos en la base de datos local
            saveTypesToLocalDB(types);
            Alert.alert('Éxito', 'Los tipos de fotos se han guardado correctamente en la base de datos local.');
        }
        catch (error) { Alert.alert('Error', 'No se pudieron obtener o guardar los tipos.'); }
    };

    const handleRestaurantSelect = (restaurant) => {
        console.log("Restaurante seleccionado:", restaurant);
        // Guardar el uuid del restaurante seleccionado
        setSelectedRestaurantId(restaurant.uuid);
    };

    const [totalRestaurants, setTotalRestaurants] = useState(0); // Total de restaurantes
    const [pendingRestaurants, setPendingRestaurants] = useState(0); // Restaurantes pendientes de enviar al api
    const [restaurantList, setRestaurantList] = useState([]); // Lista de restaurantes

    const uploadPendingRestaurants = useCallback(async () => {

        //Comprobar si hay internet
        if (navigation.online) {
            console.log("No hay conexión a Internet. Esperando conexión...");
            return;
        }
        
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM Restaurants WHERE send_api = 0;", // Comprobar si hay restaurantes pendientes de enviar al api
                    [],
                    async (_, results) => {
                        let rows = results.rows;
                        let pendingRestaurants = [];
    
                        // Formatear restaurantes para sincronizar
                        for (let i = 0; i < rows.length; i++) {
                            let restaurant = rows.item(i);
                            pendingRestaurants.push({
                                name: restaurant.name,
                                ruc: restaurant.ruc,
                                latitude: restaurant.latitude,
                                longitude: restaurant.longitude,
                                comment: restaurant.comment
                            });
                        }
    
                        // Enviar al api
                        for (const restaurant of pendingRestaurants) {
                            try {
                                // Enviar al api cada restaurante pendiente
                                const response = await fetch(BASE_URL + '/restaurants', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-api-key': API_KEY
                                    },
                                    body: JSON.stringify(restaurant) // Enviar el restaurante como JSON
                                });
    
                                if (!response.ok) {
                                    continue; // Si existe errores, seguir al siguiente.
                                }
    
                                const responseData = await response.json();
    
                                // Actualizar la base de datos local send_api true y uuid con el uuid del api
                                await new Promise((resolveUpdate, rejectUpdate) => {
                                    db.transaction(tx => {
                                        tx.executeSql(
                                            "UPDATE Restaurants SET send_api = 1, uuid = ? WHERE name = ?;",
                                            [responseData.data.uuid, restaurant.name],
                                            () => {                                          
                                                // Resolver la promesa para indicar que la actualización de la base de datos fue exitosa
                                                resolveUpdate();
                                            },
                                            (_, error) => {
                                                // Rechazar la promesa en caso de error
                                                rejectUpdate(error);
                                            }
                                        );
                                    });
                                });
                            } catch (error) {
                                console.error("❌ Error en la subida a la API:", error);
                                continue;
                            }
                        }
    
                        // Actualizar los datos y enviar al mapa
                        fetchData();

                        // Resolver la promesa para indicar que la subida de restaurantes fue exitosa
                        resolve();
                    },
                    (_, error) => {
                        console.error("Error obteniendo restaurantes pendientes", error);
                        reject(error);
                    }
                );
            });
        });
    }, []);
    
    // Obtener datos de los restaurantes desde la base de datos local
    const fetchData = useCallback(() => {
        // Obtener restaurantes pendientes de enviar al api
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT 
                    COUNT(*) as total, 
                    SUM(CASE WHEN send_api = 0 THEN 1 ELSE 0 END) as pending 
                FROM Restaurants;`,
                [],
                (_, results) => {
                    let total = results.rows.item(0).total;
                    let pending = results.rows.item(0).pending || 0;
                    setTotalRestaurants(total);
                    setPendingRestaurants(pending);
                    console.log("Total de restaurantes:", total);
                    console.log("Restaurantes pendientes:", pending);
                },
                (_, error) => console.error("Error al obtener datos agregados", error)
            );
    
            // Obtener la lista de restaurantes de la base de datos local
            tx.executeSql(
                "SELECT * FROM Restaurants;",
                [],
                (_, results) => {
                    let restaurants = [];
                    let rows = results.rows;
                    for (let i = 0; i < rows.length; i++) {
                        restaurants.push(rows.item(i));
                    }
                    setRestaurantList(restaurants);
                    console.log("Restaurantes obtenidos:", restaurants);
                },
                (_, error) => console.error("Error al obtener la lista de restaurantes", error)
            );
        });
    }, []);

    // Sincronizar restaurantes a la api en segundo plano 
    useFocusEffect(
        useCallback(() => {
            uploadPendingRestaurants();
        }, [uploadPendingRestaurants])
    );

    // Cargar los restaurantes al inicial la aplicación
    useEffect(() => {
        fetchData();
    })

    return (
        <View style={globalStyles.container}>
            <PageTitle pageName="Home" />
            <View style={globalStyles.containerTop}>
                <View style={globalStyles.contentItem}>
                    <Text style={globalStyles.textlight}>Total: {totalRestaurants}</Text>
                </View>
                <View style={globalStyles.contentItem}>
                    <Text style={globalStyles.textlight}>Pendientes: {pendingRestaurants}</Text>
                </View>
            </View>
            <View style={{ width: '100%', marginLeft: 10 }}>
                <PrimaryButton title="Descargar tipos de foto" onPress={onButtonPress} />
            </View>
            {selectedRestaurantId && (
                <Text style={globalStyles.textlight}>
                    Selected Restaurant ID: {selectedRestaurantId}
                </Text>
            )}
            <View style={globalStyles.mapContent}>
                <MapOpenLayers
                    restaurants={restaurantList}
                    onRestaurantSelect={handleRestaurantSelect}
                    navigation={navigation}
                    showMarkers={false}
                />
            </View>
        </View>
    );
};

export default HomeScreen;
