import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import WebView from "react-native-webview";

const MapOpenLayers = ({ onRestaurantSelect }) => {
  const webViewRef = useRef(null);

  const myPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = [position.coords.longitude, position.coords.latitude];
          
          // Send coordinates to parent component
          if (onRestaurantSelect) {
            onRestaurantSelect({
              type: "current_position",
              longitude: coordinates[0],
              latitude: coordinates[1]
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation not supported in this browser");
    }
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("📩 Mensaje recibido de WebView:", data);

      if (data.type === "restaurant_selected" && onRestaurantSelect) {
        onRestaurantSelect(data);
      } else if (data.type === "show_add_restaurant_modal") {
        console.log("📌 Abrir modal para nuevo restaurante en:", data);
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
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/openlayers/4.6.5/ol.css">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/openlayers/4.6.5/ol.js"></script>
      <style>
        * { margin: 0; padding: 0; }
        #map { width: 100vw; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        document.addEventListener("DOMContentLoaded", function () {
          const map = new ol.Map({
            target: 'map',
            layers: [
              new ol.layer.Tile({ source: new ol.source.OSM() })
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat([-77.0428, -12.0464]),
              zoom: 15
            })
          });

          const userVectorSource = new ol.source.Vector();
          const userVectorLayer = new ol.layer.Vector({ source: userVectorSource });
          map.addLayer(userVectorLayer);

          const restaurantVectorSource = new ol.source.Vector();
          const restaurantVectorLayer = new ol.layer.Vector({ source: restaurantVectorSource });
          map.addLayer(restaurantVectorLayer);

          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              function (position) {
                const userCoords = ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]);

                const userPoint = new ol.Feature({
                  geometry: new ol.geom.Point(userCoords),
                });

                userPoint.setStyle(new ol.style.Style({
                  image: new ol.style.Circle({
                    radius: 10,
                    fill: new ol.style.Fill({ color: 'red' }),
                    stroke: new ol.style.Stroke({ color: 'white', width: 4 })
                  })
                }));

                userVectorSource.addFeature(userPoint);
                map.getView().setCenter(userCoords);
                map.getView().setZoom(16);
              },
              function (error) {
                console.error("Error obteniendo ubicación:", error);
              },
              { enableHighAccuracy: true }
            );
          } else {
            alert("Geolocalización no soportada en este navegador.");
          }

          function agregarRestaurantes(data) {
            try {
              let restaurantes = JSON.parse(data);
              restaurantVectorSource.clear();

              restaurantes.forEach((restaurante, index) => {
                let lon = parseFloat(restaurante.longitude);
                let lat = parseFloat(restaurante.latitude);
                if (isNaN(lon) || isNaN(lat)) return;

                let coords = ol.proj.fromLonLat([lon, lat]);

                let marker = new ol.Feature({
                  geometry: new ol.geom.Point(coords),
                  restaurantId: restaurante.id || index
                });

                marker.setStyle(new ol.style.Style({
                  image: new ol.style.Circle({
                    radius: 12,
                    fill: new ol.style.Fill({ color: 'blue' }),
                    stroke: new ol.style.Stroke({ color: 'white', width: 2 })
                  })
                }));

                restaurantVectorSource.addFeature(marker);
              });

              restaurantVectorSource.changed();
              map.render();
            } catch (error) {
              console.error("❌ Error procesando datos de restaurantes:", error);
            }
          }

          map.on('pointerdown', function (event) {
            let found = false;
            let coords = ol.proj.toLonLat(event.coordinate);

            map.forEachFeatureAtPixel(event.pixel, function (feature) {
              let restaurantId = feature.get('restaurantId');

              if (restaurantId !== undefined && restaurantId !== null) {
                let restaurantCoords = ol.proj.toLonLat(feature.getGeometry().getCoordinates());

                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: "restaurant_selected",
                    restaurantId: restaurantId,
                    latitude: restaurantCoords[1],
                    longitude: restaurantCoords[0]
                  }));
                }

                found = true;
              }
            });

            if (!found && window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: "show_add_restaurant_modal",
                latitude: coords[1],
                longitude: coords[0]
              }));
            }
          });

          document.addEventListener("message", function (event) {
            agregarRestaurantes(event.data);
          });

        });
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
        javaScriptEnabled={true}  // 🔥 Habilitar JavaScript
        domStorageEnabled={true}  // 🔥 Habilitar almacenamiento en el DOM
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
