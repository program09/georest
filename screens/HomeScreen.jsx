import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import PageTitle from '../components/PageTitle';
import PrimaryButton from '../components/ButtonPrimary'
import { globalStyles } from '../styles/GlobalStyles';
import MapOpenLayers from '../components/MapOpenLayers';

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
                headers: {'x-api-key': apiKey,}
            });

            if (!response.ok) {throw new Error(`HTTP error! status: ${response.status}`);}

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
                    () => {},
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
        catch (error) {Alert.alert('Error', 'No se pudieron obtener o guardar los tipos.');}
    };

    const handleRestaurantSelect = (restaurant) => {
        console.log("Restaurante seleccionado:", restaurant);
        setSelectedRestaurantId(restaurant.uuid);
    };

    const [restaurantList, setRestaurantList] = useState([]);
    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [pendingRestaurants, setPendingRestaurants] = useState(0);

    // Load restaurants from local database when component mounts
    React.useEffect(() => {
        db.transaction(tx => {
            // Get all restaurants
            tx.executeSql(
                'SELECT * FROM Restaurants',
                [],
                (_, { rows: { _array } }) => {
                    setRestaurantList(_array);
                    setTotalRestaurants(_array.length);
                    // Count restaurants with send_api = false
                    const pending = _array.filter(restaurant => restaurant.send_api === false).length;
                    setPendingRestaurants(pending);
                },
                (_, error) => {
                    console.error('Error fetching restaurants:', error);
                }
            );
        });
    }, []);

    /*const restaurantList = [
        {
            "id":1 ,
            "name": "Tanta 6",
            "ruc": "1903456789126",
            "latitude": -7.085623756585501, // Removed string quotes for numeric values
            "longitude": -75.885855997828300,
            "comment": "Comentario",
            "uuid": "258163a7-7e8a-4435-970e-7adc8cb2c30a",
            "send_api": false,
        },
        {
            "id": 3,
            "name": "La Rosa Náutica",
            "ruc": "2003456789127",
            "latitude": -8.084523756585502,
            "longitude": -76.884855997828301,
            "comment": "Restaurant with sea view",
            "uuid": "358163a7-7e8a-4435-970e-7adc8cb2c30b",
            "send_api": true,
        },
        {
            "id": 3,
            "name": "Central",
            "ruc": "2103456789128",
            "latitude": -7.083423756585503,
            "longitude": -76.883855997828302,
            "comment": "Fine dining restaurant",
            "uuid": "458163a7-7e8a-4435-970e-7adc8cb2c30c",
            "send_api": true,
        }
    ];*/

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
