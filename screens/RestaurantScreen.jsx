import React, { useState, useCallback } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DatosTab from './restaurant/DatosTab'
import FotosTab from './restaurant/FotosTab'

const Tab = createBottomTabNavigator(); // Definir Tabs

const RestaurantScreen = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
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
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
  },
  footerButtons: {
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    height: 60,
    display: "flex",
    alignItems: "center",
    padding: 0,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 0,
    margin: 0,
    top: -10,
  },
});

export default RestaurantScreen;
