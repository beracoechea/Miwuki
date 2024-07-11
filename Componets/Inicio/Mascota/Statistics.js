import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Statistics = ({ datosMascota }) => {
  const [mostrarRecomendaciones, setMostrarRecomendaciones] = useState(false);

  
  const recomendacionesGenerales = [
    'Asegúrate de proporcionar un ambiente seguro y estimulante para tu mascota.    ..',
    'Proporciona a tu mascota una dieta equilibrada y adecuada a su tipo y edad.   ',
    'Mantén a tu mascota activa físicamente según sus necesidades y capacidades. ',
    'Proporciona a tu mascota acceso a agua fresca en todo momento.   ',
    'Programa revisiones periódicas con un veterinario para mantener su salud. ',
    'Mantén al día las vacunas y tratamientos preventivos recomendados por el veterinario. ',
    'Proporciona a tu mascota juguetes adecuados para estimular su mente y cuerpo. ',
    'Mantén un horario regular de alimentación y ejercicio para tu mascota.   .',
    'Observa el comportamiento y los hábitos alimenticios de tu mascota regularmente.   ',
    'Brinda amor, atención y cuidado constante a tu mascota para fortalecer el vínculo.   ',
  ];

  

  const calculateComida = () => {
    const { pesoMascota, tipoMascota, tamaño } = datosMascota;
    let cantidadComida = '';

    const comidaRecomendada = {
      Perro: {
        pequeña: pesoMascota * 30,
        mediana: pesoMascota * 25,
        grande: pesoMascota * 20,
      },
      Gato: {
        pequeña: pesoMascota * 20,
        mediana: pesoMascota * 15,
        grande: pesoMascota * 10,
      },
      Ave: pesoMascota * 0.2,
      Mamífero: pesoMascota * 0.4,
    };

    if (tipoMascota === 'Ave' || tipoMascota === 'Mamífero') {
      cantidadComida = 'Información no disponible';
    } else {
      const comida = comidaRecomendada[tipoMascota]?.[tamaño];
      if (comida !== undefined) {
        cantidadComida = `${comida.toFixed(2)} gramos al día `;
      } else {
        cantidadComida = 'Información no disponible';
      }
    }

    return cantidadComida;
  };

  const calculateActividad = () => {
    const { tipoMascota, tamaño } = datosMascota;
    let tiempoActividad = '';

    const actividadRecomendada = {
      Perro: { pequeña: 30, mediana: 45, grande: 60 },
      Gato: { pequeña: 20, mediana: 30, grande: 40 },
      Ave: 20, // Un solo valor para aves
      Mamífero: 30, // Un solo valor para mamíferos
    };

    const actividad = actividadRecomendada[tipoMascota]?.[tamaño] || actividadRecomendada[tipoMascota];
    if (actividad !== undefined) {
      tiempoActividad = `${actividad} minutos diarios `;
    } else {
      tiempoActividad = 'Información no disponible';
    }

    return tiempoActividad;
  };


  return (
    <View style={styles.statisticsContainer}>
      <Text style={styles.statsTitle}>Recomendaciones para: {datosMascota.nombreMascota} </Text>
      <Text style={styles.statsText}>Cantidad de comida recomendada: {calculateComida()}</Text>
      <Text style={styles.statsText}>Actividad física recomendada: {calculateActividad()}</Text>
      <View style={styles.columnContainer}>
        <View style={styles.puntosCriticosContainer}>
        </View>
        {mostrarRecomendaciones && (
          <View style={styles.recomendacionesContainer}>
            <Text style={[styles.statsText, { color: 'blue' }]}>Recomendaciones generales:</Text>
            {recomendacionesGenerales.map((recomendacion, index) => (
              <Text key={index} style={styles.statsText}>
                - {recomendacion}
              </Text>
            ))}
          </View>
        )}
        <TouchableOpacity
          style={styles.infoIconButton}
          onPress={() => setMostrarRecomendaciones(!mostrarRecomendaciones)}
        >
          <Ionicons
            name={mostrarRecomendaciones ? 'information-circle' : 'information-circle-outline'}
            type="feather"
            color="#000"
            size={30}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statisticsContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#FFF8DC',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    width: '80%',
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 15,
  },
  statsText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  columnContainer: {
    marginTop: 15,
    flexDirection: 'column',
    alignItems: 'center',
  },
  puntosCriticosContainer: {
    alignItems: 'center',
  },
  recomendacionesContainer: {
    marginTop: 15,
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  infoIconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});

export default Statistics;
