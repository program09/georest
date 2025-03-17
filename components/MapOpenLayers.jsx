import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, PermissionsAndroid, Platform, Alert, Linking, Modal, Text, TouchableOpacity } from "react-native";
import WebView from "react-native-webview";
import Geolocation from "@react-native-community/geolocation";

const requestLocationPermission = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("✅ Permiso de ubicación concedido");
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        Alert.alert(
          "Permiso de Ubicación",
          "Para ver tu ubicación en el mapa, necesitas otorgar permisos.",
          [{ text: "OK" }]
        );
        return false;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          "Permiso de Ubicación Necesario",
          "Los permisos de ubicación están deshabilitados. Activa los permisos en Configuración.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Abrir Configuración", onPress: () => Linking.openSettings() }
          ]
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Error solicitando permisos:", error);
      return false;
    }
  }
  return true;
};

const MapOpenLayers = ({ restaurants, navigation }) => {
  const webViewRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [initialLocationSet, setInitialLocationSet] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          if (!initialLocationSet) {
            sendLocationToWebView(latitude, longitude, true);
            setInitialLocationSet(true);
          } else {
            sendLocationToWebView(latitude, longitude, false);
          }
        },
        (error) => {
          console.error("❌ Error obteniendo ubicación:", error);
          Alert.alert("Error", "No se pudo obtener la ubicación. Asegúrate de que el GPS está activado.");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          sendLocationToWebView(latitude, longitude, false);
        },
        (error) => console.error("❌ Error siguiendo ubicación:", error),
        { enableHighAccuracy: true, distanceFilter: 10 }
      );
      return () => Geolocation.clearWatch(watchId);
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    if (webViewRef.current && userLocation) {
      webViewRef.current.injectJavaScript(`
        updateRestaurants(${JSON.stringify(restaurants)});
        updateUserLocation(${userLocation.latitude}, ${userLocation.longitude}, false);
      `);
    }
  }, [restaurants]);

  const handleNavigateToRestaurant = () => {
    setModalVisible(false);
    if (selectedRestaurant) {
      navigation.navigate('Restaurant', { uuid: selectedRestaurant.uuid });
      return
    } else {
      navigation.navigate('Restaurant', { location: selectedLocation });
    }
  };

  const sendLocationToWebView = (latitude, longitude, center = false) => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        updateUserLocation(${latitude}, ${longitude}, ${center});
      `);
    }
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("📩 Mensaje recibido de WebView:", data);
      if (data.type === "location_selected") {
        setSelectedLocation(data.coordinates);
        setSelectedRestaurant(null);
        setModalVisible(true);
      } else if (data.type === "restaurant_selected") {
        setSelectedRestaurant(data.restaurant);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("❌ Error procesando mensaje de WebView:", error);
    }
  };

  const mapHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mapa con OpenLayers</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v7.4.0/ol.css">
      <script src="https://cdn.jsdelivr.net/npm/ol@v7.4.0/dist/ol.js"></script>
      <style>
        * { margin: 0; padding: 0; }
        #map { width: 100vw; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        let map, userVectorSource, userVectorLayer, selectedLocationSource, selectedLocationLayer, restaurantsSource, restaurantsLayer;
        let longPressTimer;
        let lastUserLocation;
        let isFirstUpdate = true;

        function initMap() {
          userVectorSource = new ol.source.Vector();
          selectedLocationSource = new ol.source.Vector();
          restaurantsSource = new ol.source.Vector();

          userVectorLayer = new ol.layer.Vector({
            source: userVectorSource,
            zIndex: 1000,
            style: new ol.style.Style({
              image: new ol.style.Circle({
                radius: 12,
                fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.7)' }),
                stroke: new ol.style.Stroke({ 
                  color: '#ffffff',
                  width: 1
                })
              }),
              stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 255, 0.3)',
                width: 10
              })
            })
          });

          selectedLocationLayer = new ol.layer.Vector({
            source: selectedLocationSource,
            style: new ol.style.Style({
              image: new ol.style.Circle({
                radius: 12,
                fill: new ol.style.Fill({ color: '#0000ff' }),
                stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
              })
            })
          });

          restaurantsLayer = new ol.layer.Vector({
            source: restaurantsSource,
            style: function(feature) {
              const restaurant = feature.get('restaurant');
              const color = restaurant.send_api ? '#ff0000' : '#000000';
              return new ol.style.Style({
                image: new ol.style.Circle({
                  radius: 10,
                  fill: new ol.style.Fill({ color: color }),
                  stroke: new ol.style.Stroke({ color: '#ffffff', width: 1 })
                })
              });
            }
          });

          map = new ol.Map({
            target: 'map',
            layers: [
              new ol.layer.Tile({ source: new ol.source.OSM() }),
              restaurantsLayer,
              userVectorLayer,
              selectedLocationLayer
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat([-77.0428, -12.0464]),
              zoom: 15
            })
          });

          updateRestaurants(${JSON.stringify(restaurants)});

          let startTime;
          
          map.on('pointerdown', function(evt) {
            startTime = new Date().getTime();
          });

          map.on('click', function(evt) {
            const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
              return feature;
            });

            if (feature && feature.get('restaurant')) {
              const restaurant = feature.get('restaurant');
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'restaurant_selected',
                restaurant: restaurant,
                uuid: restaurant.uuid
              }));
            }
          });

          map.on('pointerup', function(evt) {
            const endTime = new Date().getTime();
            const holdTime = endTime - startTime;

            if (holdTime >= 2000) {
              const coordinate = evt.coordinate;
              const lonLat = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
              
              selectedLocationSource.clear();
              const point = new ol.Feature({
                geometry: new ol.geom.Point(coordinate)
              });
              selectedLocationSource.addFeature(point);

              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'location_selected',
                coordinates: {
                  longitude: lonLat[0],
                  latitude: lonLat[1]
                }
              }));
            }
          });
        }

        function updateRestaurants(restaurants) {
          restaurantsSource.clear();
          if (restaurants && restaurants.length > 0) {
            restaurants.forEach(restaurant => {
              const coords = ol.proj.fromLonLat([restaurant.longitude, restaurant.latitude]);
              const point = new ol.Feature({
                geometry: new ol.geom.Point(coords),
                restaurant: restaurant
              });
              restaurantsSource.addFeature(point);
            });
          }
          if (lastUserLocation) {
            updateUserLocation(lastUserLocation.latitude, lastUserLocation.longitude, false);
          }
        }

        function updateUserLocation(latitude, longitude, center = false) {
          const coords = ol.proj.fromLonLat([longitude, latitude]);
          lastUserLocation = { latitude, longitude };
          
          userVectorSource.clear();
          const point = new ol.Feature({
            geometry: new ol.geom.Point(coords)
          });
          userVectorSource.addFeature(point);
          
          if (isFirstUpdate || center) {
            map.getView().setCenter(coords);
            map.getView().setZoom(16);
            isFirstUpdate = false;
          }
        }

        document.addEventListener("DOMContentLoaded", initMap);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: mapHtml }}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        geolocationEnabled={true}
        mixedContentMode="always"
        allowUniversalAccessFromFileURLs={true}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            {selectedRestaurant ? (
              `Restaurante seleccionado: ${selectedRestaurant.name}`
            ) : (
              `Ubicación seleccionada:\nLatitud: ${selectedLocation?.latitude.toFixed(6)}\nLongitud: ${selectedLocation?.longitude.toFixed(6)}`
            )}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleNavigateToRestaurant}
          >
            <Text style={styles.buttonText}>
              {selectedRestaurant ? 'Ver Restaurante' : 'Ir a la ubicación'}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default MapOpenLayers;