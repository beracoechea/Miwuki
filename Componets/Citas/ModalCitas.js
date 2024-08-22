import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Alerts, { ALERT_TYPES } from '../Alerts/Alerts';
import { Picker } from '@react-native-picker/picker'; // Importa el picker
import moment from 'moment';

const ModalCitas = ({ visible, onClose, onGuardarCita, nuevaCita, setNuevaCita }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(ALERT_TYPES.INFO);
  
  // Nuevo estado para la hora seleccionada
  const [horaSeleccionada, setHoraSeleccionada] = useState('09:00');

  const handleGuardarCita = () => {
    const today = moment().startOf('day');
    const fechaSeleccionada = moment(nuevaCita.fecha, 'DD/MM/YYYY');

    // Validar que la fecha sea válida
    if (!fechaSeleccionada.isValid()) {
      setAlertMessage('Por favor, ingresa una fecha válida en el formato DD/MM/YYYY.');
      setAlertType(ALERT_TYPES.ERROR);
      setAlertVisible(true);
      return;
    }

    // Validar que la fecha no sea anterior a la actual
    if (fechaSeleccionada.isBefore(today)) {
      setAlertMessage('La fecha seleccionada no puede ser anterior a la fecha actual.');
      setAlertType(ALERT_TYPES.ERROR);
      setAlertVisible(true);
      return;
    }

    // Guardar la fecha y la hora en el formato deseado
    const fechaGuardada = fechaSeleccionada.format('DD/MM/YYYY');
    
    // Crear objeto de cita completo con la hora
    const citaCompleta = {
      ...nuevaCita,
      fecha: fechaGuardada,
      hora: horaSeleccionada,
      estado: "pendiente" // Asegúrate de incluir el estado si es necesario
    };

    console.log('Cita a guardar:', citaCompleta); // Log para verificar el objeto

    // Si la fecha y hora son válidas, proceder a guardar la cita
    onGuardarCita(citaCompleta); // Llama a la función para guardar la cita en el componente padre
    onClose(); // Cierra el modal
  };

  // Función para manejar el cambio de hora en el Picker
  const handleHoraChange = (itemValue) => {
    setHoraSeleccionada(itemValue);
    setNuevaCita({ ...nuevaCita, hora: itemValue }); // Actualiza la hora en nuevaCita
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Solicitar Cita</Text>
          <TextInput
            placeholder="Fecha (DD/MM/YYYY)"
            style={styles.input}
            placeholderTextColor="#8B4513"
            onChangeText={(text) => setNuevaCita({ ...nuevaCita, fecha: text })}
            value={nuevaCita.fecha}
          />
          <TextInput
            placeholder="ID de tu Veterinaria"
            style={styles.input}
            placeholderTextColor="#8B4513"
            onChangeText={(text) => setNuevaCita({ ...nuevaCita, veterinariaId: text })}
            value={nuevaCita.veterinariaId}
          />
          <TextInput
            placeholder="Motivo"
            style={styles.input}
            placeholderTextColor="#8B4513"
            onChangeText={(text) => setNuevaCita({ ...nuevaCita, motivo: text })}
            value={nuevaCita.motivo}
          />
          
          {/* Picker para seleccionar la hora */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Seleccionar Hora</Text>
            <Picker
              selectedValue={horaSeleccionada}
              onValueChange={handleHoraChange} // Cambia la función aquí
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              {Array.from({ length: 13 }, (_, index) => {
                const hour = index + 9; // Horas de 9 a 21
                const displayHour = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
                return (
                  <Picker.Item key={hour} label={displayHour} value={`${hour}:00`} />
                );
              })}
            </Picker>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.buttonContainer} onPress={handleGuardarCita}>
              <FontAwesome5 name="save" size={18} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Guardar Cita</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <FontAwesome5 name="times" size={18} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {alertVisible && (
        <Alerts type={alertType} message={alertMessage} onClose={() => setAlertVisible(false)} />
      )}
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
  pickerContainer: {
    width: '100%',
    marginBottom: 10,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#8B4513',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#8B4513', // Fondo café
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

export default ModalCitas;
