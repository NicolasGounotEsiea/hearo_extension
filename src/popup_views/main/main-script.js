// *************************************************************
// *************************************************************
console.log('------------ MAINS-CRIPT.JS IS LOADED ------------')
// *************************************************************
// *************************************************************

var timecode = 0
var userid
import { firebaseApp, db } from '../firebase_config'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import * as firebase from 'firebase/app'

const {
  initializeApp,
  applicationDefault,
  cert
} = require('../firebase_config')
const { getFirestore, Timestamp, FieldValue } = require('../firebase_config')
import 'firebase/database'

//VARIABLES GLOBALES
var comment = ''
var mess = ''
var limite = 10 //limite de message du chat
var numMess = 0 //nombre de messages affichés depuis le début
var messageElement = '' //élément injecter pour afficher le commentaire
var preced = '' //div du message precedent
var userIsLoggedIn = false
var podcastIsPlaying = false
var startingTime = ''
var endingTime = ''
var username = ''

var lastComment = {
  //objet commentaire
  podcastEpisode: {},
  TimeCode: '',
  UserName: '',
  Private: '0',
  UUID: '',
  Comment: ''
}

var episodeTitle = ''
var userID = ''
const auth = getAuth(firebaseApp) // Auth instance for the current firebaseApp

chrome.runtime.connect({ name: 'main' })

onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log('Below User is logged in :')
    console.log(user)
    userid = user.uid
    userID = userid
    username = user.displayName

    userIsLoggedIn = true
    console.log('Below User is logged in : ', user)
  } else {
    userIsLoggedIn = false
    console.log('No user logged in! then lets go to login.html page...')
    window.location.replace('./login.html')
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      playerAction: 'TEST',
      userIsLoggedIn: userIsLoggedIn,
      mainViewIsOpen: true
    })
  })
})

document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      playerAction: '',
      userIsLoggedIn: userIsLoggedIn,
      mainViewIsOpen: true
    })
  })

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    document.querySelector('#minus_ten').addEventListener('click', () => {
      chrome.tabs.sendMessage(tabs[0].id, {
        playerAction: 'MINUS TEN',
        userIsLoggedIn: userIsLoggedIn,
        mainViewIsOpen: true
      })
    })
  })

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    document.querySelector('#play_pause').addEventListener('click', () => {
      chrome.tabs.sendMessage(tabs[0].id, {
        playerAction: 'PLAY PAUSE',
        userIsLoggedIn: userIsLoggedIn,
        mainViewIsOpen: true
      })
    })
  })

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    document.querySelector('#plus_thirty').addEventListener('click', () => {
      chrome.tabs.sendMessage(tabs[0].id, {
        playerAction: 'PLUS THIRTY',
        userIsLoggedIn: userIsLoggedIn,
        mainViewIsOpen: true
      })
    })
  })

  document.querySelector('#btn_user_profile').addEventListener('click', () => {
    window.location.replace('./settings.html')
  })

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.podcastIsPlaying) {
      podcastIsPlaying = true
    } else {
      podcastIsPlaying = false
    }
    updateTimeCode(request.startingTime, request.endingTime)
    timecode = request.startingTime
    if (podcastIsPlaying == true) {
      getComments(timecode)
      
      
    }
  })
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.podcastIsPlaying) {
    podcastIsPlaying = true
    update_PlayPause();
  } else {
    podcastIsPlaying = false
    update_PlayPause();
  }

  const mySwitch = document.getElementById("private");
  mySwitch.addEventListener("change", function() {
  
  if (mySwitch.value == 0) {
    document.getElementById("private").value = "1";
  } else {
    document.getElementById("private").value = "0";
  }
  console.log(mySwitch.value)
});



  startingTime = request.startingTime
  endingTime = request.endingTime
  episodeTitle = request.episodeTitle
  updateTimeCode(startingTime, endingTime)
  updtateEpisodeTitle(episodeTitle)

  if (numMess > limite) {
        //limiter le nombre de messages dans le chat
        const messagesToDelete = numMess - limite - 1

        let myDiv = document.getElementById(messagesToDelete)
        console.log(myDiv)
        myDiv.parentNode.removeChild(myDiv)
      }
})


document.querySelector('#publishBtn').addEventListener('click', () => {
  lastComment.podcast = episodeTitle
  lastComment.TimeCode = startingTime
  lastComment.UserName = username
  lastComment.UUID = userID
  lastComment.Comment = document.getElementById('text_field').value
  lastComment.Private = document.getElementById("private").value

  

  if(lastComment.Comment.length === 0){
    document.getElementById("text_field").placeholder = "Entrez un commentaire valide"
    document.getElementById("text_field").style.setProperty('color', 'white', 'important');
    document.getElementById("text_field").style.setProperty('background-color', 'pink', 'important'); 
  } else {

    document.getElementById("text_field").placeholder = " votre commentaire"
    
    document.getElementById("text_field").style.setProperty('background-color', 'white');
    var badWords = ["pute","paul","test"];
  var phrase = lastComment.Comment;
  for(let i = 0; i < badWords.length; i++){
    var regex = new RegExp(badWords[i], "gi");
    phrase = phrase.replace(regex, "***");
  }
  console.log("Phrase modifiée : " + phrase);
  lastComment.Comment = phrase
  document.getElementById("text_field").value = "";
  console.log("SUBMIT : ", lastComment);


  
    document.getElementById('text_field').value = ''
    console.log('SUBMIT : ', lastComment)
  
    try {
      const docRef = addDoc(collection(db, episodeTitle), lastComment)
      console.log('Document written with ID: ', docRef.id)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
    testAff(lastComment)
    document.getElementById("private").value = "0";
    
  }
})



function updateTimeCode (startingTime, endingTime) {
  var myElement = document.getElementsByClassName('current_timecode')[0]
  myElement.innerHTML = startingTime + ' / ' + endingTime
}



//fonction d'affichage des comentaires
const getComments = async timecode => {
  const querySnapshot = await getDocs(collection(db, episodeTitle)) // récupération depuis firestore
  querySnapshot.forEach(doc => {
    if (doc.data().TimeCode == timecode) {
      var preced
      var mess = doc.data()

      const messageElement = document.createElement('div')
      messageElement.id = numMess

      var pri = 'Private'
      console.log(mess.UUID)
      if (mess.UUID == userid) {
        numMess++
        if (mess.Private == 0) {
          pri = 'Public'
        }
        messageElement.innerHTML = `<div class="chat-message user-message">
            <div class="chat-message-content">
            
              <p class="chat-message-username"> <span class="pubpri">${pri}</span><span class="time">${mess.TimeCode}</span>${mess.UserName}</p>
              <p class="chat-message-text">${mess.Comment}</p>
              <div class="container-mod">
  <div class="item">
   
    <div class="options-container">
        <button class="options-button"><i class="fas fa-ellipsis-v"></i>...</button>
        <div class="options">
            <button class="edit">  <i class="fas fa-edit"></i> Modifier</button>
            <button class="delete">  <i class="fas fa-trash"></i> Supprimer</button>
        </div>
    </div>
  </div>
</div>
            </div>
          </div>
          
          `
        const messagesContainer = document.querySelector('#messages')
        messagesContainer.appendChild(messageElement)
        preced = messagesContainer
      } else if (mess.Private == 0) {
        numMess++
        messageElement.innerHTML = ` <div class="chat-message">
            <div class="chat-message-content">
            
              <p class="chat-message-username">${mess.UserName}  <span class="time">${mess.TimeCode}</span> </p>
              <p class="chat-message-text">${mess.Comment}</p>
              <div class="container-mod">
              <div class="item">
               
                <div class="options-container">
                    <button class="options-button"><i class="fas fa-ellipsis-v"></i>...</button>
                    <div class="options">
                        <button class="edit">  <i class="fas fa-edit"></i> Modifier</button>
                        <button class="delete">  <i class="fas fa-trash"></i> Supprimer</button>
                    </div>
                </div>
              </div>
            </div>
            </div>
          </div>
           `
        const messagesContainer = document.querySelector('#messages')
        messagesContainer.appendChild(messageElement)
        preced = messagesContainer
      }

      messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' })

      response()

      if (numMess > limite){
        //limiter le nombre de messages dans le chat
        const messagesToDelete = numMess - limite - 1
     
        let myDiv = document.getElementById(messagesToDelete)
        console.log(myDiv)
        myDiv.parentNode.removeChild(myDiv)
        }

    }
  }) 
}


function updtateEpisodeTitle (episodeTitle) {
  var myElement = document.getElementsByClassName('episodeTitle')[0]
  myElement.innerHTML = episodeTitle
}

function testAff (mess) {
  //juste une fonction d'injection de commentaire qu'il faut que je renomme

  messageElement = document.createElement('div')

  var pri = 'Private'
  if (mess.Private == 0) {
    pri = 'Public'
  }
  messageElement.innerHTML = `<div class="chat-message user-message">
  
  <div class="chat-message-content">
  
    <p class="chat-message-username">  <span class="pubpri">${pri}</span><span class="time">${mess.TimeCode}</span>${mess.UserName}</p>
    <p class="chat-message-text">${mess.Comment}</p>
    <div class="container-mod">
  <div class="item">
   
    <div class="options-container">
        <button class="options-button"><i class="fas fa-ellipsis-v"></i>...</button>
        <div class="options">
            <button class="edit">  <i class="fas fa-edit"></i> Modifier</button>
            <button class="delete">  <i class="fas fa-trash"></i> Supprimer</button>
        </div>
    </div>
  </div>
</div>
  </div>
  </div>
  `
  numMess++
  const messagesContainer = document.querySelector('#messages')
  messagesContainer.appendChild(messageElement)
  preced = messagesContainer

  if (numMess > limite){
   //limiter le nombre de messages dans le chat
   const messagesToDelete = numMess - limite - 1

   let myDiv = document.getElementById(messagesToDelete)
   console.log(myDiv)
   myDiv.parentNode.removeChild(myDiv)
   }


  response()
  
}

function response() {
  //surligne les réponses utilisateurs ("@...")
  let elements = document.querySelectorAll('p, span')
  for (let i = 0; i < elements.length; i++) {
    elements[i].innerHTML = elements[i].innerHTML.replace(
      /\S*@\S*/g,
      '<mark>$&</mark>'
    )
  }
}

function update_PlayPause() {
  var button = document.getElementById('play_pause')
  if (podcastIsPlaying == false) {
    button.setAttribute('class', 'play_pause myButton')
  } else {
    button.setAttribute('class', 'pause_play myButton')
  }
}

chrome.runtime.connect({ name: 'main' })

update_PlayPause();

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  let url = tabs[0].url;
  console.log(url);
  console.log(url.search("podcasts.google"));
  if(url.search("podcasts.google") == -1)
  {
    console.log(url.search("podcasts.google"));
    window.location.replace('./wrong_tab.html');
  }
  // use `url` here inside the callback because it's asynchronous!
}); 


