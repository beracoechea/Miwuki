import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const HealthCircle = ({ salud }) => {
  const radius = 70;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (salud / 100) * circumference;

  return (
    <View style={styles.circleContainer}>
      <Svg width={radius * 2} height={radius * 2}>
        <Circle
          stroke="#d3d3d3"
          fill="none"
          cx={radius}
          cy={radius}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="#00ff00"
          fill="none"
          cx={radius}
          cy={radius}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progress}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={styles.healthText}>{`${salud}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circleContainer: {
    position: 'relative',
    width: 200,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthText: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff00',
  },
});

export default HealthCircle;
