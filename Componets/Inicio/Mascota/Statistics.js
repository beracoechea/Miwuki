import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HealthCircle from './HealthCircle';

const Statistics = ({ datosMascota }) => {
  const [mostrarRecomendaciones, setMostrarRecomendaciones] = useState(false);

  const calculateSalud = () => {
    const { edadMascota, pesoMascota, tipoMascota } = datosMascota;

    // Calcular el porcentaje de salud base (100%)
    let porcentajeSalud = 100;

    // Evaluar puntos críticos y ajustar porcentaje de salud
    let descuentoSalud = 0; // Variable para acumular el descuento en salud
    let puntosCriticos = []; // Array para almacenar puntos críticos

    // Evaluar la obesidad
    if (pesoMascota >= getLimiteObesidad(tipoMascota)) {
      descuentoSalud += getDescuentoObesidad(pesoMascota, tipoMascota);
      puntosCriticos.push('Obesidad ');
    }

    // Evaluar la edad avanzada
    if (edadMascota >= getEdadAvanzada(tipoMascota)) {
      // Reducir el porcentaje de salud más cuanto mayor sea la edad
      const reduccionPorEdad = (edadMascota - getEdadAvanzada(tipoMascota)) * 2; // Por ejemplo, -2% por cada año de edad avanzada
      descuentoSalud += reduccionPorEdad;
      puntosCriticos.push('Edad avanzada  ');
    }

    porcentajeSalud -= descuentoSalud;

    // Asegurar que el porcentaje de salud esté entre 0 y 100
    porcentajeSalud = Math.max(0, Math.min(100, porcentajeSalud));
    porcentajeSalud = parseFloat(porcentajeSalud.toFixed(2)); // Redondear a 2 decimales

    return { salud: porcentajeSalud, puntosCriticos: puntosCriticos };
  };

  const recomendacionesGenerales = [
    'Asegúrate de proporcionar un ambiente seguro y estimulante para tu mascota.       ',
    'Proporciona a tu mascota una dieta equilibrada y adecuada a su tipo y edad.  ',
    'Mantén a tu mascota activa físicamente según sus necesidades y capacidades.',
    'Proporciona a tu mascota acceso a agua fresca en todo momento. ',
    'Programa revisiones periódicas con un veterinario para mantener su salud. ',
    'Mantén al día las vacunas y tratamientos preventivos recomendados por el veterinario.  ',
    'Proporciona a tu mascota juguetes adecuados para estimular su mente y cuerpo.   ',
    'Mantén un horario regular de alimentación y ejercicio para tu mascota. ',
    'Observa el comportamiento y los hábitos alimenticios de tu mascota regularmente.   ',
    'Brinda amor, atención y cuidado constante a tu mascota para fortalecer el vínculo.    ',
  ];

  const getLimiteObesidad = (tipoMascota) => {
    switch (tipoMascota) {
      case 'Perro':
        return 40;
      case 'Gato':
        return 6;
      case 'Ave':
        return 1;
      default:
        return 50;
    }
  };

  const getDescuentoObesidad = (peso, tipoMascota) => {
    switch (tipoMascota) {
      case 'Perro':
        return peso >= 50 ? 15 : peso >= 20 ? 10 : 5;
      case 'Gato':
        return peso >= 6 ? 10 : 5;
      case 'Ave':
        return peso >= 1 ? 5 : 0;
      default:
        return 10;
    }
  };

  const getEdadAvanzada = (tipoMascota) => {
    switch (tipoMascota) {
      case 'Perro':
        return 8;
      case 'Gato':
        return 10;
      case 'Ave':
        return 5;
      default:
        return 10;
    }
  };

  const calculateComida = () => {
    const { pesoMascota, tipoMascota } = datosMascota;
    let cantidadComida = '';

    switch (tipoMascota) {
      case 'Perro':
        if (pesoMascota >= 50) {
          cantidadComida = '590 - 800 gramos al día ';
        } else if (pesoMascota >= 20) {
          cantidadComida = '500 - 590 gramos al día ';
        } else if (pesoMascota >= 10) {
          cantidadComida = '190 - 310 gramos al día ';
        } else {
          cantidadComida = '90 - 190 gramos al día ';
        }
        break;
      case 'Gato':
        if (pesoMascota >= 6.0) {
          cantidadComida = '60 - 80 gramos al día';
        } else if (pesoMascota >= 3.0) {
          cantidadComida = '40 - 60 gramos al día';
        }
        break;
      case 'Ave':
        cantidadComida = 'Recomendación para aves';
        break;
      default:
        cantidadComida = 'Recomendación general';
        break;
    }

    return cantidadComida;
  };

  const calculateActividad = () => {
    const { edadMascota, tipoMascota } = datosMascota;
    let tiempoActividad = '';

    switch (tipoMascota) {
      case 'Perro':
        tiempoActividad = `${edadMascota * 30} minutos diarios. `;
        break;
      case 'Gato':
        tiempoActividad = `${edadMascota * 20} minutos diarios.   `;
        break;
      case 'Ave':
        tiempoActividad = `${edadMascota * 15} minutos diarios.   `;
        break;
      default:
        tiempoActividad = 'Tiempo recomendado ';
        break;
    }

    return tiempoActividad;
  };

  const { salud, puntosCriticos } = calculateSalud();

  return (
    <View style={styles.statisticsContainer}>
      <Text style={styles.statsTitle}>Estadísticas de {datosMascota.nombreMascota} </Text>
      <Text style={styles.statsText}>Cantidad de comida recomendada: {calculateComida()} </Text>
      <Text style={styles.statsText}>Actividad física recomendada: {calculateActividad()} </Text>
      <View style={styles.healthContainer}>
        <Text style={styles.statsText}>Salud:</Text>
        <HealthCircle salud={salud} />
      </View>
      <View style={styles.columnContainer}>
        <View style={styles.puntosCriticosContainer}>
          <Text style={[styles.statsText, { color: 'red', fontWeight: 'bold' }]}>Puntos críticos: </Text>
          {puntosCriticos.length > 0 ? (
            puntosCriticos.map((punto, index) => (
              <Text key={index} style={[styles.statsText, { color: 'red' }]}>
                - {punto}
              </Text>
            ))
          ) : (
            <Text style={[styles.statsText, { color: 'green' }]}>Ninguno </Text>
          )}
        </View>
        {mostrarRecomendaciones && (
          <View style={styles.recomendacionesContainer}>
            <Text style={[styles.statsText, { color: 'blue' }]}>Recomendaciones generales: </Text>
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
            type='feather'
            color='#000'
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
    alignItems: 'center',
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
  healthContainer: {
    alignItems: 'center',
    marginTop: 15,
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
