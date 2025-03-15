import React, { useState, useCallback } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import PhotoItem from "../../components/PhotoItem";
import { globalStyles } from "../../styles/GlobalStyles"
import PrimaryButton from "../../components/ButtonPrimary";
import ButtonDanger from "../../components/ButtonDanger";

const FotosTab = ({ navigation }) => {
    const [foto1, setFoto1] = useState(null);
    const [foto2, setFoto2] = useState(null);

    const tomarFoto = useCallback((setFoto) => {
        setFoto("https://via.placeholder.com/100"); // Simulación de foto
    }, []);

    return (
        <ScrollView style={globalStyles.container}>
            <View style={globalStyles.containerTab}>

                <PhotoItem label="Etiqueta Foto 1" photo={foto1} onPress={() => tomarFoto(setFoto1)} />
                <PhotoItem label="Etiqueta Foto 2" photo={foto2} onPress={() => tomarFoto(setFoto2)} />
                <View style={globalStyles.footerButtons}>
                    <ButtonDanger title="Cancelar" onPress={() => {
                        setFoto1(null);
                        setFoto2(null);
                        navigation.goBack();
                    }} />

                    <PrimaryButton title="Guardar" />
                </View>
            </View>
        </ScrollView>
    );
};

export default FotosTab;