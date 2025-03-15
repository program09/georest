import React, { useState } from 'react';
import { View, Text} from 'react-native';
import PageTitle from '../components/PageTitle';
import PrimaryButton from '../components/ButtonPrimary'
import { globalStyles } from '../styles/GlobalStyles';
import MapOpenLayers from '../components/MapOpenLayers';

const HomeScreen = ({ navigation }) => {
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

    const onButtonPress = () => {navigation.navigate('Restaurant')};
    const handleRestaurantSelect = (restaurant) => {
        console.log("Restaurante seleccionado:", restaurant);
        setSelectedRestaurantId(restaurant.uuid);
    };

    
    
    const restaurantList = [
        {
            "name": "Tanta 6",
            "ruc": "1903456789126", 
            "latitude": -7.085623756585501, // Removed string quotes for numeric values
            "longitude": -76.885855997828300,
            "comment": "Comentario",
            "uuid": "258163a7-7e8a-4435-970e-7adc8cb2c30a",
            "createdAt": "2025-03-15T04:41:58.421Z",
            "updatedAt": "2025-03-15T04:41:58.421Z"
        },
        {
            "name": "La Rosa Náutica",
            "ruc": "2003456789127",
            "latitude": -8.084523756585502,
            "longitude": -76.884855997828301,
            "comment": "Restaurant with sea view",
            "uuid": "358163a7-7e8a-4435-970e-7adc8cb2c30b",
            "createdAt": "2025-03-15T04:42:58.421Z",
            "updatedAt": "2025-03-15T04:42:58.421Z"
        },
        {
            "name": "Central",
            "ruc": "2103456789128",
            "latitude": -7.083423756585503,
            "longitude": -76.883855997828302,
            "comment": "Fine dining restaurant",
            "uuid": "458163a7-7e8a-4435-970e-7adc8cb2c30c",
            "createdAt": "2025-03-15T04:43:58.421Z",
            "updatedAt": "2025-03-15T04:43:58.421Z"
        }
    ];

    return (
        <View style={globalStyles.container}>
            <PageTitle pageName="Home" />
            <View style={globalStyles.containerTop}>
                <View style={globalStyles.contentItem}>
                    <Text style={globalStyles.textlight}>Total: 8</Text>
                </View>
                <View style={globalStyles.contentItem}>
                    <Text style={globalStyles.textlight}>Pendientes: 5</Text>
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
