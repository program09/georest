import React, { useState, useCallback } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import PhotoItem from "../../components/PhotoItem";
import { globalStyles } from "../../styles/GlobalStyles"
import PrimaryButton from "../../components/ButtonPrimary";
import ButtonDanger from "../../components/ButtonDanger";

const FotosTab = ({ navigation, route }) => {
    const { photos: initialPhotos } = route.params;
    const [photos, setPhotos] = useState(
        initialPhotos.reduce((acc, photo) => ({
            ...acc,
            [photo.type.uuid]: photo.type.path
        }), {})
    );

    const tomarFoto = useCallback((uuid) => {
        // Here you would implement actual camera functionality
        // For simulation, we're using a placeholder URL
        setPhotos(prev => ({
            ...prev,
            [uuid]: "https://i.blogs.es/6f44dd/google-2015-1/1366_2000.jpg"
        }));
    }, []);

    const typephotos = [
        {
            "uuid": "1",
            "name": "Fachada Frontal",
            "description": "Foto de la fachada frontal del restaurante"
        },
        {
            "uuid": "2",
            "name": "Fachada Lateral Derecha",
            "description": "Foto de la fachada lateral derecha del restaurante"
        },
        {
            "uuid": "3",
            "name": "Fachada Lateral Izquierda",
            "description": "Foto de la fachada lateral izquierda del restaurante"
        }
    ];

    return (
        <ScrollView style={globalStyles.container}>
            <View style={globalStyles.containerTab}>
                {typephotos.map((type) => (
                    <PhotoItem
                        key={type.uuid}
                        label={type.name}
                        description={type.description}
                        photo={photos[type.uuid]}
                        onPress={() => tomarFoto(type.uuid)}
                    />
                ))}
                <View style={globalStyles.footerButtons}>
                    <ButtonDanger
                        title="Cancelar"
                        onPress={() => {
                            setPhotos({});
                            navigation.goBack();
                        }}
                    />
                    <PrimaryButton title="Guardar" />
                </View>
            </View>
        </ScrollView>
    );
};

export default FotosTab;