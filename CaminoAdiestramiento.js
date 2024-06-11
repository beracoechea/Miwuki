import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class CaminoAdiestramiento extends Component {
  // Función para manejar la redirección cuando se presiona una imagen
  handleNavigation = (entrenamiento) => {
    this.props.navigation.navigate(entrenamiento);
  };

  render() {
    return (
      <LinearGradient colors={['#8B4513', '#FFFFFF', '#ADD8E6']} style={styles.container}>
        <Text style={styles.header}>ADIESTRAMIENTO CANINO</Text>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <TouchableOpacity onPress={() => this.handleNavigation('Basico')}>
            <View style={styles.rightContainer}>
              <Text style={styles.title}>Entrenamiento Básico</Text>
              <Image source={require('./images/Botones/Basico/Basico.jpeg')} style={styles.image} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleNavigation('Avanzado')}>
            <View style={[styles.leftContainer, { flexDirection: 'row-reverse' }]}>
              <Text style={styles.title}>Entrenamiento Avanzado</Text>
            <Image source={require('./images/Botones/Avanzado/Avanzado.jpeg')} style={styles.image} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleNavigation('Conducta')}>
            <View style={styles.rightContainer}>
              <Text style={styles.title}>Entrenamiento para Conducta</Text>
              <Image source={require('./images/Botones/Conducta/Conducta.jpeg')} style={styles.image} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleNavigation('Deportivo')}>
            <View style={[styles.leftContainer, { flexDirection: 'row-reverse' }]}>
              <Text style={styles.title}>Entrenamiento Deportivo</Text>
              <Image source={require('./images/Botones/Deportivo/Deportivo.jpg')} style={styles.image} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleNavigation('Cachorros')}>
            <View style={styles.rightContainer}>
              <Text style={styles.title}>Entrenamiento para Cachorros</Text>
              <Image source={require('./images/Botones/Cachorros/Cachorros.jpeg')} style={styles.image} />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
 
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
    marginTop:20,
  },
  scrollView: {
    flexGrow: 1,
  },
  image: {
    width: 140,
    height: 130,
    resizeMode: 'cover',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'black',
    maxWidth: 140,
  },
  leftContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
  },
  rightContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
  },
});