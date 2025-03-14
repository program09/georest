import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import PageTitle from '../components/PageTitle';
import PrimaryButton from '../components/ButtonPrimary'
import OpenLayersMap from '../components/OpenLayersMap';

const HomeScreen = ({ navigation }) => {
    const onButtonPress = () => {
        navigation.navigate('Restaurant')
    };
    return (
        <View style={styles.container}>
            <PageTitle pageName="GeoRest" />
            <View style={styles.containerTop}>
                <View style={styles.contentItem}>
                    <Text style={styles.textlight}>Total: 8</Text>
                </View>
                <View style={styles.contentItem}>
                    <Text style={styles.textlight}>Pendientes: 5</Text>
                </View>
            </View>
            <View style={{ width: '100%', marginLeft: 10 }}>
                <PrimaryButton title="Descargar tipos de foto" onPress={onButtonPress} />
            </View>


            <View style={styles.mapContent}>
            <OpenLayersMap />
            </View>



        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fff',
    },
    containerTop: {
        width: '100%',
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    contentItem: {
        flex: 1,
        maxWidth: '50%',
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 15,
    },
    textlight: {
        fontSize: 18,
        width: '100%',
        textAlign: 'center',
        color: '#fff',
    },
    mapContent : {
        flex: 1,
        width: '100% -10',
        backgroundColor: '#000',
        margin: 10,
        borderRadius: 15,
    }

});

export default HomeScreen;
