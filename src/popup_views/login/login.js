// *************************************************************
// *************************************************************
console.log("------------ LOGIN.JS IS LOADED ------------");
// *************************************************************
// *************************************************************

import { firebaseApp } from '../firebase_config'
import {
    getAuth,
    onAuthStateChanged,
    signInWithCredential,
    GoogleAuthProvider,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth';

var isConnected = false;

const auth = getAuth(firebaseApp); // Auth instance for the current firebaseApp
setPersistence(auth, browserLocalPersistence); // To keep user signin localy

document.querySelector('#signin_google').addEventListener('click', () => {
  console.log("Google button pressed");
  initFirebaseApp();
});

function initFirebaseApp() {
  console.log("Detect auth state...");
  onAuthStateChanged(auth, user => {
    if (user != null) {
      isConnected = true;
      console.log('Logged in and current user is : ', user);
    } else {
      isConnected = false;
      console.log('No user then start the sign-in process :');
      startSignIn();
    }
  });
}

function startSignIn() {
  console.log("Starts the sign-in process...");
  const user = auth.currentUser;
  if (user) {
    console.log("current")
    console.log(user)
    auth.signOut();
  } else {
    console.log("proceed")
    startAuth(true);
  }
}

function startAuth(interactive) {
  console.log("Trying to start the auth process...");
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.');
    } else if (chrome.runtime.lastError) {
      console.error("chrome.runtime.lastError : ", chrome.runtime.lastError);
    } else if (token) {
      const credential = GoogleAuthProvider.credential(null, token);
      signInWithCredential(auth, credential).then((result) => {
        console.log("Success!!! -- result : ", result);
        window.location.replace('./main.html');
      }).catch((error) => {
        console.log(error);
      });
    } else {
      console.error('The OAuth token was null');
    }
  });
}