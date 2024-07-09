import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import { actualizarDatosMascota } from '../../Firebase/EdicionFirebase';
import Alerts, { ALERT_TYPES } from '../../Alerts/Alerts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ModalEditMascota = ({ visible, onClose, datosMascota, email, mascotaId }) => {
  const [nombreMascota, setNombreMascota] = useState('');
  const [pesoMascota, setPesoMascota] = useState(0); // Inicializado como número entero
  const [razaMascota, setRazaMascota] = useState('');
  const [edadMascota, setEdadMascota] = useState(0); // Inicializado como número entero
  const [estatura, setEstatura] = useState(0); // Inicializado como número entero
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showModal, setShowModal] = useState(visible); // Estado para controlar la visibilidad del modal

  useEffect(() => {
    if (datosMascota) {
      setNombreMascota(datosMascota.nombreMascota || '');
      setPesoMascota(parseInt(datosMascota.pesoMascota) || 0); // Convertir a número entero
      setRazaMascota(datosMascota.razaMascota || '');
      setEdadMascota(parseInt(datosMascota.edadMascota) || 0); // Convertir a número entero
    }
  }, [datosMascota]);

  useEffect(() => {
    setShowModal(visible); // Actualizar el estado del modal cuando cambie la visibilidad
  }, [visible]);

  const handleSave = async () => {
    // Validación de nombre y raza para asegurar que no contengan números
    const nombreRegex = /^[A-Za-z\s]+$/;
    const razaRegex = /^[A-Za-z\s]+$/;

    if (!nombreRegex.test(nombreMascota)) {
      setAlertType(ALERT_TYPES.ERROR);
      setAlertMessage('El nombre no puede contener números.  ');
      return;
    }

    if (!razaRegex.test(razaMascota)) {
      setAlertType(ALERT_TYPES.ERROR);
      setAlertMessage('La raza no puede contener números.  ');
      return;
    }

    // Validación de peso, edad y estatura para asegurar que solo contengan números
    const pesoRegex = /^[0-9]*$/;
    const edadRegex = /^[0-9]*$/;
    const estaturaRegex = /^[0-9]*$/;

    if (!pesoRegex.test(pesoMascota.toString())) {
      setAlertType(ALERT_TYPES.ERROR);
      setAlertMessage('El peso debe ser un número válido.  ');
      return;
    }

    if (!edadRegex.test(edadMascota.toString())) {
      setAlertType(ALERT_TYPES.ERROR);
      setAlertMessage('La edad debe ser un número válida.  ');
      return;
    }


    // Comprobar si los datos son iguales a como estaban inicialmente
    if (
      nombreMascota === datosMascota.nombreMascota &&
      pesoMascota === parseInt(datosMascota.pesoMascota) &&
      razaMascota === datosMascota.razaMascota &&
      edadMascota === parseInt(datosMascota.edadMascota) 
    ) {
      onClose(false); // Cerrar modal sin realizar cambios
      return;
    }

    try {
      await actualizarDatosMascota(email, mascotaId, {
        nombreMascota,
        pesoMascota,
        razaMascota,
        edadMascota,
        estatura,
      });
      setAlertType(ALERT_TYPES.EXIT);
      setAlertMessage('Datos actualizados. ');
      // Esperar un momento antes de cerrar el modal
      setTimeout(() => {
        setShowModal(false); // Ocultar el modal después de un tiempo
        onClose(true); // Indica que se guardaron los cambios
      }, 2000); // 2000 milisegundos = 2 segundos
    } catch (error) {
      console.error('Error al actualizar los datos de la mascota:', error);
      onClose(false);
    }
  };

  return (
    <Modal visible={showModal} animationType="slide" transparent={false}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Mascota</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={nombreMascota}
              onChangeText={setNombreMascota}
            />
            <TextInput
              style={styles.input}
              placeholder="Peso"
              value={pesoMascota.toString()} // Convertir a cadena para TextInput
              onChangeText={(text) => setPesoMascota(parseInt(text) || 0)} // Convertir a número entero
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Raza"
              value={razaMascota}
              onChangeText={setRazaMascota}
            />
            <TextInput
              style={styles.input}
              placeholder="Edad"
              value={edadMascota.toString()} // Convertir a cadena para TextInput
              onChangeText={(text) => setEdadMascota(parseInt(text) || 0)} // Convertir a número entero
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
              <MaterialCommunityIcons name="content-save-edit" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonClose} onPress={() => onClose(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
              <MaterialCommunityIcons name="archive-cancel" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {alertType && (
        <Alerts
          type={alertType}
          message={alertMessage}
          onClose={() => {
            setAlertType(null);
            setAlertMessage('');
          }}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    color: '#000',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#8B4513',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonClose: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#D9534F',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ModalEditMascota;
