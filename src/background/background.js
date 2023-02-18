// *************************************************************
// *************************************************************
console.log('------------ BACKGROUND.JS IS LOADED ------------')
// *************************************************************
// *************************************************************

import { db } from '../popup_views/firebase_config'
import { doc, onSnapshot, collection, getDocs } from 'firebase/firestore'

let podcastInfos = {}
let foregfroundIsInjected = false;
let episodeTitleHistory = [''];
let commentsPort = null;
let mainPopupIsOpen = false;


// injecté le script foreground.js dans la page web quand l'extension est installé
chrome.runtime.onInstalled.addListener( () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url.includes('podcasts.google.com') && foregfroundIsInjected === false) {
        chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          files: ['./foreground.js']
        })
        .then(() => {
          foregfroundIsInjected = true;
          console.log('background.js - foreground.js injected on installed in : ', tab.url)
        })
        .catch(err => console.log(err))
      }
    })
  })
});

// Ré-injecter le script quand la page est actualisé
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if ( changeInfo.status === 'complete' && tab.url.includes('podcasts.google.com') && foregfroundIsInjected === false ) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ['./foreground.js']
      })
      .then(() => {
        foregfroundIsInjected = true;
        console.log('background.js - Web page reloaded -> foreground.js injected in : ', tab.url)
      })
      .catch(err => console.log(err))
  }
})

/*
TODO : Un fonction qui détecte s'il y a plusieurs onglets ouverts avec 
le site podcasts.google.com pour envoyer un message à la popup et 
qu'elle demande à l'utilisateur de fermer les autres onglets pour 
une meilleure expérience utilisateur (éviter les conflits de données).
*/

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'is_foreground_active') {
    // console.log("background.js - Le port " + port.name + " a été détecté donc le foreground.js est actif.");

    let podcastInfosPort = chrome.tabs.connect(port.sender.tab.id, {name: "podcast_infos_channel"});
    // console.log("background.js - Le port " + podcastInfosPort.name + " a été créé pour recevoir les informations du player envoyées par foreground.js.");

    // On reçoit les informations du player ici et on les stocke dans la variable podcastInfos
    podcastInfosPort.onMessage.addListener(function(msg) {
      // ici ça boucle autant de fois qu'on reçoit des messages donc toutes les loopSpeed ms du fichier foreground.js
      podcastInfos = {
        startingTime: msg.startingTime,
        endingTime: msg.endingTime,
        lecture: msg.lecture,
        episodeTitle: msg.episodeTitle,
        podcastRssUrl: msg.podcastRssUrl
      }
    });

    // Loop qui va remplir la variable historyEpisodeTitle avec les titres des épisodes et qui va permettre de détecter les changements d'épisodes pour agir en conséquence
    let firstOnSnapshotLauched = false;
    let currentComments = [];

    let currentOnSnapshot = null;
    let nextOnSnapshot = null;

    let firstOnSnapshotId = setInterval(() => {
      if (podcastInfos.episodeTitle !== '') {
        if (commentsPort !== null && mainPopupIsOpen === true) {
          // lancer le 1r onSnapshot pour l'épisode actuel ici

          currentOnSnapshot = onSnapshot(collection(db, podcastInfos.episodeTitle), (snapshot) => {
            currentComments = [];
            snapshot.forEach((doc) => {
              currentComments.push(doc.data());
            });
            console.log("Fetched comments of " + podcastInfos.episodeTitle + " : ", currentComments);
            // TODOD : envoyer une fois les commentaires récupérés à la popup
            console.log("background.js - A - On envoie les commentaires à la popup");
            commentsPort.postMessage({comments: currentComments, episodeTitle: podcastInfos.episodeTitle});
          });
          firstOnSnapshotLauched = true;
        }
      }
      
      if (firstOnSnapshotLauched) {
        clearInterval(firstOnSnapshotId);
      }
    }, 1000);

    let keepEpisodeTitleHistoryUpToDate = setInterval(() => {
      // keeping the last 10 episode titles
      if (episodeTitleHistory.length > 10) {
        episodeTitleHistory.pop();
      }

      if (podcastInfos.episodeTitle !== "" && episodeTitleHistory[0] !== '') {
        if (episodeTitleHistory[0] !== podcastInfos.episodeTitle) {
          // console.log("Un changement d'épisode a été détecté !");
          
          episodeTitleHistory.unshift(podcastInfos.episodeTitle);
          console.log("L'épisode précédent était : ", episodeTitleHistory[1], " et l'épisode qui l'a remplacé est : ", episodeTitleHistory[0]);
          
          // console.log("background.js - On stop le premier onSnapshot pour l'épisode précédent : ", episodeTitleHistory[1])
          if (currentOnSnapshot !== null) {
            currentOnSnapshot();
            currentOnSnapshot = null;
          }
          
          // console.log("background.js - On en lance un nouveau pour l'épisode actuelle : ", episodeTitleHistory[0])
          currentOnSnapshot = onSnapshot(collection(db, episodeTitleHistory[0]), (snapshot) => {
            currentComments = [];
            snapshot.forEach((doc) => {
              currentComments.push(doc.data());
            });
            console.log("Fetched comments of " + episodeTitleHistory[0] + " : ", currentComments);
            // TODO : On envoie les commentaires mis à jour à la popup
            if (commentsPort !== null && mainPopupIsOpen === true) {
              console.log("background.js - B - On envoie les commentaires à la popup");
              commentsPort.postMessage({comments: currentComments, episodeTitle: episodeTitleHistory[0]});
            }
          });
          
          podcastInfos.episodeTitle = episodeTitleHistory[0];
        }
      } else if (episodeTitleHistory[0] !== undefined) {
        podcastInfos.episodeTitle = episodeTitleHistory[0];
      }
    }, 1000);


    port.onDisconnect.addListener(function () {
      console.log("background.js - Le port " + port.name + " a été déconnecté donc le foreground.js n'est plus actif.");
    })
  }
})

// DÉTECTER L'ÉTAT DU MAIN ET CREEER UN PORT POUR ENVOYER LES COMMENTAIRES
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "main_connection_for_background") {
    console.log("background.js - Le port " + port.name + " a été détecté donc le main.js est actif.");
    mainPopupIsOpen = true;

    console.log("background.js - Le port comments_from_background a été créé.")
    commentsPort = chrome.runtime.connect({ name: 'comments_from_background' });
    
    // Envoie des commentaires à la popup
    // commentsPort.postMessage({ comments: 'des commentaires' });
    
    port.onDisconnect.addListener(function() {
      console.log("background.js - Le port " + port.name + " a été déconnecté donc le main.js n'est plus actif.");
      mainPopupIsOpen = false;
    });
  }
})



function fetchComments(episodeTitle) {
  // How to use :
  // fetchComments(podcastInfos.episodeTitle).then((commentsList) => {
  //   console.log("background.js - Comments list received from firestore : ", commentsList);
  // })
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






// TODO : Créer un port ici qui va récupérer les informations du foreground
// TODO : Créer un port ici qui va envoyer les informations à la popup qu'on fetch pas
// TODO : Créer un port ici qui va envoyer les informations à la popup qu'on fetch (pour les commentaires)
// TODO : Gérer le buffer des épisodes



// TODO : fonction qui récupére tous les commentaires d'un épisode que je pourrais réutiliser à plusieurs moments différents
// watch listener sur la collection de l'épisode, un changement d'épisode,











// SUITE
// Maintenant que j'ai réussi à récupérer la liste des commentaires dès qu'il y a un changement chez firestore
// Il faut que j'envoie la liste des commentaires à la popup
// Il faut que je mette en place l'affichage des commentaires dans la popup en mode vraiment clean
// Étape 1 : mettre en place l'envoie de commentaire de background à popup
// Étape 2 : bien récupérer la liste des commentaires dans popup
// Voir comment afficher intelligemment les commentaires dans popup
// Je verrais bien un array dans l'ordre chronologique des commentaires (timcode)
// le plus recent en bas, le plus ancien en haut






/*
SUITE 2
Il faut trouver comment stopper un onSnapshot et surtout comment bien l'utiliser pour pouvoir bien gérer le changement d'épisodes
*/