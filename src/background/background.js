// *************************************************************
// *************************************************************
console.log('------------ BACKGROUND.JS IS LOADED ------------')
// *************************************************************
// *************************************************************

import { db } from '../popup_views/firebase_config'
import { doc, onSnapshot, collection, getDocs } from 'firebase/firestore'

let rightTab = null

let podcastInfos = {}

// Ré-injecter le script quand la page est actualisé
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if ( changeInfo.status === 'complete' && tab.url.includes('podcasts.google.com') ) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ['./foreground.js']
      })
      .then(() => {
        console.log('background.js - Web page reloaded -> foreground.js injected in : ', tab.url)
      })
      .catch(err => console.log(err))
  }
})

// DÉTECTER L'ÉTAT DU FOREGROUND
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'is_foreground_active_chanel') {
    console.log("background.js - foreground.js est actif.");

    // Création d'un port pour recevoir les informations du player depuis foreground
    let podcastInfosPort = chrome.tabs.connect(port.sender.tab.id, {name: "podcast_infos_channel"});

    // On écoute les informations sur ce port
    podcastInfosPort.onMessage.addListener(function(msg) {
      // ici ça boucle autant de fois qu'on reçoit des messages donc toutes les loopSpeed ms du fichier foreground.js
      podcastInfos = {
        startingTime: msg.startingTime,
        endingTime: msg.endingTime,
        lecture: msg.lecture,
        episodeTitle: msg.episodeTitle,
        podcastRssUrl: msg.podcastRssUrl
      }
      // console.log("background.js - Podcast infos received from foreground.js : ", podcastInfos);
    });

  
    const colRef = collection(db, 'test');
    onSnapshot(colRef, (snapshot) => {
      let comments = [];
      snapshot.forEach((doc) => {
        comments.push(doc.data());
      });
      console.log("Current comments: ", comments);
    });

    // let firstEpisodeTitle = document.querySelector("div[jsname='jLuDgc']").textContent;
    // getDocs(collection(db, firstEpisodeTitle)).then((querySnapshot) => {
    //   let commentsList = [];
    //   querySnapshot.forEach((doc) => { // doc.data() is never undefined for query doc snapshots
    //     commentsList.push(doc.data());
    //   });
    //   chrome.storage.sync.set({ [firstEpisodeTitle]: commentsList }).then(() => {
    //     console.log("Commentaires de l'épisode [ ", firstEpisodeTitle, " ] récupérés et stockés dans le storage de l'extension : ", commentsList);
    //   });
    // });

    port.onDisconnect.addListener(function () {
      console.log("background.js - foreground.js n'est plus actif.");
    })
  }
})

// DÉTECTER L'ÉTAT DU MAIN
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "main_connection_for_background") {
    console.log("background.js - Main view est actif.");
    
    port.onDisconnect.addListener(function() {
      console.log("background.js - Main view n'est plus actif.");
    });
  }
})



function fetchComments(episodeTitle) {
  return new Promise((resolve, reject) => {
    getDocs(collection(db, episodeTitle)).then((querySnapshot) => {
      let commentsList = [];
      querySnapshot.forEach((doc) => { // doc.data() is never undefined for query doc snapshots
        commentsList.push(doc.data());
      });
      resolve(commentsList);
    });
  })
}
// How to use :
// fetchComments(podcastInfos.episodeTitle).then((commentsList) => {
//   console.log("background.js - Comments list received from firestore : ", commentsList);
// })






// TODO : Créer un port ici qui va récupérer les informations du foreground
// TODO : Créer un port ici qui va envoyer les informations à la popup qu'on fetch pas
// TODO : Créer un port ici qui va envoyer les informations à la popup qu'on fetch (pour les commentaires)
// TODO : Gérer le buffer des épisodes



// TODO : fonction qui récupére tous les commentaires d'un épisode que je pourrais réutiliser à plusieurs moments différents
// watch listener sur la collection de l'épisode, un changement d'épisode,