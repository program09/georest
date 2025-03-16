import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import RestaurantScreen from './screens/RestaurantScreen';
import { enableScreens } from 'react-native-screens';


enableScreens(); // Habilitar react-native-screens

const Stack = createNativeStackNavigator(); // Habilitar native-stack

const App = () => {

  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'GeoRest'}}
        />
        <Stack.Screen
          name="Restaurant"
          component={RestaurantScreen}
          options={{title: 'Restaurant'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;