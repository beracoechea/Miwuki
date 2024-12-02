import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const GenderSelector = ({ selectedGender, onGenderSelect }) => (
  <View style={styles.genderContainer}>
    <TouchableOpacity onPress={() => onGenderSelect('masculino')}>
      <MaterialCommunityIcons
        name="gender-male"
        size={40}
        color={selectedGender === 'masculino' ? '#007BFF' : '#000'}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onGenderSelect('femenino')}>
      <MaterialCommunityIcons
        name="gender-female"
        size={40}
        color={selectedGender === 'femenino' ? 'pink' : '#000'}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
});

export default GenderSelector;
