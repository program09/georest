import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import { globalStyles } from "../../styles/GlobalStyles";
import { db } from "../../database/createdatabase";
import ButtonDanger from "../../components/ButtonDanger";
import PrimaryButton from "../../components/ButtonPrimary";

const DatosTab = ({ route, navigation }) => {
    const [nombre, setNombre] = useState(""); // Nombre del restaurante
    const [ruc, setRuc] = useState("");  // RUC del restaurante
    const [latitud, setLatitud] = useState(""); // Latitud del restaurante
    const [longitud, setLongitud] = useState(""); // Longitud del restaurante
    const [comentario, setComentario] = useState(""); // Comentario del restaurante opcional

    const BASE_URL =  "https://c7e42vwpel.execute-api.us-east-1.amazonaws.com/yordialcantara"
    const APY_KEY = "yvCOAEXOaj2wge5Uh1czv5WaI9rVeEdW1K6w3bh9"

    useEffect(() => {
        // Sis e envía parametros
        if (route.params) {
            const { latitude, longitude } = route.params; // Obtener la ubicación del restaurante si se envía como parámetro
            setLatitud(latitude ? latitude.toString() : ""); // Convertir a string latitud
            setLongitud(longitude ? longitude.toString() : ""); // Convertir a string longitud

            // Si se envía como parámetro el uuid del restaurante
            if (route.params.uuid) {
                const uuid = route.params.uuid;
                
                // Si el uuid es menor a 10 caracteres, es un id local
                // Cargar información del restaurante desde local si no hay conexión a internet
                if (!isNaN(uuid) && uuid.length < 10 || !navigator.onLine) {
                    db.transaction(tx => {
                        tx.executeSql(
                            'SELECT * FROM Restaurants WHERE uuid = ?',
                            [uuid],
                            (_, { rows }) => {
                                if (rows.length > 0) {
                                    const restaurant = rows.item(0);
                                    setNombre(restaurant.name || '');
                                    setRuc(restaurant.ruc || '');
                                    setComentario(restaurant.comment || '');
                                    setLatitud(restaurant.latitude ? restaurant.latitude.toString() : '');
                                    setLongitud(restaurant.longitude ? restaurant.longitude.toString() : '');
                                }
                            },
                            (_, error) => {
                                console.error("Error fetching local restaurant data:", error);
                            }
                        );
                    });
                }
                else {
                    fetch(`${BASE_URL}/restaurants/${uuid}`, {
                        headers: {
                            'x-api-key': APY_KEY
                        }
                    })
                        .then(response => response.json())
                        .then(response => {
                            if (response.data) {
                                setNombre(response.data.name || '');
                                setRuc(response.data.ruc || '');
                                setComentario(response.data.comment || '');
                                setLatitud(response.data.latitude || '');
                                setLongitud(response.data.longitude || '');
                            }
                        })
                        .catch(error => {
                            console.error("Error fetching restaurant data:", error);
                        });
                }
            }
        }
    }, [route.params]);

    const handleSave = () => {
        // Validar campos obligatorios
        if (!nombre || !ruc || !latitud || !longitud) {
            Alert.alert("Error", "Por favor, completa todos los campos obligatorios.");
            return;
        }

        // Insertar en la base de datos local
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO Restaurants (name, ruc, latitude, longitude, comment, uuid)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [nombre, ruc, latitud, longitud, comentario, null],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        const insertId = result.insertId; // Id generado automáticamente

                        // Actualizar el campo uuid con el id generado en la base de datos local
                        tx.executeSql(
                            'UPDATE Restaurants SET uuid = ? WHERE id = ?',
                            [insertId.toString(), insertId],
                            (_, updateResult) => {
                                if (updateResult.rowsAffected > 0) {
                                    Alert.alert("Success", "Restaurante creado exitosamente.");
                                    navigation.goBack() // Regresar a home
                                } else {
                                    Alert.alert("Error", "No se pudo actualizar el uuid.");
                                }
                            },
                            (_, error) => {
                                Alert.alert("Error", "Ocurrió un error.", error);
                            }   
                        );
                    } else {
                        Alert.alert("Error", "No se pudo guardar el restaurante.");
                    }
                },
                (_, error) => {
                    Alert.alert("Error", "No se pudo guardar el restaurante.", error);
                }
            );
        });
    };

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

                <View style={globalStyles.footerButtons}>
                    <ButtonDanger
                        title="Cancelar"
                        onPress={() => {
                            navigation.goBack();
                        }}
                    />
                    <PrimaryButton title="Guardar" onPress={handleSave} />
                </View>
            </View>
        </ScrollView>
    );
};

export default DatosTab;