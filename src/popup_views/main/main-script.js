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
var startingTime = "";
var endingTime = "";
var lastComment = {
  uid: "",
  comment: "",
  startingTime: "",
  private: true,
  podcastName: ""
};
var episodeTitle = "";
var userID = "";

// Auth instance for the current firebaseApp
const auth = getAuth(firebaseApp);
setPersistence(auth, browserLocalPersistence);

onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log('Below User is logged in :')
    console.log(user);
    userID = user.uid;
    userIsLoggedIn = true;
  } else {
    console.log('No user logged in!');
    userIsLoggedIn = false;
    window.location.replace('./login.html');
  }
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      playerAction: "",
      userIsLoggedIn: userIsLoggedIn,
      mainViewIsOpen: true
    });
  });

});

document.addEventListener("DOMContentLoaded", function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
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
      startingTime = request.startingTime;
      endingTime = request.endingTime;
      episodeTitle = request.episodeTitle;
      updateTimeCode(startingTime, endingTime);
      updtateEpisodeTitle(episodeTitle);
    }
  );
});

document.querySelector('#submitButton').addEventListener("click", () => {
  lastComment.comment = document.getElementById("text_field").value;
  lastComment.startingTime = startingTime;
  lastComment.uid = userID;
  lastComment.episodeTitle = episodeTitle;
  document.getElementById("text_field").value = "";
  console.log("SUBMIT : ", lastComment);
});

function updateTimeCode(startingTime, endingTime) {
  var myElement = document.getElementsByClassName("current_timecode")[0];
  myElement.innerHTML = startingTime + " / " + endingTime;
}

function updtateEpisodeTitle(episodeTitle) {
  var myElement = document.getElementsByClassName("episodeTitle")[0];
  myElement.innerHTML = episodeTitle;
}

chrome.runtime.connect({ name: "main" });