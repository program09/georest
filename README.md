# GeoREST
- Autor: Yordi Alcántara Paico

## Description

La aplicación mustra restaurantes en un mapa. al rededor de la ubicación del usaurio
- La aplicación necesita permissos de ubicación, internet, leer y escribir en el almacenamiento.
- Debe conectarse a internet la primera vez al instalar la aplicación para descargar los mapas.

## HOME
- El la página principal se mustra el total de resturantes agregados, y la cantidad de restaurantes que nos e han sincronizado con la api
- Se desacrga los tipos de fotos y se guarda en la base de datos local
- La ubicación del usuario se muestra con un punto de color azul
- La ubicación de los restaurantes sincronizados se muestra con un punto de color rojo
- Los restaurantes no sincronizados se muestran con un punto de color negro

- Se sincronixan los datos a la api en segundo plano

- Mantener precionado una ubicación (por 1 segundo) en el mapa para agregar nuevo restaurante
- Precionar un restaurante para ver su información


## RESTAURANTES
- Mustra 2 pestañas en forma de tab bar para los datos del restaurante y para sus fotos
## DATOS
- Muestra los datos del restaurante
- Permite agregar información del restaurante
## FOTOS
- Muestra las fotos del restaurante
- Permite agregar fotos del restaurante

## STYLES
- Se usa estilos nativos en el archivo Styles/GlobalStyles.jsx

## COMPONENTS
- Se usa componentes desde el directorio "/Components"
- # Buttons
- # MapOpenLayer -> componente para mostrar el mapa de OpenLayer con acciones del usuario
    - Se muestra la ubicación actual del usuario
    - Se muestra la ubicación de los restaurantes
    - Se muestra la ubicación de los restaurantes no sincronizados
    - Se crea las capas de las ubicaciones
    - Se envía las acciones al home (Precionar ubicacion, precionar restaurante) -> se obtiene datos de la ubicacion o restaurante y se envian al home

- # PageTitle -> Titulos de la pantalla
- # PhotoCard -> Muestra las fotos del restaurantes en la pantalla de Restaurantes/fotos

## Tecnologías
- Node JS
- React Native
- SDK 17
- Android Studio
- Mapas de https://openlayers.org/
- Base de datos SQLite

## Installation

1. clonar el repositorio  https://github.com/program09/georest.git
2. ejecutar npm install -> para instalar las dependencias
3. ejecutar npm run android o npm run ios -> para ejecutar la aplicación




