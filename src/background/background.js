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

let dataPlayerPort = null

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
        dataPlayerPort = chrome.tabs.connect(foregroundTabId, { name: 'data_player_btw_fg_and_bg' })

        dataPlayerPort.onMessage.addListener(function (msg) {
          console.log("msg received from foreground", msg)
        })
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