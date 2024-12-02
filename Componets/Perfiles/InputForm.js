import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

const InputForm = ({ formData, setFormData }) => {
  const { nombreMascota, pesoMascota, edadMascota } = formData;

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la mascota"
        value={nombreMascota}
        onChangeText={(text) => setFormData({ ...formData, nombreMascota: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Peso"
        value={pesoMascota}
        keyboardType="numeric"
        onChangeText={(text) => setFormData({ ...formData, pesoMascota: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad en años"
        value={edadMascota}
        keyboardType="numeric"
        onChangeText={(text) => setFormData({ ...formData, edadMascota: text })}
      />
     

    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default InputForm;
