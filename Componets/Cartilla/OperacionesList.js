import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const OperacionesList = ({ operaciones }) => {

  // Función para formatear la fecha en formato DD/MM/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const year = dateStr.substring(4, 8);
    return `${day}/${month}/${year}`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.operacionItem}>
      <FontAwesome5 name="stethoscope" size={20} color="#8B0000" style={styles.iconoOperacion} />
      <View style={styles.textoOperacion}>
        <Text style={styles.operacionNombre}>Tipo de operación: {item.detalles} </Text>
        <Text style={styles.fechaText}>Fecha: {formatDate(item.fecha)} </Text>
        <Text style={styles.fechaText}>Fecha registrada: {item.fechaRegistro} </Text>
        <Text style={styles.tratamientoText}>Tratamientos: {item.tratamientos} </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={operaciones}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={<Text style={styles.noOperacionesText}>No hay operaciones registradas para esta mascota.</Text>}
      contentContainerStyle={styles.flatListContent}
    />
  );
};

const styles = StyleSheet.create({
  operacionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE4E1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  iconoOperacion: {
    marginRight: 10,
  },
  textoOperacion: {
    flex: 1,
  },
  operacionNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 5,
  },
  fechaText: {
    fontSize: 14,
    color: '#8B0000',
    marginBottom: 5,
  },
  tratamientoText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  noOperacionesText: {
    fontSize: 20,
    color: '#8B4513',
    textAlign: 'center',
    marginTop: 20,
  },
  flatListContent: {
    paddingBottom: 100, // Ajustar según sea necesario para evitar que el botón quede oculto detrás del teclado
  },
});

export default OperacionesList;
