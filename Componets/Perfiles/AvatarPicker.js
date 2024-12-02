import React from 'react';
import { Modal, View, ScrollView, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

const AvatarPicker = ({ modalVisible, avatarMap, onAvatarSelect, onClose }) => {
  // Agrupar los avatares según el tamaño
  const groupedAvatars = {
    Pequeña: [],
    Mediana: [],
    Grande: [],
    Gigante:[],
  };

  Object.keys(avatarMap).forEach(avatarName => {
    const { tamaño, image } = avatarMap[avatarName];
    if (groupedAvatars[tamaño]) {
      groupedAvatars[tamaño].push({ avatarName, image });
    }
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <ScrollView contentContainerStyle={styles.modalContainer}>
          {/* Pequeña */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Pequeñas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slider}>
              {groupedAvatars.Pequeña.map((avatar, index) => (
                <TouchableOpacity key={index} onPress={() => onAvatarSelect(avatar.avatarName)}>
                  <Image source={avatar.image} style={styles.avatarOption} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Mediana */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Medianas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slider}>
              {groupedAvatars.Mediana.map((avatar, index) => (
                <TouchableOpacity key={index} onPress={() => onAvatarSelect(avatar.avatarName)}>
                  <Image source={avatar.image} style={styles.avatarOption} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Grande */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Grandes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slider}>
              {groupedAvatars.Grande.map((avatar, index) => (
                <TouchableOpacity key={index} onPress={() => onAvatarSelect(avatar.avatarName)}>
                  <Image source={avatar.image} style={styles.avatarOption} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/*Gigante*/}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Gigantes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slider}>
              {groupedAvatars.Gigante.map((avatar, index) => (
                <TouchableOpacity key={index} onPress={() => onAvatarSelect(avatar.avatarName)}>
                  <Image source={avatar.image} style={styles.avatarOption} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  column: {
    marginBottom: 50,
    width: '100%',
    height:'auto'
  },
  columnTitle: {
    margin: 20,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  slider: {
    flexDirection: 'row',
  },
  avatarOption: {
    margin: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

export default AvatarPicker;
