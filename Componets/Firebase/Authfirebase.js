// firebase.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import appFirebase from './credenciales';

const firebaseAuth = getAuth(appFirebase, {
  persistence: 'local',
  dataConverter: null
});

export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const registerWithEmailAndPassword = async (email, password) => {
  try {
    const signInMethods = await fetchSignInMethodsForEmail(firebaseAuth, email);
    if (signInMethods.length > 0) {
      throw new Error('auth/email-already-in-use');
    }

    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export default firebaseAuth;
