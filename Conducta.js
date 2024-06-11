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
        <View style={[styles.container, styles.containerShadow]}>
          <Image source={require('./images/Botones/Conducta/Social.jpg')} style={[styles.image, styles.imageLeft]} />
          <View style={[styles.buttonContainer, { alignItems: 'flex-end' }]}>
            <TouchableOpacity onPress={() => this.handleButtonPress('https://www.youtube.com/watch?v=YdRTQvRk3tI')} style={styles.button}>
              <Text style={styles.buttonText}> Reactividad controlada</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleButtonPress('https://www.youtube.com/watch?v=rLMJ8S0XcDE')} style={styles.button}>
              <Text style={styles.buttonText}>Socializar a mi perro</Text>
            </TouchableOpacity>
          </View>
        </View>

        
        <View style={[styles.container, styles.containerShadow]}>
          <View style={[styles.buttonContainer, { alignItems: 'flex-start' }]}>
            <TouchableOpacity onPress={() => this.handleButtonPress('https://www.youtube.com/watch?v=dO67gxm2okk')} style={styles.button}>
              <Text style={styles.buttonText}>Paseo sin tirones</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleButtonPress('https://www.youtube.com/watch?v=aSYAsHcPyaY')} style={styles.button}>
              <Text style={styles.buttonText}>Como hacer que te haga caso</Text>
            </TouchableOpacity>
          </View>
          <Image source={require('./images/Botones/Conducta/Paseo.jpg')} style={[styles.image, styles.imageRight]} />
        </View>


        <View style={[styles.container, styles.containerShadow]}>
          <Image source={require('./images/Botones/Conducta/Quieto.jpg')} style={[styles.image, styles.imageLeft]} />
          <View style={[styles.buttonContainer, { alignItems: 'flex-end' }]}>
            <TouchableOpacity onPress={() => this.handleButtonPress('https://www.youtube.com/watch?v=ADnRnlELjVY')} style={styles.button}>
              <Text style={styles.buttonText}>Quieto</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleButtonPress('https://youtu.be/JRcEmJq3Q6c?si=l2y31gFGnmKeIt9g')} style={styles.button}>
              <Text style={styles.buttonText}>Quieto Avanzado</Text>
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