import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ButtonDanger = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f36464', // Color de fondo del botón
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    alignSelf: 'flex-start', // Makes the button adapt to content width
    minWidth: 'auto', // Allows the button to shrink based on content
  },
  buttonText: {
    color: '#fff', // Color del texto del botón
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ButtonDanger;