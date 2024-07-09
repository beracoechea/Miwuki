import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Buttons = ({ handleEdit, handleToggleStatistics, showStatistics }) => {
  return (
    <>
      <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
        <Text style={styles.buttonText}>Editar</Text>
        <AntDesign name="edit" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.statsButton]} onPress={handleToggleStatistics}>
        <Text style={styles.buttonText}>{showStatistics ? 'Ocultar Estadísticas' : 'Mostrar Estadísticas'}</Text>
        <AntDesign name="linechart" size={24} color="#fff" />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#8B4513',
  },
  statsButton: {
    backgroundColor: '#4682B4',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginRight: '25%',
  },
});

export default Buttons;
