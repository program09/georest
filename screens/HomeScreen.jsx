import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert } from 'react-native';
import PageTitle from '../components/PageTitle';
import PrimaryButton from '../components/ButtonPrimary'
import { globalStyles } from '../styles/GlobalStyles';
import MapOpenLayers from '../components/MapOpenLayers';
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo"; 

import { db } from '../database/createdatabase';

const HomeScreen = ({ navigation }) => {
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const API_URL = 'https://c7e42vwpel.execute-api.us-east-1.amazonaws.com/yordialcantara/restaurants';
    const API_KEY = 'yvCOAEXOaj2wge5Uh1czv5WaI9rVeEdW1K6w3bh9';

    // Obtener datos desde la apy
    const fetchTypesFromAPI = async () => {
        const url = 'https://c7e42vwpel.execute-api.us-east-1.amazonaws.com/yordialcantara/photo-types';
        const apiKey = 'yvCOAEXOaj2wge5Uh1czv5WaI9rVeEdW1K6w3bh9';

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'x-api-key': apiKey, }
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

    // Función que se ejecuta al presionar el botón
    const onButtonPress = async () => {
        try {
            const types = await fetchTypesFromAPI();
            saveTypesToLocalDB(types);
            Alert.alert('Éxito', 'Los tipos de fotos se han guardado correctamente en la base de datos local.');
        }
        catch (error) { Alert.alert('Error', 'No se pudieron obtener o guardar los tipos.'); }
    };

    const handleRestaurantSelect = (restaurant) => {
        console.log("Restaurante seleccionado:", restaurant);
        setSelectedRestaurantId(restaurant.uuid);
    };

    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [pendingRestaurants, setPendingRestaurants] = useState(0);
    const [restaurantList, setRestaurantList] = useState([]);

    const uploadPendingRestaurants = useCallback(async () => {
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
            console.log("📡 No hay conexión a Internet. Esperando conexión...");
            return;
        }
    
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM Restaurants WHERE send_api = 0;",
                    [],
                    async (_, results) => {
                        let rows = results.rows;
                        let pendingRestaurants = [];
    
                        // Extract pending restaurants
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
    
                        // Upload each restaurant
                        for (const restaurant of pendingRestaurants) {
                            try {
                                // Attempt to upload the restaurant to the API
                                const response = await fetch(API_URL, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-api-key': API_KEY
                                    },
                                    body: JSON.stringify(restaurant)
                                });
    
                                if (!response.ok) {
                                    continue; // Skip to the next restaurant if the upload fails
                                }
    
                                const responseData = await response.json();
                                console.log(`✅ Restaurante ${restaurant.name} subido con éxito`);
    
                                // Update the database to mark the restaurant as uploaded
                                await new Promise((resolveUpdate, rejectUpdate) => {
                                    db.transaction(tx => {
                                        tx.executeSql(
                                            "UPDATE Restaurants SET send_api = 1, uuid = ? WHERE name = ?;",
                                            [responseData.data.uuid, restaurant.name],
                                            () => {
                                                console.log(`🔄 Actualizado en la DB: ${restaurant.name}`);
                                                resolveUpdate();
                                            },
                                            (_, error) => {
                                                console.error("Error actualizando send_api:", error);
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
    
                        // After all uploads are complete, refresh the data
                        fetchData();
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
    
    const fetchData = useCallback(() => {
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

    useFocusEffect(
        useCallback(() => {
            uploadPendingRestaurants();
        }, [uploadPendingRestaurants])
    );

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
