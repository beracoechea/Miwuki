import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const VacunasList = ({ vacunas }) => {

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.vacunaItem}>
      <FontAwesome5 name="syringe" size={20} color="#4682B4" style={styles.iconoVacuna} />
      <View style={styles.textoVacuna}>
        <Text style={styles.vacunaNombre}>Nombre de la vacuna: {item.nombre} </Text>
        <Text style={styles.fechaText}>Fecha: {formatDate(item.fechaAplicacion)}</Text>
        <Text>Dosis aplicada: {item.dosis} ml. </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={vacunas}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={<Text style={styles.noVacunasText}>No hay vacunas registradas para esta mascota.</Text>}
      contentContainerStyle={styles.flatListContent}
    />
  );
};

const styles = StyleSheet.create({
  vacunaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ADD8E6',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  iconoVacuna: {
    marginRight: 10,
  },
  textoVacuna: {
    flex: 1,
  },
  vacunaNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4682B4',
    marginBottom: 5,
  },
  fechaText: {
    fontSize: 14,
    color: '#4682B4',
  },
  noVacunasText: {
    fontSize: 20,
    color: '#8B4513',
    textAlign: 'center',
    marginTop: 20,
  },
  flatListContent: {
    paddingBottom: 100,
  },
});

export default VacunasList;
