console.log('MAIN ready !')

// =========== IMPORTS =========
import { db, firebaseApp } from '../../firebase_config'
import {
  getFirestore,
  onSnapshot,
  addDoc,
  collection,
  getDocs
} from 'firebase/firestore'

// ========== VARIABLES ========
var timecode = 0
var userid
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

let previousEpisodeTitle = ""
let currentEpisodeTitle = ""

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

// ============ CODE ===========
document.addEventListener('DOMContentLoaded', function () {
  console.log('firebaseApp : ', firebaseApp)

  console.log('DB : ', db)
  console.log('getFirestore(firebaseApp) : ', getFirestore(firebaseApp))

  console.log(
    "collection(db, 'Une longue inspiration') : ",
    collection(db, 'Une longue inspiration')
  )

  chrome.storage.local.get(['currentUser'], function (data) {
    currentUser = data.currentUser
  })

  chrome.storage.sync.get(['userIsLogin'], function (data) {
    if (!data.userIsLogin) {
      window.location.replace('./login.html')
    }
  })

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
        userName: currentUser != null ? currentUser.displayName : '',
        userId: currentUser != null ? currentUser.uid : '',
        comment: userComment,
        private: toggleStatus
      }
      commentObjectToSend.comment = cleanBadWords(commentObjectToSend.comment)

      console.log('currentData.episode.title : ', currentData.episode.title)
      console.log('commentObjectToSend : ', commentObjectToSend)
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
  console.log("Message reçu : ", msg)
  
  currentData.userIsLoggedIn = msg.userIsLoggedIn
  currentData.podcastIsPlaying = msg.podcastIsPlaying
  currentData.timecode.startingTime = msg.startingTime
  currentData.timecode.endingTime = msg.endingTime
  currentData.episode.title = msg.title
  currentData.episode.rssUrl = msg.rssUrl

  updatePopupPlayer(msg.title, msg.startingTime, msg.endingTime)
  updateLecture(msg.isPlaying)
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

function updateCurrentData(msgReceived) {
    
  if (currentData.episode.title === '' && previousEpisodeTitle === '' & currentEpisodeTitle === '') {
    currentEpisodeTitle = currentData.episode.title

    currentData.timecode.startingTime = msgReceived.startingTime
    currentData.timecode.endingTime = msgReceived.endingTime
    currentData.podcastIsPlaying = msgReceived.lecture
    currentData.episode.title = msgReceived.title
    currentData.episode.rssUrl = msgReceived.rssUrl

    launchOnSnapshot()
  } else if (
    msgReceived.title !== currentData.episode.title &&
    currentData.episode.title !== ''
  ) {
    previousEpisodeTitle = currentData.episode.title

    currentData.timecode.startingTime = msgReceived.startingTime
    currentData.timecode.endingTime = msgReceived.endingTime
    currentData.podcastIsPlaying = msgReceived.lecture
    currentData.episode.title = msgReceived.title
    currentData.episode.rssUrl = msgReceived.rssUrl

    currentEpisodeTitle = currentData.episode.title

    launchOnSnapshot()
  } else if (currentData.episode.title === previousEpisodeTitle) {
    currentEpisodeTitle = currentData.episode.title

    currentEpisode.startingTime = msgReceived.startingTime
    currentEpisode.endingTime = msgReceived.endingTime
    currentEpisode.isPlaying = msgReceived.lecture
  }

  console.log("previous episode : " + previousEpisodeTitle)
  console.log("current episode : " + currentEpisodeTitle)
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

function updatePopupPlayer (episodeTitle, startingTime, endingTime) {
  let myEpisodeTitleElement = document.getElementsByClassName('episodeTitle')[0]
  let myTimecodeElement = document.getElementsByClassName('current_timecode')[0]
  myEpisodeTitleElement.innerHTML = episodeTitle
  myTimecodeElement.innerHTML = startingTime + ' / ' + endingTime
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
  if (collectionName !== '' && data !== null) {
    addDoc(collection(db, collectionName), data)
      .then(result => {
        console.log('Document written with ID: ', result.id)
      })
      .catch(err => {
        console.error('Error adding document: ', err)
      })
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

// =========== IDEAS ===========
/*
TODO : créer une fonction qui prends un commentaire en paramètre et qui l'affiche
TODO : créer une fonction qui prends une liste de commentaire en paramètre et qui les affiche dans le bonne ordre
*/
