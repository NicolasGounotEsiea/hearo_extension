// *************************************************************
// *************************************************************
console.log("------------ FOREGROUND.JS IS LOADED ------------");
import { async } from '@firebase/util';
// *************************************************************
// *************************************************************

import { firebaseApp, db } from '../popup_views/firebase_config'
import { collection, addDoc, getDocs } from 'firebase/firestore'

let popupMainViewIsOpen = false;
let timecodePort = null;
let podcastInformationsPort = null;

let playerLoopSpeed = 500;

let currentEpisodeTitle = "";

let isForegroundActivePort = chrome.runtime.connect({ name: 'is_foreground_active' })


if (document.readyState == "complete") {
  console.log("foreground.js - La page web a bien été chargée");
  
  if (document.querySelector("div[jsname='GnMNvf']") !== null) {
    console.log("foreground.js - Le player existe bien");

    // Lancer la boucle infini qui envoie les informations du player au background.js
    chrome.runtime.onConnect.addListener(function (port) {
      if (port.name === "podcast_infos_channel") {
        console.log("foreground.js - podcast_infos_channel detected.");
    
        // la boucle qui envoie constamment les informations du player au background.js
        let playerLoopId = setInterval(() => {
          currentEpisodeTitle = document.querySelector("div[jsname='jLuDgc']").textContent
          port.postMessage({
            startingTime: document.getElementsByClassName("oG0wpe")[0].firstChild.textContent,
            endingTime: document.getElementsByClassName("oG0wpe")[0].lastChild.textContent,
            lecture: document.querySelector("div[jsname='IGlMSc']").ariaLabel,
            episodeTitle: currentEpisodeTitle,
            podcastRssUrl: document.querySelector("div[jsname='NTHlvd']").textContent
          })
        }, playerLoopSpeed);
    
        port.onDisconnect.addListener(function() {
          console.log("foreground.js - ", port.name, " disconnected.");
        });
      }
    })

    // TODO : Lancer la boucle infini qui envoie les informations à la popup

    // TODO : Lancer la boucle infini qui écoute les ordres de la popup
  } else {
    // TODO : Dire à la popup d'afficher un message d'erreur pour dire que le player n'existe pas et qu'il faut lancer un épisode
    // chanel : foreground_orders_for_popup
  }
}


// Detecter si la popup est ouverte
// chrome.runtime.onConnect.addListener(function (port) {
//   console.log("foreground.js - Port reçu : ", port.name);
//   if (port.name === "main_connection_for_foreground") {
//     console.log("foreground.js - Main view est actif.");
    
//     port.onDisconnect.addListener(function() {
//       popupMainViewIsOpen = false;
//       console.log("foreground.js - Main view n'est plus actif.");
//     });
//   }
// })



// essayer de créer un port ici et d'envoyer les informations à la popup comme ça le port existe tant que la page web est ouverte
// Voir si on peut fermer un port depuis la popup comme ça si la page web est fermée, 
// on ferme bien le port pour que lorsqu'une nouvelle page web est ouverte, le port soit bien créé en évitant les doublons
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "podcast_informations") {
    podcastInformationsPort = port;
  }
})

// là aussi ça serait bien de créer le port depuis foregfround.js et pareil qu'au dessus, ne pas oublier de le fermer quand il faut
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "main_orders_for_foreground") {
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