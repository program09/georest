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
            return data; // Retornar los datos obtenidos de la API
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
            const types = await fetchTypesFromAPI(); // Obtener los tipos desde la API
            saveTypesToLocalDB(types); // Guardar los datos en local
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

    const fetchData = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT 
                    COUNT(*) as total, 
                    SUM(CASE WHEN send_api = 0 THEN 1 ELSE 0 END) as pending 
                 FROM Restaurants;`,
                [],
                (_, results) => {
                    let total = results.rows.item(0).total; // Total de restaurantes
                    let pending = results.rows.item(0).pending || 0; // Restaurantes pendientes (evita null)
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
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

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
                    showMarkers={true} // Added prop to explicitly show markers
                />
            </View>
        </View>
    );
};

export default HomeScreen;
