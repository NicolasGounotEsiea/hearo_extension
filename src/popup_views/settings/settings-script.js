console.log("------------ SETTINGS-SCRIPT.JS IS LOADED ------------");

import { firebaseApp } from '../firebase_config'
import {
    getAuth,
    onAuthStateChanged
} from 'firebase/auth';
// Auth instance for the current firebaseApp
const auth = getAuth(firebaseApp);

console.log("popup main!")

onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log('logged in!');
    console.log("current")
    console.log(user)
  } else {
    console.log('No user');
  }
});

document.querySelector('#sign_out').addEventListener('click', () => {
  auth.signOut();
  window.location.replace('./login.html');
});

document.querySelector('#back').addEventListener('click', () => {
  window.location.replace('./main.html');
});