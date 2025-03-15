import React from 'react';
import { View, Text} from 'react-native';
import PageTitle from '../components/PageTitle';
import PrimaryButton from '../components/ButtonPrimary'
import { globalStyles } from '../styles/GlobalStyles';
import MapOpenLayers from '../components/MapOpenLayers';


const HomeScreen = ({ navigation }) => {
    
    const onButtonPress = () => {navigation.navigate('Restaurant')};
    const handleRestaurantSelect = (restaurant) => {
        console.log("Restaurante seleccionado:", restaurant);
    };
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
            <View style={globalStyles.mapContent}>
            <MapOpenLayers onRestaurantSelect={handleRestaurantSelect} />
            </View>
        </View>
    );
};

export default HomeScreen;
