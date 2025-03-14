import React from 'react';
import { Text, StyleSheet } from 'react-native';

const PageTitle = ({ pageName }) => {
  return (
    <Text style={styles.titlepage}>/ {pageName}</Text>
  );
};

const styles = StyleSheet.create({
  titlepage: {
    fontSize: 18,
    marginTop:30,
    marginLeft:30,
    marginBottom:30,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default PageTitle;