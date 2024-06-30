// AsyncStorageManager.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageManager = {
  getUserData: async () => {
    try {
      const userDataJson = await AsyncStorage.getItem('userData');
      return userDataJson ? JSON.parse(userDataJson) : null;
    } catch (error) {
      console.error('Error getting user data from AsyncStorage', error);
      return null;
    }
  },

  setUserData: async (userData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error setting user data in AsyncStorage', error);
    }
  },

  removeUserData: async () => {
    try {
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Error removing user data from AsyncStorage', error);
    }
  },

  getMascotas: async (usuarioId) => {
    try {
      const mascotasJson = await AsyncStorage.getItem(`mascotas_${usuarioId}`);
      return mascotasJson ? JSON.parse(mascotasJson) : [];
    } catch (error) {
      console.error(`Error getting mascotas for user ${usuarioId} from AsyncStorage`, error);
      return [];
    }
  },

  setMascotas: async (usuarioId, mascotas) => {
    try {
      await AsyncStorage.setItem(`mascotas_${usuarioId}`, JSON.stringify(mascotas));
    } catch (error) {
      console.error(`Error setting mascotas for user ${usuarioId} in AsyncStorage`, error);
    }
  },

  removeMascotas: async (usuarioId) => {
    try {
      await AsyncStorage.removeItem(`mascotas_${usuarioId}`);
    } catch (error) {
      console.error(`Error removing mascotas for user ${usuarioId} from AsyncStorage`, error);
    }
  }
};

export default AsyncStorageManager;
