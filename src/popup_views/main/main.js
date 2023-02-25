// *************************************************************
// *************************************************************
console.log('------------ MAINS-CRIPT.JS IS LOADED ------------')
// *************************************************************
// *************************************************************

var timecode = 0
var userid
import * as firebase from 'firebase/app'
import { firebaseApp, db } from '../firebase_config'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  doc,
  onSnapshot,
  addDoc,
  collection,
  getDocs
} from 'firebase/firestore'

const {
  initializeApp,
  applicationDefault,
  cert
} = require('../firebase_config')
const { getFirestore, Timestamp, FieldValue } = require('../firebase_config')
import 'firebase/database'

//VARIABLES GLOBALES
let comment = ''
let mess = ''
let limite = 10 //limite de message du chat
let numMess = 0 //nombre de messages affichés depuis le début
let messageElement = '' //élément injecter pour afficher le commentaire
let preced = '' //div du message precedent

let mainPort = chrome.runtime.connect({ name: 'main_status' })

let ordersForBg = chrome.runtime.connect({
  name: 'orders_from_main'
})

let currentUser = null

let previousCommentsList = []
let currentCommentsList = []

let commentObjectToSend = {
  podcastEpisode: {},
  timecode: '',
  userName: '',
  userId: '',
  comment: '',
  private: false
}

let commentToSend = {
  podcastEpisode: {},
  timecode: '',
  userName: '',
  userId: '',
  comment: '',
  private: false
}

let currentData = {
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


// detect when main.html is completely load
document.addEventListener('DOMContentLoaded', function () {
  console.log('main.js - DOMContentLoaded')

  chrome.storage.sync.get(['isUserLogIn'], function (data) {
    if (data.isUserLogIn === 'No') {
      window.location.replace('./login.html')
    }
  });

  document.querySelector('#btn_user_profile').addEventListener('click', () => {
    window.location.replace('./settings.html')
  })

  document.querySelector('#publish_btn').addEventListener('click', () => {
    let textArea = document.getElementById('text_field')
    let userComment = textArea.value
    let toggleStatus = document.getElementById('togBtn').checked

    if (userComment.length !== 0) {
      textArea.placeholder = ' votre commentaire'
      textArea.style.setProperty('color', 'black')
      textArea.style.setProperty('background-color', 'white')
      
      commentObjectToSend = {
        podcastEpisode: currentData.episode,
        timecode: currentData.timecode.startingTime,
        userName: currentUser.displayName,
        userId: currentUser.uid,
        comment: userComment,
        private: toggleStatus
      }
      commentObjectToSend.comment = cleanBadWords(commentObjectToSend.comment)
      
      addDocFirestore(currentData.episode.title, commentObjectToSend)
      
      textArea.value = ''
    } else {
      updateStyleForEmptyComment(textArea)
    }
  })

  document.querySelector('#minus_ten').addEventListener('click', () => {
    ordersForBg.postMessage({ order: 'click_minus_ten' })
  })

  document.querySelector('#play_pause').addEventListener('click', () => {
    ordersForBg.postMessage({ order: getPlayPauseOrder() })
    switchPlayPauseButton()
  })

  document.querySelector('#plus_thirty').addEventListener('click', () => {
    ordersForBg.postMessage({ order: 'click_plus_thirty' })
  })
})

mainPort.onMessage.addListener(function (msg) {
  updateTimeCode(msg.startingTime, msg.endingTime)
  updtateEpisodeTitle(msg.title)
  updateLecture(msg.isPlaying)
})

document.querySelector('#test1').addEventListener('click', async () => {
  console.log('CLICK1')

  let commentsReceived = {
    episodeTitle: 'my episode title',
    rssUrl: 'my url',
    comments: [
      {
        comment: 'my comment',
        timecode: '00:14'
      },
      {
        comment: 'my comment2',
        timecode: '00:24'
      },
      {
        comment: 'my comment3',
        timecode: '01:34'
      }
    ]
  }

  // chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
})

document.querySelector('#test2').addEventListener('click', async () => {
  console.log('CLICK2')
})

document.querySelector('#test3').addEventListener('click', async () => {
  console.log('CLICK3')
})

document.querySelector('#test4').addEventListener('click', async () => {
  console.log('CLICK4')
})

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'comments_from_bg') {
    port.onMessage.addListener(function (msg) {
      console.log('main.js - Message received from ' + port.name + ' : ', msg)
      previousCommentsList = currentCommentsList
      currentCommentsList = msg.comments
      // TODO : Mettre à jour la popup avec une fonction qui va afficher les nouveaux commentaires
    })

    port.onDisconnect.addListener(function () {
      console.log("main.js - background.js n'est plus actif.")
    })
  }
})

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

//fonction pour récupérer les commentaires du serveur firestore
const fetchComments = async episodeTitle => {
  let comments = []
  const querySnapshot = await getDocs(collection(db, episodeTitle))
  querySnapshot.forEach(doc => {
    // console.log(doc.id, ' => ', doc.data());
    comments.push(doc.data())
  })
  return comments
}

function clearLocalStorage () {
  return chrome.storage.sync.clear(function () {
    let error = chrome.runtime.lastError
    if (error) {
      console.error(error)
    }
  })
}

function getAllLocalStorage () {
  // Récupérer les données du storage
  return chrome.storage.sync.get(null, function (items) {
    console.log(items)
  })
}

//fonction pour récupérer les commentaires du serveur firestore
const fetchBuffer = async () => {
  let buffer = []
  chrome.storage.sync.get(null, function (items) {
    buffer = items
  })
  return buffer
}

function updateLecture (playingState) {
  let button = document.getElementById('play_pause')
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
  let myElement = document.getElementsByClassName('episodeTitle')[0]
  myElement.innerHTML = episodeTitle
}

function updateTimeCode (startingTime, endingTime) {
  let myElement = document.getElementsByClassName('current_timecode')[0]
  myElement.innerHTML = startingTime + ' / ' + endingTime
}

const updateStyleForEmptyComment = textArea => {
  textArea.placeholder = 'Entrez un commentaire valide'
  textArea.style.setProperty('color', 'white', 'important')
  textArea.style.setProperty('background-color', 'pink', 'important')
}

const cleanBadWords = comment => {
  var badWords = ['badword']
  var sentence = comment
  for (let i = 0; i < badWords.length; i++) {
    var regex = new RegExp(badWords[i], 'gi')
    sentence = sentence.replace(regex, '***')
  }
  return sentence
}

const addDocFirestore = async (collectionName, data) => {
  if (collectionName !== "" && data !== "") {
    const docRef = addDoc(collection(db, collectionName), data)
    .then(result => {
      console.log('Document written with ID: ', result.id)
    })
    .catch(err => {
      console.error('Error adding document: ', e)
    })
    console.log('Document written with ID: ', docRef.id)
  }
}

function getPlayPauseOrder () {
  let button = document.getElementById('play_pause')
  let buttonClass = button.className

  if (buttonClass === 'play_pause btn') {
    return 'play'
  } else {
    return 'pause'
  }
}

function switchPlayPauseButton () {
  let button = document.getElementById('play_pause')
  let buttonClass = button.className

  if (buttonClass === 'play_pause btn') {
    button.className = 'pause_play btn'
  } else {
    button.className = 'play_pause btn'
  }
}

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
      // console.log(mess.UUID)
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
        // console.log(myDiv)
        myDiv.parentNode.removeChild(myDiv)
      }
    }
  })
}

function testAff (mess) {
  //juste une fonction d'injection de commentaire qu'il faut que je renomme

  messageElement = document.createElement('div')

  var pri = 'Private'
  if (mess.private == 0) {
    pri = 'Public'
  }
  messageElement.innerHTML = `<div class="chat-message user-message">
  
  <div class="chat-message-content">
  
    <p class="chat-message-username">  <span class="pubpri">${pri}</span><span class="time">${mess.timeCode}</span>${mess.userName}</p>
    <p class="chat-message-text">${mess.comment}</p>
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
    // console.log(myDiv)
    myDiv.parentNode.removeChild(myDiv)
  }

  response()
}

onAuthStateChanged(getAuth(firebaseApp), user => {
  if (user != null) {
    currentUser = user
    currentData.userIsLoggedIn = true
    // console.log('Below User is logged in : ', user)
  } else {
    currentData.userIsLoggedIn = false
    window.location.replace('./login.html')
  }
})