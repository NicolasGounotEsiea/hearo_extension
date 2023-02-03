// *************************************************************
// *************************************************************
console.log('------------ BACKGROUND.JS IS LOADED ------------')
// *************************************************************
// *************************************************************

var mainViewIsOpen = false
var userIsLoggedIn = true
var rightTab = null
var scriptIsInjected = false
var currentFirstTimecode = ''
var currentLastTimecode = ''

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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  scriptIsInjected = false
  if (
    changeInfo.status === 'complete' &&
    tab.url.includes('podcasts.google.com')
  ) {
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

// var tabs = await chrome.tabs.query({});

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   console.log("tabId = ", tabId);
//   console.log("changeInfo = ", changeInfo);
//   console.log("tab = ", tab);
//   if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
//     chrome.scripting.executeScript({
//       target: { tabId: tabId },
//       files: ["./foreground.js"]
//     })
//       .then(() => {
//         console.log("INJECTED THE FOREGROUND SCRIPT.");
//       })
//       .catch(err => console.log(err));
//   }
// });

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     userIsLoggedIn = request.userIsLoggedIn;
//   }
// );

// chrome.runtime.onConnect.addListener(function(port) {
// if (port.name === "main") {
//   mainViewIsOpen = true;
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, {
//       playerAction: "",
//       userIsLoggedIn: userIsLoggedIn,
//       mainViewIsOpen: true
//     });
//   });

//   port.onDisconnect.addListener(function() {
//     mainViewIsOpen = false;
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, {
//         playerAction: "",
//         userIsLoggedIn: userIsLoggedIn,
//         mainViewIsOpen: false
//       });
//     });
//   });
// }
// });

// DÉTECTER QUAND LE FOREGROUND EST DÉCONNECTÉ
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'foreground_connection') {
    // console.log("background.js - The port " + port.name + " is connected from this tab : " + port.sender.origin);
    // console.log("background.js - The port : ", port);
    port.onDisconnect.addListener(function () {
      scriptInjected = false
      // console.log("background.js - The port " + port.name + " has been disconnected from this tab : " + port.sender.origin);
    })
  }
})

// // DÉTECTER QUAND LE MAIN EST DÉCONNECTÉ
// chrome.runtime.onConnect.addListener(function (port) {
//   if (port.name === "main_connection") {
//     var infiniteSendingTimecode = null;
//     port.onMessage.addListener(function (msg) {
//       // TODO : forme du msg en commentaire
//       // console.log('background.js - Message received : ', msg)
//       if (msg.mainIsOpen) {
//         mainViewIsOpen = true;
//         console.log("Main is OPEN !")
//         infiniteSendingTimecode = setInterval(() => {
//           port.postMessage({
//             currentFirstTimecode: currentFirstTimecode,
//             currentLastTimecode: currentLastTimecode
//           })
//           // console.log("Timecodes sent to main popup");
//         }, 100);
//       } else {
//         mainViewIsOpen = false;
//       }
//     })
//     // console.log("background.js - The port " + port.name + " is connected from this tab : " + port.sender.origin);
//     port.onDisconnect.addListener(function() {
//       clearInterval(infiniteSendingTimecode);
//       mainViewIsOpen = false;
//       // console.log("background.js - The port " + port.name + " has been disconnected from this tab : " + port.sender.origin);
//     });
//   }
// })


// console.log("background.js - Création d'un onConnect.addListener.")
// chrome.runtime.onConnect.addListener(function (port) {
//   if (port.name === 'send_timecode_to_main') {
//     console.log("background.js - The port " + port.name + " is connected from this tab : " + port.sender.origin);
//     port.onMessage.addListener(function (msg) {
//       console.log('background.js - Msg received : ', msg, ' from this tab : ', port.sender.origin);
//     })
//     port.onDisconnect.addListener(function () {
//       // console.log("background.js - The port " + port.name + " has been disconnected from this tab : " + port.sender.origin);
//     })
//   }
// })

// RECEVOIR ET RENVOYER LE TIMECODE DE FOREGROUND
// console.log("background.js - Création d'un onConnect.addListener.")
// chrome.runtime.onConnect.addListener(function (port) {
//   if (port.name === 'timecode') {
//     // console.log("background.js - The port " + port.name + " is connected from this tab : " + port.sender.origin);
//     port.onMessage.addListener(function (msg) {
//       console.log('background.js - Msg received : ', msg, ' from this tab : ', port.sender.origin);
//       if (mainViewIsOpen) {

//       }
//       // TODO : forme du msg en commentaire
//       // console.log('background.js - Message received : ', msg)
//       // currentFirstTimecode = msg.startingTime;
//       // currentLastTimecode = msg.endingTime;
//       // port.postMessage({
//       //   currentFirstTimecode: currentFirstTimecode,
//       //   currentLastTimecode: currentLastTimecode
//       // })
//     })
//     port.onDisconnect.addListener(function () {
//       // console.log("background.js - The port " + port.name + " has been disconnected from this tab : " + port.sender.origin);
//     })
//   }
// })

var playerButtonsPort = null
// RECEVOIR L'ÉTAT DES BOUTONS DU PLAYER DE FOREGROUND
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'player_buttons') {
    playerButtonsPort = port
    // console.log("background.js - The port " + port.name + " is connected from this tab : " + port.sender.origin);
    port.onMessage.addListener(function (msg) {
      // TODO : forme du msg en commentaire
      // console.log('background.js - Message received : ', msg)
    })
    port.onDisconnect.addListener(function () {
      // console.log("background.js - The port " + port.name + " has been disconnected from this tab : " + port.sender.origin);
    })
  }
})

// ENVOYER LES ORDRES DE CLIQUE POUR LE PLAYER A FOREGROUND
// setInterval(() => {
//   playerButtonsPort.postMessage({ order: "click_pause"})
// }, 10000);

// RECEVOIR LES INFORMATIONS DU PODCAST DE FOREGROUND
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'podcast_informations') {
    // console.log("background.js - The port " + port.name + " is connected from this tab : " + port.sender.origin);
    port.onMessage.addListener(function (msg) {
      // TODO : forme du msg en commentaire
      // console.log('background.js - Message received : ', msg)
    })
    port.onDisconnect.addListener(function () {
      // console.log("background.js - The port " + port.name + " has been disconnected from this tab : " + port.sender.origin);
    })
  }
})

// Liste tous les onglets
// var tabs = await chrome.tabs.query({});
// tabs.forEach(function (tab) {
//   console.log("tab : ", tab)
// });

// chrome.tabs.query({}, function (tabs) {
//   console.log("background.js - Current tabs : ", tabs);
//   var tabId = ""
//   tabs.forEach(function (tab) {
//     // console.log("tab : ", tab)
//     if (tab.url.includes("podcasts.google.com")) {
//       console.log(tab.url);
//       tabId = tab.id;
//       return;
//     }
//   });

//   var port = chrome.tabs.connect(tabId, { name: 'timecode' });
//   console.log("background.js - port created with a specific tabid : ", port.name);

//   console.log("background.js - Wait 5s before sending msg");
//   setTimeout(() => {
//     port.postMessage({ currentTimecode: '00:00 / 00:00' })
//     console.log("background.js - Message sent : { currentTimecode: '00:00 / 00:00' }");
//   }, 5000)

//   console.log("background.js - creation of port.onMessage.addListener");
//   port.onMessage.addListener(function (msg) {
//     console.log("background.js - Message received : ", msg)

//     // if (msg.question === "Who's there?") port.postMessage({ answer: 'Madame' })
//     // else if (msg.question === 'Madame who?')
//     //   port.postMessage({ answer: 'Madame... Bovary' })
//   })
// })
