import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import { globalStyles } from "../../styles/GlobalStyles";
import PageTitle from "../../components/PageTitle";

const DatosTab = ({ route }) => {
    const [nombre, setNombre] = useState("");
    const [ruc, setRuc] = useState("");
    const [latitud, setLatitud] = useState("");
    const [longitud, setLongitud] = useState("");
    const [comentario, setComentario] = useState("");

    useEffect(() => {
        if (route.params) {
            const { latitude, longitude } = route.params;
            setLatitud(latitude ? latitude.toString() : "");
            setLongitud(longitude ? longitude.toString() : "");
        }
    }, [route.params]);

    return (
        <ScrollView style={globalStyles.container}>
            
            <View style={globalStyles.containerTab}>
                <Text style={globalStyles.label}>Nombre</Text>
                <TextInput 
                    style={globalStyles.input} 
                    value={nombre} 
                    onChangeText={setNombre} 
                    keyboardType="default" 
                />

                <Text style={globalStyles.label}>RUC</Text>
                <TextInput 
                    style={globalStyles.input} 
                    value={ruc} 
                    onChangeText={setRuc} 
                    keyboardType="default" 
                />

                <Text style={globalStyles.label}>Latitud</Text>
                <TextInput
                    style={[globalStyles.input, globalStyles.inputdisabled]}
                    value={latitud}
                    onChangeText={setLatitud}
                    keyboardType="numeric"
                    editable={false}
                />

                <Text style={globalStyles.label}>Longitud</Text>
                <TextInput
                    style={[globalStyles.input, globalStyles.inputdisabled]}
                    value={longitud}
                    onChangeText={setLongitud}
                    keyboardType="numeric"
                    editable={false}
                />

                <Text style={globalStyles.label}>Comentario</Text>
                <TextInput 
                    style={[globalStyles.input, globalStyles.textArea]} 
                    value={comentario} 
                    onChangeText={setComentario} 
                    multiline 
                />
            </View>
        </ScrollView>
    );
};

export default DatosTab;