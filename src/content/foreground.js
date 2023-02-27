console.log("FG ready !")

// =========== IMPORTS =========
import { firebaseApp, db } from '../firebase_config'

// =============================
// ========== VARIABLES ========
let playerLoopSpeed = 1000
let dataPlayerFgToBg = chrome.runtime.connect({
  name: 'data_player_fg_to_bg'
})

// =============================
// ============ CODE ===========
if (document.readyState == 'complete') {

  if (document.querySelector("div[jsname='GnMNvf']") !== null) {
    chrome.storage.sync.set({ playerExist: true })
  } else {
    chrome.storage.sync.set({ playerExist: false })
  }

  setInterval(sendDataPlayer, playerLoopSpeed)

  chrome.runtime.onConnect.addListener(function (port) {
    if (port.name === 'orders_from_main') {
      console.log("main.js est actif.")
  
      port.onMessage.addListener(function (msg) {
        switch (msg.order) {
          case 'click_play_pause':
            document.querySelector("div[jsname='IGlMSc']").click();
            break;
          case 'click_plus_thirty':
            document.querySelector("div[jsname='xBcuNc']").click();
            break;
          case 'click_minus_ten':
            document.querySelector("div[jsname='HQzqRc']").click();
            break;
          default:   
        }
      })
  
      port.onDisconnect.addListener(function () {
        console.log("main.js n'est plus actif.")
      })
    }
  })
}

// =============================
// ========= FUNCTIONS =========
function sendDataPlayer () {
  let playerExist = document.querySelector("div[jsname='GnMNvf']") !== null
  dataPlayerFgToBg.postMessage({
    startingTime: playerExist
      ? document.getElementsByClassName('oG0wpe')[0].firstChild.textContent
      : '',
    endingTime: playerExist
      ? document.getElementsByClassName('oG0wpe')[0].lastChild.textContent
      : '',
    lecture: playerExist
      ? document.querySelector("div[jsname='IGlMSc']").ariaLabel
      : '',
    title: playerExist
      ? document.querySelector("div[jsname='jLuDgc']").textContent
      : '',
    rssUrl: playerExist
      ? document.querySelector("div[jsname='NTHlvd']").textContent
      : '',
    playerIsLoad: playerExist ? true : false
  })

  if (!playerExist) {
    chrome.storage.sync.set({ playerExist: false })
  }
}