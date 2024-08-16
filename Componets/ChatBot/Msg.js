import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Msg = ({ incomingMsg, sentMsg, msg }) => {
  return (
    <>
      {/* Incoming msg */}
      {incomingMsg && (
        <View style={[styles.msgBox, styles.incomingMsgBox]}>
          <Text style={styles.msgText}>{msg}</Text>
        </View>
      )}

      {/* Sent msg */}
      {sentMsg && (
        <View style={[styles.msgBox, styles.sentMsgBox]}>
          <Text style={styles.msgText}>{msg}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  msgBox: {
    borderRadius: 10,
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 5,
    borderWidth: 0.5,
    borderColor: 'gray',
    maxWidth: '70%',
  },
  msgText: {
    color: 'black',
    fontSize: 16,
  },
  incomingMsgBox: {
    backgroundColor: 'silver',
    alignSelf: 'flex-start',
  },
  sentMsgBox: {
    backgroundColor: '#92c5fc',
    alignSelf: 'flex-end',
  },
});

export default Msg;