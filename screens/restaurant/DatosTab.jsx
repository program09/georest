import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import { globalStyles } from "../../styles/GlobalStyles";
import PageTitle from "../../components/PageTitle";
import { db } from "../../database/createdatabase";
import ButtonDanger from "../../components/ButtonDanger";
import PrimaryButton from "../../components/ButtonPrimary";


const DatosTab = ({ route, navigation }) => {
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
            if (route.params.uuid) {
                const uuid = route.params.uuid;
                
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

                    fetch(`https://c7e42vwpel.execute-api.us-east-1.amazonaws.com/yordialcantara/restaurants/${uuid}`, {
                        headers: {
                            'x-api-key': 'yvCOAEXOaj2wge5Uh1czv5WaI9rVeEdW1K6w3bh9'
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

        // Insertar en la base de datos
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO Restaurants (name, ruc, latitude, longitude, comment, uuid)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [nombre, ruc, latitud, longitud, comentario, null],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        const insertId = result.insertId;
                        console.log("Restaurante guardado correctamente. ID:", insertId);

                        // Update the UUID with the insertId
                        tx.executeSql(
                            'UPDATE Restaurants SET uuid = ? WHERE id = ?',
                            [insertId.toString(), insertId],
                            (_, updateResult) => {
                                if (updateResult.rowsAffected > 0) {
                                    console.log("UUID updated successfully");
                                    Alert.alert("Success", "Restaurant saved successfully");
                                    navigation.setParams({ uuid: insertId.toString() });
                                    navigation.goBack()
                                } else {
                                    console.error("Failed to update UUID");
                                    Alert.alert("Error", "Failed to update restaurant UUID.");
                                }

                            },
                            (_, error) => {
                                console.error("Error updating UUID:", error);
                                Alert.alert("Error", "Failed to update restaurant UUID.");
                            }
                            
                        
                        );
                    } else {
                        console.error("No se pudo guardar el restaurante.");
                        Alert.alert("Error", "No se pudo guardar el restaurante.");
                    }
                },
                (_, error) => {
                    console.error("Error al guardar el restaurante:", error);
                    Alert.alert("Error", "No se pudo guardar el restaurante.");
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