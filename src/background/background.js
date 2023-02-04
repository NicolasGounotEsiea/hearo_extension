// *************************************************************
// *************************************************************
console.log('------------ BACKGROUND.JS IS LOADED ------------')
// *************************************************************
// *************************************************************

var mainViewIsOpen = false
var rightTab = null
var scriptIsInjected = false

// Injecter le script dans la bonne page web au lancement de background.js
chrome.tabs.query({}, function (tabs) {
  tabs.forEach(function (tab) {
    if (tab.url.includes('podcasts.google.com')) {
      rightTab = tab

      if (!scriptIsInjected) {
        chrome.scripting
          .executeScript({
            target: { tabId: rightTab.id },
            files: ['./foreground.js']
          })
          .then(() => {
            scriptIsInjected = true
            console.log(
              'Foreground script injected in this tab : ',
              rightTab.url
            )
          })
          .catch(err => console.log(err))
      }
    }
  })
})

// Ré-injecter le script quand la page est actualisé
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  scriptIsInjected = false
  if ( changeInfo.status === 'complete' && tab.url.includes('podcasts.google.com') ) {
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        files: ['./foreground.js']
      })
      .then(() => {
        scriptIsInjected = true
        rightTab = tab
        console.log('Foreground script injected in this tab : ', rightTab.url)
      })
      .catch(err => console.log(err))
  }
})

// DÉTECTER QUAND LE FOREGROUND EST DÉCONNECTÉ
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'foreground_connection') {
    scriptInjected = true
    port.onDisconnect.addListener(function () {
      scriptInjected = false
    })
  }
})

// DÉTECTER QUAND LE MAIN EST DÉCONNECTÉ
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "main_connection_for_background") {
    console.log("Main view est actif.");
    mainViewIsOpen = true;
    
    port.onDisconnect.addListener(function() {
      mainViewIsOpen = false;
      console.log("Main view n'est plus actif.");
    });
  }
})