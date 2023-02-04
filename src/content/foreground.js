// *************************************************************
// *************************************************************
console.log("------------ FOREGROUND.JS IS LOADED ------------");
// *************************************************************
// *************************************************************

var popupMainViewIsOpen = false;
var timecodePort = null;
var podcastInformationsPort = null;

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "main_connection_for_foreground") {
    console.log("Main view est actif.");
    
    timecodePort = port;
    popupMainViewIsOpen = true;
    
    port.onDisconnect.addListener(function() {
      popupMainViewIsOpen = false;
      console.log("Main view n'est plus actif.");
    });
  }
})

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "podcast_informations") {
    podcastInformationsPort = port;
  }
})

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "player_actions") {
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
          console.log("no order from main view")
      }
    })
  }
})

setInterval(() => {
  if (popupMainViewIsOpen) {
    if (podcastInformationsPort !== null) {
      podcastInformationsPort.postMessage({
        startingTime: document.getElementsByClassName("oG0wpe")[0].firstChild.textContent,
        endingTime: document.getElementsByClassName("oG0wpe")[0].lastChild.textContent,
        lecture: document.querySelector("div[jsname='IGlMSc']").ariaLabel,
        episodeTitle: document.querySelector("div[jsname='jLuDgc']").textContent,
        podcastRssUrl: document.querySelector("div[jsname='NTHlvd']").textContent
      })
    } else {
      console.log("podcastInformationsPort is null so we can't send informations.");
    }
  }
}, 100);