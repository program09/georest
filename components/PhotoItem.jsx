import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PrimaryButton from './ButtonPrimary';
import { globalStyles } from '../styles/GlobalStyles';

const PhotoItem = ({ label, photo, onPress }) => {
    return (
        <View style={globalStyles.itemphotocontent}>
            <Image
                source={{ uri: photo || "https://i.blogs.es/6f44dd/google-2015-1/1366_2000.jpg" }}
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