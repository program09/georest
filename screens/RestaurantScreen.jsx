import React from 'react';
import { View, StyleSheet } from 'react-native';
import PageTitle from '../components/PageTitle';

const RestaurantScreen = () => {
  return (
    <View style={styles.container}>
      <PageTitle pageName="GeoRest" />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default RestaurantScreen;
