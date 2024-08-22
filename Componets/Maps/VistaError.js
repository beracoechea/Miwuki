import React from 'react';
import { View, Text, Button, ImageBackground, StyleSheet } from 'react-native';

export const VistaError = ({ onPress }) => (
  <ImageBackground
    source={require('../../images/mapa.jpg')} // Ruta de la imagen de fondo
    style={styles.imageBackground}
  >
    <View style={styles.permisosContainer}>
      <Text style={styles.denegado}>Recuerda encender tu ubicación.   </Text>
      <Button title="Conceder Permiso" onPress={onPress} />
    </View>
  </ImageBackground>
);

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permisosContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  denegado: {
    color: 'black',
    fontSize: 20,
    marginBottom: 20,
  },
});
