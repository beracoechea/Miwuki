import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Vibration } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const ALERT_TYPES = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

const Alerts = ({ type, message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Vibra el teléfono cuando se muestra la alerta
    Vibration.vibrate();

    // Oculta la alerta después de 3 segundos
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timeout); // Limpia el timeout al desmontar el componente
  }, []);

  if (!visible) {
    return null; // No renderizar nada si no es visible
  }

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
