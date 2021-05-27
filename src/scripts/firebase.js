import firebase from 'firebase/app';
import 'firebase/firestore';
import {FIREBASE_CONFIG_OBJECT} from '../store/keys'

const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG_OBJECT);
const fireDB = firebaseApp.firestore()

export {
    fireDB
}
