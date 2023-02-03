// *************************************************************
// *************************************************************
console.log("------------ FOREGROUND.JS IS LOADED ------------");
// *************************************************************
// *************************************************************

var popupMainViewIsOpen = false;
var startingTime = "xx:xx";
var endingTime = "xx:xx";
var loopIsActive = false;
var podcastIsPlaying = true;
var currentEpisode = {
  episodeTitle: "",
  podcastRssUrl: ""
};

// function nonstopSendingTimecode() {
//   var loop = setInterval(() => {
//     if (loopIsActive) {
//       startingTime = document.getElementsByClassName("oG0wpe")[0].firstChild.textContent;
//       endingTime = document.getElementsByClassName("oG0wpe")[0].lastChild.textContent;
//       currentEpisode.episodeTitle = document.querySelector("div[jsname='jLuDgc']").textContent;
//       currentEpisode.podcastRssUrl = document.querySelector("div[jsname='NTHlvd']").textContent;
      
//       if (document.querySelector("div[jsname='IGlMSc']").ariaLabel === "Lecture") {
//         podcastIsPlaying = false;
//       } else if (document.querySelector("div[jsname='IGlMSc']").ariaLabel === "Pause") {
//         podcastIsPlaying = true;
//       }

//       if (popupMainViewIsOpen) {
//         console.log("Main open - podcast playing ("+podcastIsPlaying+") - Timecode (" + startingTime + " / " + endingTime + ")");
//         chrome.runtime.sendMessage({
//           podcastIsPlaying: podcastIsPlaying,
//           startingTime: startingTime,
//           endingTime: endingTime,
//           episodeTitle: currentEpisode.episodeTitle
//         });
//       } else {
//         clearInterval(loop);
//         console.log("Popup main view is not open");
//       }
//     } else {
//       clearInterval(loop);
//     }
//   }, 1000);
// }

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
//   if (request.mainViewIsOpen) {
//     popupMainViewIsOpen = request.mainViewIsOpen;
//     if (!loopIsActive) {
//       nonstopSendingTimecode();
//       loopIsActive = true;
//     }
//   } else {
//     loopIsActive = false;
//     popupMainViewIsOpen = request.mainViewIsOpen;
//   }
  
//   switch (request.playerAction) {
//     case 'PLAY PAUSE':
//       console.log('PLAY PAUSE');
//       document.querySelector("div[jsname='IGlMSc']").click();
//       break;
//     case 'PLUS THIRTY':
//       console.log('PLUS THIRTY');
//       document.querySelector("div[jsname='xBcuNc']").click();
//       break;
//     case 'MINUS TEN':
//       console.log('MINUS TEN');
//       document.querySelector("div[jsname='HQzqRc']").click();
//       break;
//     case '':
//       console.log('RIEN');
//       break;
//     default:   
//   }
// });


// console.log('foreground.js - Création dun onConnect.addListener.');
// chrome.runtime.onConnect.addListener(function (port) {
//   // entre ici que si un msg est reçu, sinon on entre pas
//   console.log('foreground.js - Current port listening : ', port.name);
//   // console.assert(port.name === 'knockknock')
//   port.onMessage.addListener(function (msg) {
//     console.log('foreground.js - Message received : ', msg)

//     // if (msg.joke === 'Knock knock')
//     //   port.postMessage({ question: "Who's there?" })
//     // else if (msg.answer === 'Madame')
//     //   port.postMessage({ question: 'Madame who?' })
//     // else if (msg.answer === 'Madame... Bovary')
//     //   port.postMessage({ question: "I don't get it." })
//   })
//   port.onDisconnect.addListener(function() {
//     console.log(port.name + " has been disconnected");
//   });
// })


// var foregroundConnectionPort = chrome.runtime.connect({ name: 'foreground_connection' });
// console.log("foreground.js - port " + foregroundConnectionPort.name + "has been created.");

// var timecodePort = chrome.runtime.connect({ name: 'timecode' });
// console.log("foreground.js - port " + timecodePort.name + "has been created.");

// var playerButtonsPort = chrome.runtime.connect({ name: 'player_buttons' });
// console.log("foreground.js - port " + playerButtonsPort.name + "has been created.");

// var podcastInformationsPort = chrome.runtime.connect({ name: 'podcast_informations' });
// console.log("foreground.js - port " + podcastInformationsPort.name + "has been created.");




// var foregroundConnectionPort = null;
// var timecodePort = null;
// var playerButtonsPort = null;
// var podcastInformationsPort = null;

// function connectForegroundConnectionPort() {
//   foregroundConnectionPort = chrome.runtime.connect({ name: 'foreground_connection' });
//   console.log("foreground.js - port " + foregroundConnectionPort.name + "has been created.");
//   foregroundConnectionPort.onDisconnect.addListener(function() {
//     foregroundConnectionPort = null;
//     setTimeout(connectForegroundConnectionPort, 1000);
//   });
// }

// function connectTimecodePort() {
//   timecodePort = chrome.runtime.connect({ name: 'timecode' });
//   console.log("foreground.js - port " + timecodePort.name + "has been created.");
//   timecodePort.onDisconnect.addListener(function() {
//     timecodePort = null;
//     setTimeout(connectTimecodePort, 1000);
//   });
// }

// function connectPlayerButtonsPort() {
//   playerButtonsPort = chrome.runtime.connect({ name: 'player_buttons' });
//   console.log("foreground.js - port " + playerButtonsPort.name + "has been created.");
//   playerButtonsPort.onDisconnect.addListener(function() {
//     playerButtonsPort = null;
//     setTimeout(connectPlayerButtonsPort, 1000);
//   });
// }

// function connectPodcastInformationsPort() {
//   podcastInformationsPort = chrome.runtime.connect({ name: 'podcast_informations' });
//   console.log("foreground.js - port " + podcastInformationsPort.name + "has been created.");
//   podcastInformationsPort.onDisconnect.addListener(function() {
//     podcastInformationsPort = null;
//     setTimeout(connectPodcastInformationsPort, 1000);
//   });
// }

// connectForegroundConnectionPort();
// connectTimecodePort();
// connectPlayerButtonsPort();
// connectPodcastInformationsPort();


// var timecodePort = chrome.runtime.connect({ name: 'timecode' });
// console.log("foreground.js - port " + timecodePort.name + "has been created.");

// var infiniteLoopId = setInterval(() => {
//   timecodePort.postMessage({
//     startingTime: document.getElementsByClassName("oG0wpe")[0].firstChild.textContent,
//     endingTime: document.getElementsByClassName("oG0wpe")[0].lastChild.textContent
//   });
//   // podcastInformationsPort.postMessage({
//   //   episodeTitle: document.querySelector("div[jsname='jLuDgc']").textContent,
//   //   podcastRssUrl: document.querySelector("div[jsname='NTHlvd']").textContent
//   // })
//   // if (document.querySelector("div[jsname='IGlMSc']").ariaLabel === "Lecture") {
//   //   playerButtonsPort.postMessage({ lecture: true });
//   // } else if (document.querySelector("div[jsname='IGlMSc']").ariaLabel === "Pause") {
//   //   playerButtonsPort.postMessage({ lecture: false });
//   // }
//   console.log("INFOS SENT")
// }, 5000);


// console.log("foreground.js - creation of port.onMessage.addListener");
// playerButtonsPort.onMessage.addListener(function (msg) {
//   console.log("foreground.js - Message received : ", msg, " from ", playerButtonsPort.name);
// })


// setTimeout(() => {
//   port2.disconnect();
// }, 5000)



// var port3 = chrome.runtime.connect({ name: 'podcast_informations' })

// console.log("foreground.js - creation of port.onMessage.addListener");
// port.onMessage.addListener(function (msg) {
//   console.log("foreground.js - Message received : ", msg);
//   // if (msg.question === "Who's there?") port.postMessage({ answer: 'Madame' })
//   // else if (msg.question === 'Madame who?')
//   //   port.postMessage({ answer: 'Madame... Bovary' })
// })



var timecodePort = null;
var playerButtonsPort = null;
var podcastInformationsPort = null;

chrome.runtime.onConnect.addListener(function (port) {
  console.log('foreground.js - Current port listening : ', port.name);
  if (port.name === "timecode_port") {
    timecodePort = port;
    popupMainViewIsOpen = true;
    console.log('foreground.js - timecode_port detected.');
    port.onMessage.addListener(function (msg) {
      console.log('foreground.js - msg received : ', msg)
    })

    port.onDisconnect.addListener(function() {
      popupMainViewIsOpen = false;
      console.log(port.name + " has been disconnected");
    });
  }
  if (port.name === "player_buttons") {
    playerButtonsPort = port;
  }
  if (port.name === "podcast_informations") {
    podcastInformationsPort = port;
  }
})




var infiniteLoopId = setInterval(() => {
  if (popupMainViewIsOpen) {
    if (timecodePort !== null) {
      timecodePort.postMessage({
        startingTime: document.getElementsByClassName("oG0wpe")[0].firstChild.textContent,
        endingTime: document.getElementsByClassName("oG0wpe")[0].lastChild.textContent
      });
    }
    if (playerButtonsPort !== null) {
      if (document.querySelector("div[jsname='IGlMSc']").ariaLabel === "Lecture") {
        playerButtonsPort.postMessage({ lecture: true });
      } else if (document.querySelector("div[jsname='IGlMSc']").ariaLabel === "Pause") {
        playerButtonsPort.postMessage({ lecture: false });
      }
    }
    if (podcastInformationsPort !== null) {
      podcastInformationsPort.postMessage({
        episodeTitle: document.querySelector("div[jsname='jLuDgc']").textContent,
        podcastRssUrl: document.querySelector("div[jsname='NTHlvd']").textContent
      })
    }
  }
}, 500);



