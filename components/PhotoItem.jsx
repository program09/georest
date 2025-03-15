import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PrimaryButton from './ButtonPrimary';
import { globalStyles } from '../styles/GlobalStyles';

const PhotoItem = ({ label, photo, onPress }) => {
    return (
        <View style={globalStyles.itemphotocontent}>
            <Image
                source={{ uri: photo || "https://via.placeholder.com/100" }}
                style={globalStyles.image}
                resizeMode="cover"
            />
            <View style={globalStyles.itemphoto}>
                <Text style={globalStyles.label}>{label}</Text>
                <PrimaryButton
                    title="Tomar foto"
                    onPress={onPress}
                />
            </View>
        </View>
    );
};

export default PhotoItem;