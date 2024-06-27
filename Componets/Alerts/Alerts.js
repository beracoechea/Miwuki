import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Vibration } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const ALERT_TYPES = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  EXIT: 'exit',
};

const Alerts = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Vibra el teléfono según el tipo de alerta
    switch (type) {
      case ALERT_TYPES.ERROR:
        Vibration.vibrate([0, 400,0,400]); // Vibra en un patrón [pausa, duración]
        break;
      case ALERT_TYPES.WARNING:
        Vibration.vibrate([0, 200, 100, 200]); // Vibra en otro patrón
        break;
      case ALERT_TYPES.INFO:
        Vibration.vibrate(0,100,0,0); // Vibra por 100 milisegundos
        break;
      case ALERT_TYPES.EXIT:
        Vibration.vibrate([0, 200, 100,0]); // Otro patrón de vibración
        break;
      default:
        Vibration.vibrate(); // Vibración por defecto
        break;
    }

    // Oculta la alerta después de 3 segundos
    const timeout = setTimeout(() => {
      setVisible(false);
      onClose(); // Llamar a la función onClose para limpiar la alerta desde ModalEdit
    }, 3000);

    return () => clearTimeout(timeout); // Limpia el timeout al desmontar el componente
  }, []);

  let backgroundColor;
  let iconColor;
  switch (type) {
    case ALERT_TYPES.ERROR:
      backgroundColor = 'red';
      iconColor = 'white';
      break;
    case ALERT_TYPES.WARNING:
      backgroundColor = 'orange';
      iconColor = 'black';
      break;
    case ALERT_TYPES.INFO:
      backgroundColor = 'blue';
      iconColor = 'white';
      break;
    case ALERT_TYPES.EXIT:
      backgroundColor = 'green';
      iconColor = 'white';
      break;
    default:
      backgroundColor = 'gray';
      iconColor = 'white';
      break;
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.box}>
        <View style={styles.icon}>
          <MaterialIcon name="exclamation-thick" size={18} color={iconColor} />
        </View>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',
    zIndex: 100,
  },
  box: {
    height: 'auto',
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  icon: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    marginRight: 8,
    paddingLeft: 1,
  },
  text: {
    color: 'white',
    fontSize: 14,
    alignSelf: 'center',
  },
});

export default Alerts;
