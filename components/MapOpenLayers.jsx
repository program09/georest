import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, PermissionsAndroid, Platform, Alert, Linking } from "react-native";
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

const MapOpenLayers = ({ onRestaurantSelect }) => {
  const webViewRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      // Get initial location
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          sendLocationToWebView(latitude, longitude);
        },
        (error) => {
          console.error("❌ Error obteniendo ubicación:", error);
          Alert.alert("Error", "No se pudo obtener la ubicación. Asegúrate de que el GPS está activado.");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );

      // Watch for location changes
      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          sendLocationToWebView(latitude, longitude);
        },
        (error) => console.error("❌ Error siguiendo ubicación:", error),
        { enableHighAccuracy: true, distanceFilter: 10 }
      );

      return () => Geolocation.clearWatch(watchId);
    };

    fetchLocation();
  }, []);

  const sendLocationToWebView = (latitude, longitude) => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        updateUserLocation(${latitude}, ${longitude});
      `);
    }
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("📩 Mensaje recibido de WebView:", data);

      if (data.type === "restaurant_selected" && onRestaurantSelect) {
        onRestaurantSelect(data);
      }
    } catch (error) {
      console.error("❌ Error procesando mensaje de WebView:", error);
    }
  };

  const datarest = () => {

  }

  //Obtener los datos de una ubicacion del mapa

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
        let map, userVectorSource, userVectorLayer;

        function initMap() {
          userVectorSource = new ol.source.Vector();
          userVectorLayer = new ol.layer.Vector({
            source: userVectorSource,
            style: new ol.style.Style({
              image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({ color: '#ff0000' }),
                stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
              })
            })
          });

          map = new ol.Map({
            target: 'map',
            layers: [
              new ol.layer.Tile({ source: new ol.source.OSM() }),
              userVectorLayer
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat([-77.0428, -12.0464]),
              zoom: 5
            })
          });
        }

        function updateUserLocation(latitude, longitude) {
          const coords = ol.proj.fromLonLat([longitude, latitude]);
          
          userVectorSource.clear();
          const point = new ol.Feature({
            geometry: new ol.geom.Point(coords)
          });
          //Aqui se recibe la ubicación del us
          userVectorSource.addFeature(point);
          map.getView().setCenter(coords);
          map.getView().setZoom(16);
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MapOpenLayers;
