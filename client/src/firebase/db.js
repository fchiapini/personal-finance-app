import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import { firebaseApp } from './firebaseinit.js'
import 'firebase/firestore'

Vue.use(firestorePlugin)

export const db = firebaseApp.firestore()
