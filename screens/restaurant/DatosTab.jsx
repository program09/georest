import React, { useState, useCallback } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";


const DatosTab = () => {
    const [nombre, setNombre] = useState("");
    const [ruc, setRuc] = useState("");
    const [latitud, setLatitud] = useState("");
    const [longitud, setLongitud] = useState("");
    const [comentario, setComentario] = useState("");

    return (
        <View style={styles.containerTab}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput style={styles.input} value={nombre} onChangeText={setNombre} keyboardType="default" />

            <Text style={styles.label}>RUC</Text>
            <TextInput style={styles.input} value={ruc} onChangeText={setRuc} keyboardType="default" />

            <Text style={styles.label}>Latitud</Text>

            <TextInput
                style={[styles.input, styles.inputdisabled]}
                value={latitud}
                onChangeText={setLatitud}
                keyboardType="numeric"
                editable={false}
            />


            <Text style={styles.label}>Longitud</Text>
            <TextInput
                style={[styles.input, styles.inputdisabled]}
                value={longitud}
                onChangeText={setLongitud}
                keyboardType="numeric"
                editable={false}
            />

            <Text style={styles.label}>Comentario</Text>
            <TextInput style={[styles.input, styles.textArea]} value={comentario} onChangeText={setComentario} multiline />


        </View>
    );
};

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: "#fff",
    },
    containerTab: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        paddingVertical: 15,
        marginBottom: 15,
    },
    inputdisabled: {
        backgroundColor: '#ddd',
        borderColor: '#ddd',
    },
    textArea: {
        height: 80,
    },
    itemphotocontent: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 15,
        padding: 5,
        backgroundColor: '#f8f8f8',
        borderRadius: 20,
    },
    itemphoto: {
        flex: 1,
    },
    image: {
        width: 150,
        height: 150,
        backgroundColor: "#ddd",
        borderRadius: 15,
    },
    button: {
        backgroundColor: "#2196F3",
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: "#f44336",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    footerButtons: {
        width: '100%',
        flexDirection: "row",
        justifyContent: "space-between",
    },
    tabBar: {
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        height: 80,
        display: "flex",
        alignItems: "center",
        padding: 0,
    },
    tabLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    tabIndicator: {
        backgroundColor: '#000'
    }
});

export default DatosTab;