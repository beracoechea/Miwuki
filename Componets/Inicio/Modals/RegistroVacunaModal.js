import React, { useState } from 'react';
import { View, Modal, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { registrarVacuna } from '../../Firebase/RegistroFirebase';
import Alerts, { ALERT_TYPES } from '../../Alerts/Alerts';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const RegistroVacunaModal = ({ email, mascotaId, visible, onClose, onSuccess }) => {
  const [nombreVacuna, setNombreVacuna] = useState('');
  const [dosis, setDosis] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState(ALERT_TYPES.ERROR);
  const [alertMessage, setAlertMessage] = useState('');

  const handleAgregarVacuna = async () => {
    try {
      if (!nombreVacuna || !dosis) {
        throw new Error('Por favor completa todos los campos.');
      }

      if (!/^\d+$/.test(dosis)) {
        throw new Error('La dosis debe ser un valor numérico.');
      }

      await registrarVacuna({
        email,
        mascotaId,
        nombre: nombreVacuna,
        dosis: parseInt(dosis),
      });

      if (onSuccess) {
        onSuccess();
      }

      onClose();
      setNombreVacuna('');
      setDosis('');
    } catch (error) {
      console.error('Error al registrar la vacuna:', error);
      setAlertType(ALERT_TYPES.ERROR);
      setAlertMessage(error.message);
      setShowAlert(true);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Agregar Vacuna</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la vacuna"
            placeholderTextColor="#8B4513"
            value={nombreVacuna}
            onChangeText={(text) => setNombreVacuna(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Dosis"
            placeholderTextColor="#8B4513"
            value={dosis}
            onChangeText={(text) => setDosis(text)}
            keyboardType="numeric"
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.buttonContainer} onPress={handleAgregarVacuna}>
              <FontAwesome5 name="save" size={18} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Guardar Vacuna</Text>
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

export default RegistroVacunaModal;
