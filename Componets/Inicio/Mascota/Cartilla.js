import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { obtenerVacunasMascota, suscribirACambiosVacunas } from '../../Firebase/ConsultasFirebase'; 
import RegistroVacunaModal from '../Modals/RegistroVacunaModal'; 
import Alerts, { ALERT_TYPES } from '../../Alerts/Alerts'; 
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Cartilla = ({ route }) => {
  const { mascotaId, email } = route.params;
  const [vacunas, setVacunas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);

  // Obtener vacunas al cargar el componente
  useEffect(() => {
    obtenerVacunas();
  }, []);

  // Suscripción a cambios en las vacunas
  useEffect(() => {
    const unsubscribe = suscribirACambiosVacunas(email, mascotaId, (change) => {
      if (change.type === 'added' || change.type === 'modified' || change.type === 'removed') {
        obtenerVacunas();
      }
    });

    return () => unsubscribe();
  }, [email, mascotaId]);

  // Función para obtener las vacunas de la mascota
  const obtenerVacunas = async () => {
    try {
      const vacunasData = await obtenerVacunasMascota(email, mascotaId);
      setVacunas(vacunasData);
    } catch (error) {
      console.error('Error al obtener vacunas:', error);
      setError('Error al obtener vacunas');
    }
  };

  // Función para cerrar la alerta
  const closeAlert = () => {
    setError(null);
  };

  // Función para formatear la fecha de aplicación de la vacuna
  const formatDate = (timestamp) => {
    try {
      if (!timestamp) {
        return '';
      }
      const date = new Date(timestamp); // Convertir el timestamp ISO 8601 a objeto Date
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return ''; // Manejar el error de forma adecuada según tu aplicación
    }
  };
  

  // Componente renderizado para cada item de FlatList
  const renderItem = ({ item }) => (
    <View style={styles.vacunaItem}>
      <FontAwesome5 name="syringe" size={20} color="#4682B4" style={styles.iconoVacuna} />
      <View style={styles.textoVacuna}>
        <Text style={styles.vacunaNombre}>Nombre de la vacuna: {item.nombre} </Text>
        <Text style={styles.fechaText}>Fecha: {formatDate(item.fechaAplicacion)}</Text>
        <Text>Dosis aplicada: {item.dosis} ml. </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#8B4513', '#FFFFFF', '#ADD8E6']} style={styles.header}>
        <Text style={styles.title}>Cartilla de Vacunación</Text>
      </LinearGradient>
      <View style={styles.content}>
        <FlatList
          data={vacunas}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<Text style={styles.noVacunasText}>No hay vacunas registradas para esta mascota.</Text>}
          contentContainerStyle={styles.flatListContent}
        />
        <TouchableOpacity style={styles.agregarButton} onPress={() => setModalVisible(true)}>
          <FontAwesome5 name="plus-circle" size={20} color="#FFFFFF" style={styles.iconoAgregar} />
          <Text style={styles.agregarButtonText}>Agregar Vacuna</Text>
        </TouchableOpacity>
      </View>
      {/* Componente de modal para registrar vacunas */}
      <RegistroVacunaModal
        email={email}
        mascotaId={mascotaId}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={obtenerVacunas} // Actualiza la lista de vacunas al registrar una nueva
      />
      {/* Mostrar alerta si hay un error */}
      {error && (
        <Alerts
          type={ALERT_TYPES.ERROR}
          message={error}
          onClose={closeAlert}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50, // Ajustar según sea necesario
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom:30,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: -20, // Ajuste para superponer el borde redondeado del contenedor sobre el LinearGradient
  },
  vacunaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ADD8E6',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  iconoVacuna: {
    marginRight: 10,
  },
  textoVacuna: {
    flex: 1,
  },
  vacunaNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4682B4',
    marginBottom: 5,
  },
  fechaText: {
    fontSize: 14,
    color: '#4682B4',
  },
  noVacunasText: {
    fontSize: 20,
    color: '#8B4513',
    textAlign: 'center',
    marginTop: 20,
  },
  flatListContent: {
    paddingBottom: 100, // Ajustar según sea necesario para evitar que el botón quede oculto detrás del teclado
  },
  agregarButton: {
    position: 'absolute',
    bottom: 20,
    left: '43%',
    transform: [{ translateX: -50 }],
    flexDirection: 'row',
    backgroundColor: '#8B4513',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  agregarButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  iconoAgregar: {
    marginRight: 10,
  },
});

export default Cartilla;
