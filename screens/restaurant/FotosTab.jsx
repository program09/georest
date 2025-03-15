import React, { useState, useCallback } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import PhotoItem from "../../components/PhotoItem";

const FotosTab = () => {
    const [foto1, setFoto1] = useState(null);
    const [foto2, setFoto2] = useState(null);
  
    const tomarFoto = useCallback((setFoto) => {
      setFoto("https://via.placeholder.com/100"); // Simulación de foto
    }, []);
  
    return (
      <ScrollView style={styles.container}>
        <View style={styles.containerTab}>
            <PhotoItem label="Etiqueta Foto 1" photo={foto1} onPress={() => tomarFoto(setFoto1)} />
            <PhotoItem label="Etiqueta Foto 2" photo={foto2} onPress={() => tomarFoto(setFoto2)} />
            
            <View style={styles.footerButtons}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]}>
                <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
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
    button: {
      backgroundColor: "#2196F3",
      padding: 10,
      alignItems: "center",
      borderRadius: 5,
      marginBottom: 10,
    },
    cancelButton: {
      backgroundColor: "#f44336",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    footerButtons: {
      width: '100%',
      flexDirection: "row",
      justifyContent: "space-between",
    },
    tabBar: {
      borderTopWidth: 1,
      borderTopColor: "#ccc",
      height: 80,
      display: "flex",
      alignItems: "center",
      padding: 0,
    },
    tabLabel: {
      fontSize: 16, 
      fontWeight: "bold",
      color: "#333",
    },
    tabIndicator: {
      backgroundColor:'#000'
    }
  });

  export default FotosTab;