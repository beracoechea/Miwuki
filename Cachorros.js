import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class Deportivo extends Component {
  handleButtonPress = (url) => {
    Linking.openURL(url); // Abre el enlace en el navegador predeterminado
  };

  render() {
    return (
      <LinearGradient colors={['#8B4513', '#FFFFFF', '#ADD8E6']} style={styles.background}>
        {/* Contenedor para imágenes de agilidad */}
        <View style={[styles.container, styles.containerShadow]}>
          {/* Imágenes */}
          <Image source={require('./images/Botones/Cachorros/PrimerosPasos.jpeg')} style={[styles.image, styles.imageLeft]} />
          {/* Botones */}
          <View style={[styles.buttonContainer, { alignItems: 'flex-end' }]}>
            <TouchableOpacity onPress={() => this.handleButtonPress('https://www.youtube.com/watch?v=xluNhJ09YFA')} style={styles.button}>
              <Text style={styles.buttonText}> Cachorros desde cero</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleButtonPress('https://www.youtube.com/watch?v=BACFL9wMiss')} style={styles.button}>
              <Text style={styles.buttonText}>Primer día</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Contenedor para imágenes de pelota */}
        <View style={[styles.container, styles.containerShadow]}>
          {/* Botones */}
          <View style={[styles.buttonContainer, { alignItems: 'flex-start' }]}>
            <TouchableOpacity onPress={() => this.handleButtonPress('https://www.youtube.com/watch?v=B-Mqe_R2sj4')} style={styles.button}>
              <Text style={styles.buttonText}>Ir al baño</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleButtonPress('https://www.youtube.com/watch?v=YouokJPHLa0')} style={styles.button}>
              <Text style={styles.buttonText}>Sentarse</Text>
            </TouchableOpacity>
          </View>
          {/* Imagen decorativa */}
          <Image source={require('./images/Botones/Cachorros/Baño.jpeg')} style={[styles.image, styles.imageRight]} />
        </View>
        {/* Contenedor para imágenes de salto */}
        <View style={[styles.container, styles.containerShadow]}>
          {/* Imágenes */}
          <Image source={require('./images/Botones/Cachorros/Inquietos.jpeg')} style={[styles.image, styles.imageLeft]} />
          {/* Botones */}
          <View style={[styles.buttonContainer, { alignItems: 'flex-end' }]}>
            <TouchableOpacity onPress={() => this.handleButtonPress('https://www.youtube.com/watch?v=EHFW0Xu28LY')} style={styles.button}>
              <Text style={styles.buttonText}>Dejar de morder</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleButtonPress('https://www.youtube.com/watch?v=6cVW3s8C93w')} style={styles.button}>
              <Text style={styles.buttonText}>Adiestrar el primer día</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Espacio entre los contenedores de imágenes
    borderRadius: 10,
    overflow: 'hidden', // Para que las sombras no se vean fuera del contenedor
  },
  containerShadow: {
    shadowColor: '#708090', // Gris claro para sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5, // Elevación para sombra en Android
  },
  image: {
    width:'45%',
    height:'80%',
    resizeMode: 'cover',
    marginLeft:20,
    marginRight:20,
  },
  imageLeft: {
    marginRight: 10,
  },
  imageRight: {
    marginLeft: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft:10,
    marginRight:10,
    marginTop:10,
    marginBottom:10,
  },
  button: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    shadowColor: '#708090', // Gris claro para sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 7, // Elevación para sombra en Android
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
});