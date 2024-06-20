import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';



// Inicializa Firebase

const firebaseConfig = {
  apiKey: "AIzaSyCGvqv0Oi6TXXJsEA3VYC1LvFD5JBesJT8",
  authDomain: "miwuki-dd78a.firebaseapp.com",
  projectId: "miwuki-dd78a",
  storageBucket: "miwuki-dd78a.appspot.com",
  messagingSenderId: "81980637463",
  appId: "1:81980637463:android:90e4b7c7bd745b77e33752"
  };


export const FIREBASE_APP = initializeApp(firebaseConfig);

// initialize Firebase Auth for that app immediately
const auth = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);




