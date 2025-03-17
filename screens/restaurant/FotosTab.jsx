import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, Image, PermissionsAndroid, Platform, ScrollView, Alert } from "react-native";
import PhotoItem from "../../components/PhotoItem";
import { globalStyles } from "../../styles/GlobalStyles"
import PrimaryButton from "../../components/ButtonPrimary";
import ButtonDanger from "../../components/ButtonDanger";
import { db } from "../../database/createdatabase";
import { launchCamera } from 'react-native-image-picker';

const FotosTab = ({ navigation, route }) => {
    const [photos, setPhotos] = useState({});
    const [typePhotos, setTypePhotos] = useState([]);

    const pedirPermisoCamara = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Permiso de Cámara",
                    message: "Se necesita acceso a la cámara para tomar fotos.",
                    buttonNeutral: "Preguntar después",
                    buttonNegative: "Cancelar",
                    buttonPositive: "Aceptar"
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;  // iOS no requiere permiso manual
    };

    const tomarFoto = useCallback(async (uuid) => {
        const permiso = await pedirPermisoCamara();
        if (!permiso) {
            Alert.alert("Permiso Denegado", "No se puede abrir la cámara sin permisos.");
            return;
        }

        const options = {
            mediaType: 'photo',
            cameraType: 'back',
            quality: 0.8,
            saveToPhotos: true
        };
        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log("🚫 Captura de foto cancelada");
                Alert.alert("Error", "error.");
            } else if (response.errorCode) {
                console.error("❌ Error al tomar foto:", response.errorMessage);
                Alert.alert("Error", "No se pudo tomar la foto.");
            } else if (response.assets && response.assets.length > 0) {
                const imageUri = response.assets[0].uri;
                console.log("📸 Foto tomada:", imageUri);

                // Actualiza el estado con la foto tomada
                setPhotos(prev => ({
                    ...prev,
                    [uuid]: imageUri
                }));
            }
        });
    }, []);

    const [loading, setLoading] = useState(false);

    const savedPhotos = async () => {
        const restaurantUuid = route.params?.uuid;

        if (!restaurantUuid) {
            Alert.alert('Error', 'Restaurant ID not found');
            return;
        }

        // Save each photo to the database
        Object.entries(photos).forEach(([typeUuid, photoPath]) => {
            db.transaction(tx => {
                tx.executeSql(
                    'INSERT OR REPLACE INTO Photos (uuid_restaurant, uuid_type, path_photo) VALUES (?, ?, ?)',
                    [restaurantUuid, typeUuid, photoPath],
                    (_, result) => {
                        Alert.alert('Success', 'Se cargaron las fotos');
                    },
                    (_, error) => {
                        console.error('Error saving photo:', error);
                        Alert.alert('Error', 'Failed to save photos');
                    }
                );
            });
        });

        navigation.goBack();
    }


    // Load photo types and existing restaurant photos from local database
    useEffect(() => {
        const loadPhotoTypesAndRestaurant = async () => {
            try {
                setLoading(true);

                // Get restaurant UUID from route params
                const restaurantUuid = route.params?.uuid;

                // Get photo types from local database
                db.transaction(tx => {
                    tx.executeSql(
                        'SELECT uuid, name, description FROM Types',  // Solo seleccionamos los campos necesarios
                        [],
                        (_, results) => {
                            const types = Array.from({ length: results.rows.length }, (_, i) => ({
                                uuid: results.rows.item(i).uuid,
                                name: results.rows.item(i).name,
                                description: results.rows.item(i).description
                            }));

                            setTypePhotos(types);
                        },
                        (_, error) => {
                            console.error("❌ Error al obtener los tipos de fotos:", error);
                            Alert.alert("Error", "No se pudieron cargar los tipos de fotos.");
                        }
                    );
                });

                // If restaurant UUID exists, get its photos
                if (restaurantUuid) {
                    db.transaction(tx => {
                        tx.executeSql(
                            'SELECT * FROM Photos WHERE uuid_restaurant = ?',
                            [restaurantUuid],
                            (_, results) => {
                                console.log('Photos retrieved successfully:', results.rows);
                                const photosByType = {};
                                
                                // Create an object mapping type UUIDs to photo paths
                                for (let i = 0; i < results.rows.length; i++) {
                                    const row = results.rows.item(i);
                                    photosByType[row.uuid_type] = row.path_photo;
                                }
                                
                                // Update the photos state with all retrieved photos
                                setPhotos(photosByType);
                            },
                            (_, error) => {
                                console.error("❌ Error al obtener los tipos de fotos:", error);
                                Alert.alert("Error", "No se pudieron cargar los tipos de fotos.");
                            }
                        );
                    });
                }

            } catch (error) {
                console.error('Error loading photo types and restaurant:', error);
                Alert.alert('Error', 'Failed to load photo types and restaurant data');
            } finally {
                setLoading(false);
            }
        };

        loadPhotoTypesAndRestaurant();
    }, [route.params?.uuid]);


    return (
        <ScrollView style={globalStyles.container}>
            <View style={globalStyles.containerTab}>
                {typePhotos.map((type) => (
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
                        onPress={() => navigation.goBack()}
                    />
                    <PrimaryButton
                        title="Guardar"
                        onPress={() => {
                            // Get restaurant UUID from route params
                            savedPhotos();
                        }}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default FotosTab;