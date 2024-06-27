import React, { useState } from 'react';
import { View, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { editarDatosUsuario } from '../../Firebase/EdicionFirebase';
import Alerts, { ALERT_TYPES } from '../../Alerts/Alerts';

const ModalEdit = ({ visible, onClose, user, onUpdateSuccess }) => {
  const [editedParam, setEditedParam] = useState('');
  const [editedValue, setEditedValue] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '' });

  const saveChanges = async () => {
    if (!editedParam || !editedValue) {
      setAlert({ type: ALERT_TYPES.ERROR, message: 'Por favor completa por lo menos un campo.   ' });
      return;
    }

    if (editedParam === 'nombre' && /\d/.test(editedValue)) {
      setAlert({ type: ALERT_TYPES.ERROR, message: 'El nombre no debe contener números.    ' });
      return;
    }

    if (editedParam === 'apellidos' && /\d/.test(editedValue)) {
      setAlert({ type: ALERT_TYPES.ERROR, message: 'Los apellidos no deben contener números.     ' });
      return;
    }

    if (editedParam === 'telefono' && !/^\d+$/.test(editedValue)) {
      setAlert({ type: ALERT_TYPES.ERROR, message: 'Por favor ingresa solo números válidos para el teléfono.    ' });
      return;
    }

    const newData = { ...user, [editedParam]: editedValue };

    try {
      await editarDatosUsuario(user.email, newData);
      setAlert({ type: ALERT_TYPES.EXIT, message: 'Datos actualizados correctamente en Firebase    ' });

      setTimeout(() => {
        onClose(); // Cerrar el modal después de 2 segundos de mostrar el mensaje de éxito
        onUpdateSuccess(newData); // Notificar a Inicio.js que los datos se actualizaron
      }, 2000);
    } catch (error) {
      setAlert({ type: ALERT_TYPES.ERROR, message: 'Hubo un problema al guardar los cambios. Por favor, intenta nuevamente.      ' });
    }
  };

  const handleInputChange = (param, value) => {
    setEditedParam(param);
    setEditedValue(value);
    setAlert({ type: '', message: '' }); // Limpiar errores al cambiar algún campo
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#CCCCCC"
            onChangeText={value => handleInputChange('nombre', value)}
            value={editedParam === 'nombre' ? editedValue : ''}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellidos"
            placeholderTextColor="#CCCCCC"
            onChangeText={value => handleInputChange('apellidos', value)}
            value={editedParam === 'apellidos' ? editedValue : ''}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#CCCCCC"
            onChangeText={value => handleInputChange('telefono', value)}
            value={editedParam === 'telefono' ? editedValue : ''}
            keyboardType="numeric"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="archive-cancel" size={40} color="#FF0000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={saveChanges}>
              <FontAwesome5 name="save" size={40} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {alert.message ? <Alerts type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} /> : null}
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
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default ModalEdit;
