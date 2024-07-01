import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { obtenerDatosMascotaPorId } from '../../Firebase/ConsultasFirebase';
import LoadingModal from '../../Screens/LoadingModal';
import avatarMapPerros from '../../TiposMascotas/ImagenesPerros';
import avatarMapGatos from '../../TiposMascotas/ImagenesGatos';
import avatarMapAves from '../../TiposMascotas/ImagenesAves';
import avatarMapMamiferos from '../../TiposMascotas/ImagenesMamiferos';

const MascotaCard = ({ route }) => {
  const { mascotaId, email } = route.params;
  const [datosMascota, setDatosMascota] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatosMascota = async (emailUsuario, mascotaId) => {
      try {
        const datosMascota = await obtenerDatosMascotaPorId(emailUsuario, mascotaId);
        setDatosMascota(datosMascota);
        setShowLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos de la mascota:', error);
        setError(error);
        setShowLoading(false);
      }
    };

    obtenerDatosMascota(email, mascotaId);
  }, [email, mascotaId]);

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
        return null; // Manejar caso por defecto si es necesario
    }
  };

  if (showLoading) {
    return <LoadingModal visible={showLoading} onClose={() => {}} />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Image source={getAvatar(datosMascota.tipoMascota, datosMascota.avatar)} style={styles.avatar} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.text}>Nombre: {datosMascota.nombreMascota} </Text>
          <Text style={styles.text}>Peso: {datosMascota.pesoMascota} kg </Text>
          <Text style={styles.text}>Edad: {datosMascota.edadMascota} años </Text>
          <Text style={styles.text}>Sexo: {datosMascota.sexo} </Text>
          <Text style={styles.text}>Raza: {datosMascota.razaMascota} </Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADD8E6',
  },
  card: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 3, // Efecto de sombra para Android
    shadowColor: '#000', // Efecto de sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8B4513',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  infoContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  text: {
    marginBottom: 10,
    color:'#000',
  },
  button: {
    backgroundColor: '#8B4513',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default MascotaCard;
