import React, { useState, useCallback } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DatosTab from './restaurant/DatosTab'
import FotosTab from './restaurant/FotosTab'
import { globalStyles } from "../styles/GlobalStyles";
import PageTitle from "../components/PageTitle";

const Tab = createBottomTabNavigator(); // Definir Tabs

const RestaurantScreen = () => {
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
        <Tab.Screen name="Datos" component={DatosTab} />
        <Tab.Screen name="Fotos" component={FotosTab} />
      </Tab.Navigator>
    </View>
  );
};

export default RestaurantScreen;
