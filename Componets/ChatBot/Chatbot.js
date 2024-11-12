import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Msg from './Msg';
import { data } from './data';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

let chats = [];

const Chatbot = () => {
  const longestCommonSubsequence = (text1, text2) => {
    const m = text1.length;
    const n = text2.length;
    const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (text1[i - 1] === text2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    let i = m;
    let j = n;
    const result = [];
    while (i > 0 && j > 0) {
      if (text1[i - 1] === text2[j - 1]) {
        result.unshift(text1[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    return result.join('');
  };

  const [chatList, setChatList] = useState([]);
  const [msg, setMsg] = useState('');

  const getAnswer = (q) => {
    let maxMatchLength = 0;
    let bestMatch = null;

    for (let i = 0; i < data.length; i++) {
      const matchLength = longestCommonSubsequence(q.toLowerCase(), data[i].question.toLowerCase()).length;
      if (matchLength > maxMatchLength) {
        maxMatchLength = matchLength;
        bestMatch = data[i].answer;
      }
    }

    if (bestMatch) {
      chats = [...chats, { msg: bestMatch, incomingMsg: true }];
    } else {
      chats = [...chats, { msg: 'Esta respuesta no está disponible ', incomingMsg: true }];
    }

    setChatList([...chats].reverse());
  };

  const onSendMsg = () => {
    chats = [...chats, { msg: msg, sentMsg: true }];
    setChatList([...chats].reverse());
    setTimeout(() => {
      getAnswer(msg);
    }, 1000);
    setMsg('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{ height: '87%', bottomm: '3%' }}
        data={chatList}
        inverted={true}
        keyExtractor={(_, index) => index.toString()  }
        renderItem={({ item }) => (
          <Msg
            incomingMsg={item.incomingMsg}   
            msg={item.msg    }
            sentMsg={item.sentMsg  } 
          />
        )}
      />

      <View style={styles.typeMsgContainer}>
        <TextInput
          style={styles.typeMsgBox}
          value={msg}
          placeholder="Type Here ..."
          onChangeText={val => setMsg(val)  }
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: msg ? '#66280a' : 'grey' }]}
          disabled={msg ? false : true}
          onPress={() => onSendMsg()}
        >
          <FontAwesome name="send" size={30} color="black" style={[{ alignSelf: 'center', marginTop: 5 }]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#c57d56',
    height: '100%',
    width: '100%'
  },
  typeMsgContainer: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginBottom: 5,
  },
  typeMsgBox: {
    borderWidth: 0.8,
    borderColor: 'grey',
    padding: 10,
    width: '80%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  sendBtn: {
    width: '20%',
    alignItems: 'center',
    borderRadius: 20,
  },
  sendTxt: {
    color: 'black',
  },
});