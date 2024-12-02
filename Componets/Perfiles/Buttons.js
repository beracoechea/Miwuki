import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Buttons = ({ onSave, onCancel, saveDisabled }) => (
  <>
    <TouchableOpacity
      style={[styles.saveButton, saveDisabled && styles.saveButtonDisabled]}
      onPress={onSave}
      disabled={saveDisabled}
    >
      <Text style={styles.saveButtonText}>Guardar</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
      <Text style={styles.saveButtonText}>Cancelar</Text>
    </TouchableOpacity>
  </>
);

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginTop: 3,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  cancelButton: {
    backgroundColor: '#FF0C00',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginTop: 3,
    alignItems: 'center',
  },
});

export default Buttons;
