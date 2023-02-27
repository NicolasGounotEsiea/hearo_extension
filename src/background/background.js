console.log("BG ready !")

// =========== IMPORTS =========
import { firebaseApp, db } from '../firebase_config'
import { onSnapshot, collection } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// ========== VARIABLES ========
let currentEpisode = {
  startingTime: '',
  endingTime: '',
  isPlaying: '',
  title: '',
  rssUrl: '',
  comments: []
}
let previousEpisode = {
  startingTime: '',
  endingTime: '',
  isPlaying: '',
  title: '',
  rssUrl: '',
  comments: []
}
let currentOnSnapshot = null
let commentsPort = null
let ordersForForeground = null
let mainPort = null
let foregroundTabId = null
let allCommentsHasBeenSent = false
let mainIsActive = false
let foregroundIsActive = false
let currentUser = null

// ============ CODE ===========
onAuthStateChanged(getAuth(firebaseApp), user => {
  if (user != null) {
    currentUser = user
    chrome.storage.local.set({ 'currentUser': currentUser });
    chrome.storage.sync.set({ 'userIsLogin': true });
    console.log('User is logged in')
  } else {
    currentUser = null
    chrome.storage.local.set({ 'currentUser': currentUser });
    chrome.storage.sync.set({ 'userIsLogin': false });
  }
})

// TODO : lancer wrong_tab.html si l'utilisateur n'a pas d'onglet google podcast

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    tab.url.includes('podcasts.google.com') &&
    changeInfo.status === 'complete'
  ) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ['./foreground.js']
      })
      .then(() => {
        foregroundTabId = tabId
        chrome.storage.local.set({ 'foregroundTabId': foregroundTabId });
        chrome.storage.sync.set({ 'isForegroundInjected': true });
      })
      .catch(err => console.log(err))
  }
})

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'data_player_fg_to_bg') {
    foregroundIsActive = true
    
    port.onMessage.addListener(function (msg) {
      updateEpisodeVariables(msg)
      
      if (mainIsActive && mainPort !== null) {
        mainPort.postMessage({
          startingTime: msg.startingTime,
          endingTime: msg.endingTime,
          isPlaying: msg.lecture,
          title: msg.title,
          rssUrl: msg.rssUrl,
        })
        // TODO : uncomment this line when the function sendCommentsToPopup() is done
        // sendCommentsToPopup(commentsList)
      }
    })

    port.onDisconnect.addListener(function () {
      foregroundIsActive = false
    })
  }
})

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'main_status') {
    allCommentsHasBeenSent = false
    mainPort = port
    mainIsActive = true
    chrome.storage.sync.set({ 'mainIsActive': mainIsActive });

    port.onDisconnect.addListener(function () {
      allCommentsHasBeenSent = false
      mainIsActive = false
      chrome.storage.sync.set({ 'mainIsActive': mainIsActive });
    })
  }
})

// ========= FUNCTIONS =========
function resetPort(port) {
  if (port !== null) {
    port.disconnect()
    port = null
  }
}

// TODO : finir cette fonction
function sortComments (comments) {
  // ici on trie les commentaires par timecode, faut trouver la bonne logique
  let commentsSorted = []
  comments.forEach(item => {
    console.log('item = ', item)
    console.log('timecode = ', item.timecode)
    commentsSorted.unshift(item)
  })
  return commentsSorted
}

// TODO : finir cette fonction
function sendCommentsToPopup (commentsList) {
  if (commentsPort !== null) {
    let commentsToSend = sortComments(commentsList)

    // ce qu'on envoie c'est un objet avec 3 éléments : commentsList, episodeTitle, rssUrl
    // pour envoyer un objet, on utilise la méthode postMessage() avec le port commentsPort
    if (allCommentsHasBeenSent) {
      // envoyer à partir du timecode actuel + 10scd
      // le timecode actuel est dans currentEpisode.startingTime
      // voila commente faire le filtrage
      commentsToSend = commentsToSend.filter(item => {
        // return item.timecode > currentEpisode.startingTime + 10;
      })
    } else {
      // envoyer tout commentsToSend parce que tous les commentaires n'ont pas encore été envoyés
      allCommentsHasBeenSent = true
    }
  }
}

function updateEpisodeVariables (msgReceived) {
  if (currentEpisode.title === '' && previousEpisode.title === '') {
    currentEpisode.startingTime = msgReceived.startingTime
    currentEpisode.endingTime = msgReceived.endingTime
    currentEpisode.isPlaying = msgReceived.lecture
    currentEpisode.title = msgReceived.title
    currentEpisode.rssUrl = msgReceived.rssUrl

    launchOnSnapshot()
  } else if (
    msgReceived.title !== currentEpisode.title &&
    currentEpisode.title !== ''
  ) {
    previousEpisode.startingTime = currentEpisode.startingTime
    previousEpisode.endingTime = currentEpisode.endingTime
    previousEpisode.isPlaying = currentEpisode.lecture
    previousEpisode.title = currentEpisode.title
    previousEpisode.rssUrl = currentEpisode.rssUrl

    currentEpisode.startingTime = msgReceived.startingTime
    currentEpisode.endingTime = msgReceived.endingTime
    currentEpisode.isPlaying = msgReceived.lecture
    currentEpisode.title = msgReceived.title
    currentEpisode.rssUrl = msgReceived.rssUrl

    launchOnSnapshot()
  } else if (currentEpisode.title === previousEpisode.title) {
    currentEpisode.startingTime = msgReceived.startingTime
    currentEpisode.endingTime = msgReceived.endingTime
    currentEpisode.isPlaying = msgReceived.lecture
  }
}

function launchOnSnapshot () {
  if (currentEpisode.title !== '') {
    let commentsList = []

    if (currentOnSnapshot !== null) {
      currentOnSnapshot()
      currentOnSnapshot = null
    }

    // TODO : uncomment this code when firestore rules pblm fixed
    // if (currentUser !== null) {
    //   let collRef = collection(db, currentEpisode.title)
    //   currentOnSnapshot = onSnapshot(collRef, (snapshot) => {
    //     if (!snapshot.empty) {
    //       snapshot.forEach(doc => {
    //         commentsList.push(doc.data())
    //       })
    //       currentEpisode.comments = commentsList
    //       console.log('Current comments list : ', currentEpisode.comments)
    //     } else {
    //       console.log('Collection empty for : ' + currentEpisode.title)
    //     }
    //   })
    // }
  }
}

// =========== IDEAS ===========
/*
TODO important : réussir à trier les commentaires par timecode avec le plus grand en premier
TODO important : réussir à envoyer tous les commentaires apres le timecode actuel à la popup
*/

/*
TODO pas important : Un fonction qui détecte s'il y a plusieurs onglets ouverts avec 
le site podcasts.google.com pour envoyer un message à la popup et 
qu'elle demande à l'utilisateur de fermer les autres onglets pour 
une meilleure expérience utilisateur (éviter les conflits de données).
*/