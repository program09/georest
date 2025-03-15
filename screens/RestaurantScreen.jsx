import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DatosTab from './restaurant/DatosTab'
import FotosTab from './restaurant/FotosTab'
import { globalStyles } from "../styles/GlobalStyles";
import PageTitle from "../components/PageTitle";

const Tab = createBottomTabNavigator();

const RestaurantScreen = ({ route }) => {
  const { location, uuid: routeUuid } = route.params;
  const uuid = routeUuid || location?.uuid || 0; // Get UUID from route params

  const photos = [
    {
      type: {
        uuid: 1,
        path: 'https://i.blogs.es/6f44dd/google-2015-1/1366_2000.jpg'
      }
    },
    {
      type: {
        uuid: 2,
        path: 'https://i.blogs.es/ce51e2/significado-iconos-logos-google-apps/1366_2000.jpeg'
      }
    },
    {
      type: {
        uuid: 3,
        path: 'https://i.blogs.es/6f44dd/google-2015-1/1366_2000.jpg'
      }
    }
  ]

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
          component={DatosTab}
          initialParams={{ ...location, uuid }}
        />
        <Tab.Screen
          name="Fotos"
          component={FotosTab}
          initialParams={{ uuid, photos }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default RestaurantScreen;
