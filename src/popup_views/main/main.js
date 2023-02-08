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

var commentToSend = {
  podcastEpisode: {},
  timecode: '',
  userName: '',
  userId: '',
  comment: '',
  private: false
}

var currentEpisode = {
  title: '',
  rssUrl: ''
}

var currentData = {
  userIsLoggedIn: false,
  podcastIsPlaying: false,
  timecode: {
    startingTime: '',
    endingTime: ''
  },
  episode: {
    title: '',
    rssUrl: ''
  }
}

var currentUser = null

const auth = getAuth(firebaseApp) // Auth instance for the current firebaseApp

onAuthStateChanged(auth, user => {
  if (user != null) {
    currentUser = user
    currentData.userIsLoggedIn = true
    console.log('Below User is logged in : ', user)
  } else {
    currentData.userIsLoggedIn = false
    window.location.replace('./login.html')
  }
})

// document.addEventListener('DOMContentLoaded', function () {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, {
//       playerAction: '',
//       userIsLoggedIn: userIsLoggedIn,
//       mainViewIsOpen: true
//     })
//   })

//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     document.querySelector('#minus_ten').addEventListener('click', () => {
//       chrome.tabs.sendMessage(tabs[0].id, {
//         playerAction: 'MINUS TEN',
//         userIsLoggedIn: userIsLoggedIn,
//         mainViewIsOpen: true
//       })
//     })
//   })

//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     document.querySelector('#play_pause').addEventListener('click', () => {
//       chrome.tabs.sendMessage(tabs[0].id, {
//         playerAction: 'PLAY PAUSE',
//         userIsLoggedIn: userIsLoggedIn,
//         mainViewIsOpen: true
//       })
//     })
//   })

//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     document.querySelector('#plus_thirty').addEventListener('click', () => {
//       chrome.tabs.sendMessage(tabs[0].id, {
//         playerAction: 'PLUS THIRTY',
//         userIsLoggedIn: userIsLoggedIn,
//         mainViewIsOpen: true
//       })
//     })
//   })

// document.querySelector('#btn_user_profile').addEventListener('click', () => {
//   window.location.replace('./settings.html')
// })

//   chrome.runtime.onMessage.addListener(function (
//     request,
//     sender,
//     sendResponse
//   ) {
//     if (request.podcastIsPlaying) {
//       podcastIsPlaying = true
//     } else {
//       podcastIsPlaying = false
//     }
//     updateTimeCode(request.startingTime, request.endingTime)
//     timecode = request.startingTime
//     if (podcastIsPlaying == true) {
//       getComments(timecode)
//     }
//   })
// })

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.podcastIsPlaying) {
//     podcastIsPlaying = true
//     update_PlayPause()
//   } else {
//     podcastIsPlaying = false
//     update_PlayPause()
//   }

//   const mySwitch = document.getElementById('private')
//   mySwitch.addEventListener('switch', function () {
//     if (mySwitch.value == 0) {
//       document.getElementById('private').value = '1'
//     } else {
//       document.getElementById('private').value = '0'
//     }
//     console.log(mySwitch.value)
//   })

//   startingTime = request.startingTime
//   endingTime = request.endingTime
//   episodeTitle = request.episodeTitle
//   updateTimeCode(startingTime, endingTime)
//   updtateEpisodeTitle(episodeTitle)

//   if (numMess > limite) {
//     //limiter le nombre de messages dans le chat
//     const messagesToDelete = numMess - limite - 1

//     let myDiv = document.getElementById(messagesToDelete)
//     console.log(myDiv)
//     myDiv.parentNode.removeChild(myDiv)
//   }
// })

document.querySelector('#publish_btn').addEventListener('click', () => {
  commentToSend.podcastEpisode = currentEpisode
  commentToSend.timecode = currentData.timecode.startingTime
  commentToSend.userName = currentUser.displayName
  commentToSend.userId = currentUser.uid
  commentToSend.comment = document.getElementById('text_field').value
  commentToSend.private = document.getElementById('togBtn').checked
  // commentToSend.private = '0'

  if (commentToSend.comment.length === 0) {
    document.getElementById('text_field').placeholder = 'Entrez un commentaire valide'
    document.getElementById('text_field').style.setProperty('color', 'white', 'important')
    document.getElementById('text_field').style.setProperty('background-color', 'pink', 'important')
  } else {
    document.getElementById('text_field').placeholder = ' votre commentaire'
    document.getElementById('text_field').style.setProperty('color', 'black')
    document.getElementById('text_field').style.setProperty('background-color', 'white')
    
    var badWords = ['badword']
    var sentence = commentToSend.comment
    for (let i = 0; i < badWords.length; i++) {
      var regex = new RegExp(badWords[i], 'gi')
      sentence = sentence.replace(regex, '***')
    }
    console.log('Phrase modifiée : ' + sentence)
    commentToSend.comment = sentence
    document.getElementById('text_field').value = ''
    console.log('SUBMIT : ', commentToSend)

    document.getElementById('text_field').value = ''
    console.log('SUBMIT : ', commentToSend)
    
    // Add a new document.
    const docRef = addDoc(collection(db, currentEpisode.title), commentToSend)
    .then((result) => {
      console.log('Document written with ID: ', result.id)  
    }).catch((err) => {
      console.error('Error adding document: ', e)  
    });

    // testAff(commentToSend)
    // document.getElementById('private').value = '0'
  }
})

// fonction d'affichage des comentaires
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

      if (numMess > limite) {
        //limiter le nombre de messages dans le chat
        const messagesToDelete = numMess - limite - 1

        let myDiv = document.getElementById(messagesToDelete)
        console.log(myDiv)
        myDiv.parentNode.removeChild(myDiv)
      }
    }
  })
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

  if (numMess > limite) {
    //limiter le nombre de messages dans le chat
    const messagesToDelete = numMess - limite - 1

    let myDiv = document.getElementById(messagesToDelete)
    console.log(myDiv)
    myDiv.parentNode.removeChild(myDiv)
  }

  response()
}

function response () {
  //surligne les réponses utilisateurs ("@...")
  let elements = document.querySelectorAll('p, span')
  for (let i = 0; i < elements.length; i++) {
    elements[i].innerHTML = elements[i].innerHTML.replace(
      /\S*@\S*/g,
      '<mark>$&</mark>'
    )
  }
}

// document.querySelector('#test').addEventListener('click', async () => {
//   console.log('TEST')
//   console.log("document.getElementById('private').value : ", document.getElementById('slider round').value);
//   // testAff("bonjour");
//   // getAllComments();

//   // var currentCollection = "cities";
//   // Date.now()

//   // console.log('currentData.episode.title = ', currentData.episode.title)
//   // // Add a new document with a generated id.
//   // const docRef = await addDoc(collection(db, currentData.episode.title), {
//   //   name: 'Tokyo2',
//   //   country: 'Japan'
//   // })
//   // console.log('Document written with ID: ', docRef.id)

//   // // Get all documents in a collection
//   // const querySnapshot = await getDocs(collection(db, currentCollection));
//   // querySnapshot.forEach((doc) => {
//   //   // doc.data() is never undefined for query doc snapshots
//   //   console.log(doc.id, " => ", doc.data());
//   // });
// })

// const getAllComments = async () => {
//   const querySnapshot = await getDocs(collection(db, "AH OUAIS ? - Pourquoi les poteaux de foot sont-ils ronds ?"));
//   querySnapshot.forEach((doc) => {
//     // doc.data() is never undefined for query doc snapshots
//     console.log(doc.id, " => ", doc.data());
//   });
// }

var mainForBackgroundPort = chrome.runtime.connect({
  name: 'main_connection_for_background'
})

chrome.tabs.query({}, function (tabs) {
  tabs.forEach(function (tab) {
    if (tab.url.includes('podcasts.google.com')) {
      var mainForForegroundPort = chrome.tabs.connect(tab.id, {
        name: 'main_connection_for_foreground'
      })
      var podcastInformationsPort = chrome.tabs.connect(tab.id, {
        name: 'podcast_informations'
      })
      var playerActionsPort = chrome.tabs.connect(tab.id, {
        name: 'player_actions'
      })

      podcastInformationsPort.onMessage.addListener(function (msg) {
        currentEpisode.title = msg.episodeTitle
        currentEpisode.rssUrl = msg.podcastRssUrl
        updtateEpisodeTitle(currentEpisode.title)

        updateLecture(msg.lecture)

        currentData.timecode.startingTime = msg.startingTime
        currentData.timecode.endingTime = msg.endingTime
        updateTimeCode(
          currentData.timecode.startingTime,
          currentData.timecode.endingTime
        )
      })

      document.querySelector('#minus_ten').addEventListener('click', () => {
        playerActionsPort.postMessage({ order: 'click_minus_ten' })
      })

      document.querySelector('#play_pause').addEventListener('click', () => {
        playerActionsPort.postMessage({ order: 'click_play_pause' })
      })

      document.querySelector('#plus_thirty').addEventListener('click', () => {
        playerActionsPort.postMessage({ order: 'click_plus_thirty' })
      })
    }
  })
})

document.querySelector('#btn_user_profile').addEventListener('click', () => {
  window.location.replace('./settings.html')
})

function updateLecture (playingState) {
  var button = document.getElementById('play_pause')
  switch (playingState) {
    case 'Lecture':
      currentData.podcastIsPlaying = false
      button.setAttribute('class', 'play_pause myButton')
      break
    case 'Pause':
      currentData.podcastIsPlaying = true
      button.setAttribute('class', 'pause_play myButton')
      break
    default:
      break
  }
}

function updtateEpisodeTitle (episodeTitle) {
  var myElement = document.getElementsByClassName('episodeTitle')[0]
  myElement.innerHTML = episodeTitle
}

function updateTimeCode (startingTime, endingTime) {
  var myElement = document.getElementsByClassName('current_timecode')[0]
  myElement.innerHTML = startingTime + ' / ' + endingTime
}
