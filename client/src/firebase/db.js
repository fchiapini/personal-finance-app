import { firebaseApp } from './firebaseinit.js'
import 'firebase/firestore'

export const db = firebaseApp.firestore()
