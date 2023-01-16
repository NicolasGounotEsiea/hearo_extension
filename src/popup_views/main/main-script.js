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
var podcastIsPlaying = false;

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
  
  chrome.tabs.sendMessage(tabs[0].id, {
    playerAction: "TEST",
    userIsLoggedIn: userIsLoggedIn,
    mainViewIsOpen: true
  });
});



document.addEventListener("DOMContentLoaded", function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log(tabs[0].id);
    // doing something
    document.querySelector('#minus_ten').addEventListener("click", () => {
      chrome.tabs.sendMessage(tabs[0].id, {
        playerAction: "MINUS TEN",
        userIsLoggedIn: userIsLoggedIn,
        mainViewIsOpen: true
      });
    });

    document.querySelector('#play_pause').addEventListener("click", () => {  
      chrome.tabs.sendMessage(tabs[0].id, {
        playerAction: "PLAY PAUSE",
        userIsLoggedIn: userIsLoggedIn,
        mainViewIsOpen: true
      });
    });

    document.querySelector('#plus_ten').addEventListener("click", () => {
      chrome.tabs.sendMessage(tabs[0].id, {
        playerAction: "PLUS TEN",
        userIsLoggedIn: userIsLoggedIn,
        mainViewIsOpen: true
      });
    });
  });

  
  document.querySelector('#btn_user_profile').addEventListener("click", () => {
    window.location.replace('./settings.html');
  });
  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.podcastIsPlaying) {
        podcastIsPlaying = true;
      } else {
        podcastIsPlaying = false;
      }
      
      updateTimeCode(request.startingTime, request.endingTime);
    }
  );
});

function updateTimeCode(startingTime, endingTime) {
  var myElement = document.getElementsByClassName("current_timecode")[0];
  myElement.innerHTML = startingTime + " / " + endingTime;
}

chrome.runtime.connect({ name: "main" });