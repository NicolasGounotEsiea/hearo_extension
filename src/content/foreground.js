// =========== IMPORTS =========
import { firebaseApp, db } from '../popup_views/firebase_config'

// =============================
// ========== VARIABLES ========
let playerLoopSpeed = 1000
let dataPlayerFgToBg = chrome.runtime.connect({
  name: 'data_player_fg_to_bg'
})

// =============================
// ============ CODE ===========
if (document.readyState == 'complete') {
  // The page is fully loaded

  if (document.querySelector("div[jsname='GnMNvf']") !== null) {
    chrome.storage.sync.set({ playerExist: true })
  }

  setInterval(sendDataPlayer, playerLoopSpeed)

  chrome.runtime.onConnect.addListener(function (port) {
    if (port.name === 'orders_from_bg') {
      port.onMessage.addListener(function (msg) {
        clickPlayerButtons(msg)
      })

      port.onDisconnect.addListener(function () {
        console.log('foreground.js - ' + port.name + ' disconnected')
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

function clickPlayerButtons (msgOrder) {
  // TODO : Faire fonctionner le play pause button avec le audio.play() et audio.pause()
  switch (msgOrder) {
    case 'play':
      console.log('play')
      // document.querySelector("audio").play()
      // document.querySelector("div[jsname='IGlMSc']").click()
      break
    case 'pause':
      console.log('pause')
      // document.querySelector("audio").pause()
      // document.querySelector("div[jsname='IGlMSc']").click()
      break
    case 'click_plus_thirty':
      document.querySelector("div[jsname='xBcuNc']").click()
      break
    case 'click_minus_ten':
      document.querySelector("div[jsname='HQzqRc']").click()
      break
    default:
      break
  }
}
