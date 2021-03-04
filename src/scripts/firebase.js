import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAMHo6lBeD6LDoqy0-wYG3TWgWBqlmrLgE",
    authDomain: "kaustubh-app.firebaseapp.com",
    projectId: "kaustubh-app",
    storageBucket: "kaustubh-app.appspot.com",
    messagingSenderId: "198349732830",
    appId: "1:198349732830:web:8d27c404eaa45fdabcfb4f"
});

const fireDB = firebaseApp.firestore()

export {
    fireDB
}