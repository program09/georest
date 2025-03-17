import React from "react";
import { View, Text, Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DatosTab from './restaurant/DatosTab'
import FotosTab from './restaurant/FotosTab'
import { globalStyles } from "../styles/GlobalStyles";
import PageTitle from "../components/PageTitle";

const Tab = createBottomTabNavigator();

const RestaurantScreen = ({ route }) => {
  const { location, uuid: routeUuid } = route.params; // Obtener la ubicación y el uuid del restaurante si se envía como parámetro
  const uuid = routeUuid || location?.uuid || 0; // Obtener el id o uuid del restaurante si se envía como parámetro

  return (
    <View style={globalStyles.container}>
      <PageTitle pageName="Restaurant" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: globalStyles.tabBar,
          tabBarLabelStyle: globalStyles.tabLabel,
          tabBarActiveBackgroundColor: "#2196F3",
          tabBarActiveTintColor: "#fff",
        }}
      >
        <Tab.Screen
          name="Datos"
          component={DatosTab} // Ir al TAB de Datos
          initialParams={{ ...location, uuid }} // Pasar la ubicación y el uuid como parámetros
        />
        <Tab.Screen
          name="Fotos"
          component={FotosTab} // Ir al TAB de Fotos
          initialParams={{ uuid }} // Pasar el uuid como parámetro
        />
      </Tab.Navigator>
    </View>
  );
};

export default RestaurantScreen;
