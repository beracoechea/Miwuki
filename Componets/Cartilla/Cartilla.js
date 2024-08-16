import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { obtenerVacunasMascota, obtenerOperacionesMascota, suscribirACambiosVacunas, suscribirACambiosOperaciones } from '../Firebase/ConsultasFirebase'; 
import RegistroVacunaModal from '../Inicio/Modals/RegistroVacunaModal'; 
import RegistroOperacionModal from '../Inicio/Modals/RegistroOperacionModal';
import Alerts, { ALERT_TYPES } from '../Alerts/Alerts'; 
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import VacunasList from './VacunasList';  // Importa el componente de vacunas
import OperacionesList from './OperacionesList';  // Importa el componente de operaciones

const Cartilla = ({ route }) => {
  const { mascotaId, email } = route.params;
  const [vacunas, setVacunas] = useState([]);
  const [operaciones, setOperaciones] = useState([]);
  const [vacunaModalVisible, setVacunaModalVisible] = useState(false);
  const [operacionModalVisible, setOperacionModalVisible] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerVacunas();
    obtenerOperaciones();
  }, []);

  useEffect(() => {
    const unsubscribeVacunas = suscribirACambiosVacunas(email, mascotaId, (change) => {
      if (change.type === 'added' || change.type === 'modified' || change.type === 'removed') {
        obtenerVacunas();
      }
    });

    const unsubscribeOperaciones = suscribirACambiosOperaciones(email, mascotaId, (change) => {
      if (change.type === 'added' || change.type === 'modified' || change.type === 'removed') {
        obtenerOperaciones();
      }
    });

    return () => {
      unsubscribeVacunas();
      unsubscribeOperaciones();
    };
  }, [email, mascotaId]);

  const obtenerVacunas = async () => {
    try {
      const vacunasData = await obtenerVacunasMascota(email, mascotaId);
      setVacunas(vacunasData);
    } catch (error) {
      console.error('Error al obtener vacunas:    ', error);
      setError('Error al obtener vacunas');
    }
  };

  const obtenerOperaciones = async () => {
    try {
      const operacionesData = await obtenerOperacionesMascota(email, mascotaId);
      setOperaciones(operacionesData);
    } catch (error) {
      console.error('Error al obtener operaciones:    ', error);
      setError('Error al obtener operaciones');
    }
  };

  const closeAlert = () => {
    setError(null);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#8B4513', '#FFFFFF', '#ADD8E6']} style={styles.header}>
        <Text style={styles.title}>Cartilla Veterinaria</Text>
      </LinearGradient>
      <View style={styles.content}>
        <VacunasList vacunas={vacunas} />
        <OperacionesList operaciones={operaciones} />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.agregarButton} onPress={() => setVacunaModalVisible(true)}>
            <FontAwesome5 name="plus-circle" size={20} color="#FFFFFF" />
            <Text style={styles.agregarButtonText}>Vacuna</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.agregarButton} onPress={() => setOperacionModalVisible(true)}>
            <FontAwesome5 name="plus-circle" size={20} color="#FFFFFF" />
            <Text style={styles.agregarButtonText}>Operación</Text>
          </TouchableOpacity>
        </View>
      </View>
      <RegistroVacunaModal
        email={email}
        mascotaId={mascotaId}
        visible={vacunaModalVisible}
        onClose={() => setVacunaModalVisible(false)}
        onSuccess={obtenerVacunas}
      />
      <RegistroOperacionModal
        email={email}
        mascotaId={mascotaId}
        visible={operacionModalVisible}
        onClose={() => setOperacionModalVisible(false)}
        onSuccess={obtenerOperaciones}
      />
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
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: -20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  agregarButton: {
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
});

export default Cartilla;
