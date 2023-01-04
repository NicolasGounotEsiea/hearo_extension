import { initializeApp } from 'firebase/app';

// TODO Fill Me! 
// Find my details from Firebase Console

// config after registering firebase App 
const config = {
    apiKey: "AIzaSyDkt17njYmxO7HjMqdsjDhh28xpdmTU7cA",
    authDomain: "hearo-16d22.firebaseapp.com",
    projectId: "hearo-16d22",
    storageBucket: "hearo-16d22.appspot.com",
    messagingSenderId: "280710785691",
    appId: "1:280710785691:web:fc491b377ba25c1e22743e",
    measurementId: "G-B4JBW03V89"
};


// This creates firebaseApp instance
// version: SDK 9
const firebaseApp = initializeApp(config)

export{
    firebaseApp
}