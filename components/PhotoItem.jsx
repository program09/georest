import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PrimaryButton from './ButtonPrimary';

const PhotoItem = ({ label, photo, onPress }) => {
    return (
        <View style={styles.itemphotocontent}>
            <Image
                source={{ uri: photo || "https://via.placeholder.com/100" }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.itemphoto}>
                <Text style={styles.label}>{label}</Text>
                <PrimaryButton
                    title="Descargar tipos de foto"
                    onPress={onPress}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemphotocontent: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 15,
        padding: 5,
        backgroundColor: '#f8f8f8',
        borderRadius: 20,
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
    },
    itemphoto: {
        flex: 1,
    },
    image: {
        width: 150,
        height: 150,
        backgroundColor: "#ddd",
        borderRadius: 15,
    },
    button: {
        backgroundColor: "#2196F3",
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default PhotoItem;