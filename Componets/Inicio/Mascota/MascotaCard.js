import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView,Image } from 'react-native';
import { obtenerDatosMascotaPorId } from '../../Firebase/ConsultasFirebase';
import LoadingModal from '../../Screens/LoadingModal';
import ModalEditMascota from '../Modals/ModalEditMascota';
import LinearGradient from 'react-native-linear-gradient'; 
import avatarMapPerros from '../../TiposMascotas/ImagenesPerros'; // Asegúrate de importar correctamente
import Buttons from './Buttons';
import Statistics from './Statistics';

import { useNavigation } from '@react-navigation/native';

const MascotaCard = ({ route }) => {
  const { mascotaId, email } = route.params;
  const [datosMascota, setDatosMascota] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const navigation = useNavigation(); // Obtiene la instancia de navegación

  useEffect(() => {
    const fetchDatosMascota = async (emailUsuario, mascotaId) => {
      try {
        const datos = await obtenerDatosMascotaPorId(emailUsuario, mascotaId);
        setDatosMascota(datos);
        setShowLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos de la mascota:', error);
        setError(error);
        setShowLoading(false);
      }
    };

    fetchDatosMascota(email, mascotaId);
  }, [email, mascotaId]);

  const handleEdit = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = (updated) => {
    setIsModalVisible(false);
    if (updated) {
      setShowLoading(true);
      obtenerDatosMascotaPorId(email, mascotaId)
        .then((datos) => {
          setDatosMascota(datos);
          setShowLoading(false);
        })
        .catch((error) => {
          console.error('Error al obtener los datos de la mascota:', error);
          setError(error);
          setShowLoading(false);
        });
    }
  };

  const handleToggleStatistics = () => {
    setShowStatistics(!showStatistics);
  };

  const handleCartilla = () => {
    // Navegar a la vista de Cartilla Médica y pasar el ID de la mascota como parámetro
    navigation.navigate('Cartilla', { mascotaId: mascotaId, email: email });
  };

  if (showLoading) {
    return <LoadingModal visible={showLoading} onClose={() => setShowLoading(false)} />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  // Asegúrate de que la mascota tiene un avatar válido, si no, usa una imagen predeterminada
  const avatarSource = avatarMapPerros[datosMascota.avatar] ? avatarMapPerros[datosMascota.avatar].image : require('../../../images/Avatars/Aleatorio.jpg');

  return (
    <LinearGradient colors={['#8B4513', '#FFFFFF', '#ADD8E6']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            {/* Usamos el avatar correctamente con la imagen de la mascota */}
            <Image source={avatarSource} style={styles.avatar} />
            <View style={styles.infoContainer}>
              <Text style={styles.nameText}>{datosMascota.nombreMascota} </Text>

              <View style={styles.column}>
                <View style={styles.row}>
                  <Text style={styles.text}>Peso: {String(datosMascota.pesoMascota)} kg </Text>
                  <Text style={styles.text}>Edad: {String(datosMascota.edadMascota)} años </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.text}>Raza: {datosMascota.razaMascota} </Text>
                  {datosMascota.tipoMascota === 'Perro' || datosMascota.tipoMascota === 'Gato' ? (
                    <Text style={styles.text}>Tamaño: {datosMascota.tamaño} </Text>
                  ) : null}
                </View>
              </View>
            </View>
            <Buttons
              handleEdit={handleEdit}
              handleCartilla={handleCartilla}
              handleToggleStatistics={handleToggleStatistics}
              showStatistics={showStatistics}
              tipoMascota={datosMascota.tipoMascota} // Pasamos el tipo de mascota para decidir la visibilidad del botón
            />
          </View>
          {showStatistics && <Statistics datosMascota={datosMascota} />}
        </View>
      </ScrollView>
      <ModalEditMascota
        visible={isModalVisible}
        onClose={handleCloseModal}
        datosMascota={datosMascota}
        email={email}
        mascotaId={mascotaId}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADD8E6',
  },
  cardContainer: {
    alignItems: 'center',
    paddingVertical: '50%',
    width: '130%',
  },
  card: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  cardContent: {
    alignItems: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 10,
  },
  text: {
    color: '#000',
    marginLeft: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});

export default MascotaCard;
