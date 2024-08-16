// Buttons.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const Buttons = ({ handleEdit, handleCartilla, handleToggleStatistics, showStatistics, tipoMascota }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
        <Text style={styles.buttonText}>Editar     <FontAwesome5 name="edit" size={20} color="#fff"/></Text>
      </TouchableOpacity>
      {tipoMascota !== 'Ave' && ( // Mostrar el botón de Cartilla Médica solo si el tipo de mascota no es Ave
        <TouchableOpacity style={[styles.button, styles.cartillaButton]} onPress={handleCartilla}>
          <Text style={styles.buttonText}>Cartilla Médica      <FontAwesome5 name="address-book" size={20} color="#fff"/></Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={[styles.button, styles.statisticsButton]} onPress={handleToggleStatistics}>
        <Text style={styles.buttonText}>{showStatistics ? 'Ocultar Recomendaciones   ' : 'Recomendaciones   '}
           <FontAwesome5 name="info-circle" size={20} color="#fff" /></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '80%',
  },
 
  button: {
    marginBottom:10,

    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#8B4513', // Color para Editar
  },
  cartillaButton: {
    backgroundColor: '#4682B4', // Color para Cartilla Médica
  },
  statisticsButton: {
    backgroundColor: '#3CB371', // Color para Estadísticas
  },
});

export default Buttons;
