import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const config = {
    apiKey: "AIzaSyDkt17njYmxO7HjMqdsjDhh28xpdmTU7cA",
    authDomain: "hearo-16d22.firebaseapp.com",
    databaseURL: "https://hearo-16d22-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hearo-16d22",
    storageBucket: "hearo-16d22.appspot.com",
    messagingSenderId: "280710785691",
    appId: "1:280710785691:web:fc491b377ba25c1e22743e",
    measurementId: "G-B4JBW03V89"
};

const firebaseApp = initializeApp(config)
const db = getFirestore(firebaseApp);

export{ firebaseApp, db }