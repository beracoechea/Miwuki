import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import avatarMapPerros from './ImagenesPerros';
import avatarMapGatos from './ImagenesGatos';
import avatarMapAves from './ImagenesAves';
import avatarMapMamiferos from './ImagenesMamiferos';

const Avatar = ({ datosMascota }) => {
  const getAvatar = (tipoMascota, avatarFileName) => {
    switch (tipoMascota) {
      case 'Perro':
        return avatarMapPerros[avatarFileName];
      case 'Gato':
        return avatarMapGatos[avatarFileName];
      case 'Ave':
        return avatarMapAves[avatarFileName];
      case 'Mamifero':
        return avatarMapMamiferos[avatarFileName];
      default:
        return null;
    }
  };

  return (
    <View style={styles.avatarContainer}>
      <Image source={getAvatar(datosMascota.tipoMascota, datosMascota.avatar)} style={styles.avatar} />
      <FontAwesome
        name={datosMascota.sexo === 'masculino' ? 'mars' : 'venus'}
        size={30}
        color={datosMascota.sexo === 'masculino' ? '#0000FF' : '#FF69B4'}
        style={styles.genderIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8B4513',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  genderIcon: {
    position: 'absolute',
    top: 10,
    right: -80,
  },
});

export default Avatar;
