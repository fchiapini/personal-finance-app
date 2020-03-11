import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig.js';

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const GOOGLE_AUTH_PROVIDER_ID = firebase.auth.GoogleAuthProvider.PROVIDER_ID;
export const EMAIL_AUTH_PROVIDER_ID = firebase.auth.EmailAuthProvider.PROVIDER_ID;