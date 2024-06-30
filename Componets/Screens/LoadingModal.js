// LoadingModal.js

import React from 'react';
import { View, Modal, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingModal = ({ visible, onClose }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingModal;
