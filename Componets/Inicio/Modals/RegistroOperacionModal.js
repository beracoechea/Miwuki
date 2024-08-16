import React, { useState } from 'react';
import { View, Modal, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { registrarOperacion } from '../../Firebase/RegistroFirebase'; // Asegúrate de implementar esta función en tu archivo de Firebase
import Alerts, { ALERT_TYPES } from '../../Alerts/Alerts';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const RegistroOperacionModal = ({ email, mascotaId, visible, onClose, onSuccess }) => {
  const [fecha, setFecha] = useState('');
  const [detalles, setDetalles] = useState('');
  const [tratamientos, setTratamientos] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState(ALERT_TYPES.ERROR);
  const [alertMessage, setAlertMessage] = useState('');

  const handleAgregarOperacion = async () => {
    try {
      if (!fecha || !detalles) {
        throw new Error('Por favor completa todos los campos.    ');
      }

      // Validar que la fecha contenga solo números y tenga 8 caracteres (DDMMYYYY)
      if (!/^\d{8}$/.test(fecha)) {
        throw new Error('La fecha debe estar en el formato DDMMYYYY.    ');
      }

      await registrarOperacion({
        email,
        mascotaId,
        fecha, // La fecha ya está en formato DDMMYYYY
        detalles,
        tratamientos: tratamientos || '',
      });

      if (onSuccess) {
        onSuccess();
      }

      onClose();
      setFecha('');
      setDetalles('');
      setTratamientos('');
    } catch (error) {
      setAlertType(ALERT_TYPES.ERROR);
      setAlertMessage(error.message);
      setShowAlert(true);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  // Filtrar la entrada para permitir solo números
  const handleFechaChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, ''); // Remueve cualquier carácter que no sea numérico
    setFecha(numericText);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Agregar Operación</Text>
          <TextInput
            style={styles.input}
            placeholder="Fecha (DDMMYYYY)"
            placeholderTextColor="#8B4513"
            value={fecha}
            onChangeText={handleFechaChange}
            keyboardType="numeric" // Mostrar solo teclado numérico
            maxLength={8} // Limitar la entrada a 8 caracteres
          />
          <TextInput
            style={styles.input}
            placeholder="Detalles de la cirugía"
            placeholderTextColor="#8B4513"
            value={detalles}
            onChangeText={(text) => setDetalles(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Tratamientos post-operación (opcional)"
            placeholderTextColor="#8B4513"
            value={tratamientos}
            onChangeText={(text) => setTratamientos(text)}
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.buttonContainer} onPress={handleAgregarOperacion}>
              <FontAwesome5 name="save" size={18} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Guardar Operación</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <FontAwesome5 name="times" size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {showAlert && <Alerts type={alertType} message={alertMessage} onClose={closeAlert} />}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#8B4513',
    borderRadius: 5,
    marginBottom: 10,
    color: '#000',
  },
  buttonContainer: {
    backgroundColor: '#8B4513',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  buttonIcon: {
    marginRight: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default RegistroOperacionModal;
