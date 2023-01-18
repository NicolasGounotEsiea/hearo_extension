// *************************************************************
// *************************************************************
console.log("------------ MAINS-CRIPT.JS IS LOADED ------------");
// *************************************************************
// *************************************************************

import { firebaseApp } from '../firebase_config'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
const auth = getAuth(firebaseApp); // Auth instance for the current firebaseApp

chrome.runtime.connect({ name: "main" });

onAuthStateChanged(auth, user => {
  if (user != null) {
    userID = user.uid;
    userIsLoggedIn = true;
    console.log('Below User is logged in : ', user);
  } else {
    userIsLoggedIn = false;
    console.log('No user logged in! then lets go to login.html page...');
    window.location.replace('./login.html');
  }
});

document.addEventListener("DOMContentLoaded", function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      playerAction: "",
      userIsLoggedIn: userIsLoggedIn,
      mainViewIsOpen: true
    });
  });
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    document.querySelector('#minus_ten').addEventListener("click", () => {
      chrome.tabs.sendMessage(tabs[0].id, {
        playerAction: "MINUS TEN",
        userIsLoggedIn: userIsLoggedIn,
        mainViewIsOpen: true
      });
    });
  });

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    document.querySelector('#play_pause').addEventListener("click", () => {  
      chrome.tabs.sendMessage(tabs[0].id, {
        playerAction: "PLAY PAUSE",
        userIsLoggedIn: userIsLoggedIn,
        mainViewIsOpen: true
      });
    });
  });

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    document.querySelector('#plus_thirty').addEventListener("click", () => {
      chrome.tabs.sendMessage(tabs[0].id, {
        playerAction: "PLUS THIRTY",
        userIsLoggedIn: userIsLoggedIn,
        mainViewIsOpen: true
      });
    });
  });

  document.querySelector('#btn_user_profile').addEventListener("click", () => {
    window.location.replace('./settings.html');
  });
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

document.querySelector('#publishBtn').addEventListener("click", () => {
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

