console.log("------------ MAINS-CRIPT.JS IS LOADED ------------");

import { firebaseApp } from '../firebase_config'
import {
    getAuth,
    onAuthStateChanged,
    signInWithCredential,
    GoogleAuthProvider,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth';

var userIsLoggedIn = false;

// Auth instance for the current firebaseApp
const auth = getAuth(firebaseApp);
setPersistence(auth, browserLocalPersistence);

onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log('Below User is logged in :')
    console.log(user)
    userIsLoggedIn = true;
  } else {
    console.log('No user logged in!');
    userIsLoggedIn = false;
    window.location.replace('./login.html');
  }
  chrome.runtime.sendMessage({ userIsLoggedIn: userIsLoggedIn });
});



document.addEventListener("DOMContentLoaded", function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log(tabs[0].id);
    // doing something
  });

  
  document.querySelector('#btn_user_profile').addEventListener("click", () => {
    window.location.replace('./settings.html');
  });
  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      updateTimeCode(request.startingTime, request.endingTime);
    }
  );
});

function updateTimeCode(startingTime, endingTime) {
  var myElement = document.getElementsByClassName("current_timecode")[0];
  myElement.innerHTML = startingTime + " / " + endingTime;
}

chrome.runtime.connect({ name: "main" });

var DB = 