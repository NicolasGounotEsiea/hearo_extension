console.log('MAIN ready !')

// =========== IMPORTS =========
import { db, firebaseApp } from '../../firebase_config'
import {
  doc,
  getFirestore,
  onSnapshot,
  addDoc,
  collection,
  getDocs,
  deleteDoc
} from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
// ========== VARIABLES ========
var timecode = 0;
var userid;
let comment = '';
// let currentCommentsList;
const MAX_SIZE = 12;
let precedentCommentaire = new Array(MAX_SIZE);
let tetePreced = 0;
let messages;
let limite = 10 ;//limite de message du chat
let numMess = 0 ;//nombre de messages affichés depuis le début
// let messageElement = ''; //élément injecter pour afficher le commentaire
let preced = ''; //div du message precedent

let currentCommentsList = [];

let mainPort = chrome.runtime.connect({ name: 'main_status' });
var currentEpisode;

let ordersForBg = chrome.runtime.connect({
  name: 'orders_from_main'
})

let currentUser = null;

let previousEpisodeTitle = "";
let currentEpisodeTitle = "";

let foregroundTabId = null;

let commentObjectToSend = {
  podcast: '',
  TimeCode: '',
  UserName: '',
  UUID: '',
  Comment: '',
  Private: 0
}



let currentData = {
  userIsLoggedIn: false,
  podcastIsPlaying: false,
  timecode: {
    startingTime: '',
    endingTime: ''
  },
  episode: {
    title: '',
    rssUrl: ''
  }
}

let ordersForFg = null;
let currentOnSnapshot = null;
// document.oncontextmenu = function() {
//   return false;
// }
onAuthStateChanged(getAuth(firebaseApp), user => {
  if (user != null) {
    currentUser = user
    
  } else {
    currentUser = null

  }
})

// ============ CODE ===========
document.addEventListener('DOMContentLoaded', function () {


  checkUserLogin();

  chrome.storage.local.get(['foregroundTabId'], function (data) {
    console.log('foregroundTabId : ', data.foregroundTabId);
    if (data.foregroundTabId != null) {
      ordersForFg = chrome.tabs.connect(data.foregroundTabId, {name: 'orders_from_main'});

      document.querySelector('#minus_ten').addEventListener('click', () => {
        ordersForFg.postMessage({ order: 'click_minus_ten' });
      })

      document.querySelector('#play_pause').addEventListener('click', () => {
        switchPlayPauseButton();
        ordersForFg.postMessage({ order: 'click_play_pause' });
      })

      document.querySelector('#plus_thirty').addEventListener('click', () => {
        ordersForFg.postMessage({ order: 'click_plus_thirty' });
      })
    }
  })

  document.querySelector('#btn_user_profile').addEventListener('click', () => {
    window.location.replace('./settings.html');
  })

  document.querySelector('#publish_btn').addEventListener('click', () => {
    let textArea = document.getElementById('text_field');
    let userComment = escapeHtml(textArea.value);
    let toggleStatus = document.getElementById('togBtn').checked;

    if (userComment.length !== 0) {
      textArea.placeholder = ' votre commentaire';
      textArea.style.setProperty('color', 'black');
      textArea.style.setProperty('background-color', 'white');
      
      commentObjectToSend = {
        podcast: Removeslash(currentData.episode.title) ,
        TimeCode: currentData.timecode.startingTime,
        UserName: currentUser != null ? currentUser.displayName : '',
        UUID: currentUser != null ? currentUser.uid : '',
        Comment: userComment,
        Private:  toggleStatus ? 1:0
      }
      commentObjectToSend.Comment = cleanBadWords(commentObjectToSend.Comment);
      ajouterElement(commentObjectToSend)

      console.log('currentData.episode.title : ', currentData.episode.title);
      console.log('commentObjectToSend : ', commentObjectToSend);
      addDocFirestore(currentData.episode.title, commentObjectToSend)
       

      
      

      textArea.value = ''
    } else {
      updateStyleForEmptyComment(textArea);
    }
   
  })
})

mainPort.onMessage.addListener(function (msg) {
  currentData.userIsLoggedIn = msg.userIsLoggedIn;
  currentData.podcastIsPlaying = msg.podcastIsPlaying;
  currentData.timecode.startingTime = msg.startingTime;
  currentData.timecode.endingTime = msg.endingTime;
  currentData.episode.title = msg.title;
  currentData.episode.rssUrl = msg.rssUrl;
  currentEpisode = currentData.episode;

  updatePopupPlayer(msg.title, msg.startingTime, msg.endingTime);
  updateLecture(msg.isPlaying);
  updateOnSnapshot();

  
})

// ==================================
// ============ FONCTIONS ===========


// Récupération de la div qui contient les messages
var div = document.getElementById('messages');

// Fonction pour positionner la poignée de défilement en bas
function scrollToBottom() {
  div.scrollTop = div.scrollHeight;
}

// Configuration de l'observer
var observerConfig = { childList: true, subtree: true };

// Création de l'observer
var observer = new MutationObserver(function() {
  // Positionne la poignée de défilement en bas
  scrollToBottom();
});

// Démarrage de l'observer
observer.observe(div, observerConfig);

// Positionne la poignée de défilement en bas au chargement de la page
scrollToBottom();

function updateOnSnapshot() {
  if (previousEpisodeTitle === "" && currentEpisodeTitle != "") {
    console.log('first episode');
    
    resetOnSnapshot();

    currentOnSnapshot = onSnapshot(collection(db, Removeslash(currentData.episode.title)  ), (snapshot) => {
      currentCommentsList = [];
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          currentCommentsList.push(doc);
        })
      }
      console.log("-----------------------")
      console.log(currentCommentsList)
      console.log("-----------------------")
      getComments();
    })

    
    
  } else if (previousEpisodeTitle != currentEpisodeTitle && previousEpisodeTitle != "") {
    console.log('new episode');
    
    resetOnSnapshot();

    currentOnSnapshot = onSnapshot(collection(db, Removeslash(currentData.episode.title)), (snapshot) => {
      currentCommentsList = [];
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          currentCommentsList.push(doc);
        })

        
      }
      console.log("-----------------------")
      console.log(currentCommentsList)
      console.log("-----------------------")
      getComments();
    })
  }
  
  
}

function resetOnSnapshot() {
  if (currentOnSnapshot != null) {
    currentOnSnapshot();
    currentOnSnapshot = null;
  }
}
function checkUserLogin() {
  chrome.storage.sync.get(['userIsLogin'], function (data) {
    if (!data.userIsLogin) {
      window.location.replace('./login.html');
    }
  })
}


function response () {
  //surligne les réponses utilisateurs ("@...")
  let elements = document.querySelectorAll('p, span')
  for (let i = 0; i < elements.length; i++) {
    elements[i].innerHTML = elements[i].innerHTML.replace(
      /\S*@\S*/g,
      '<mark>$&</mark>'
    );
  }
}

//fonction pour récupérer les commentaires du serveur firestore
const fetchComments = async episodeTitle => {
  let comments = []
  const querySnapshot = await getDocs(collection(db, episodeTitle));
  querySnapshot.forEach(doc => {
    // console.log(doc.id, ' => ', doc.data());
    comments.push(doc.data());
  })
  return comments
}

function updateLecture (playingState) {
  let button = document.getElementById('play_pause');
  switch (playingState) {
    case 'Lecture':
      currentData.podcastIsPlaying = false
      button.setAttribute('class', 'play_pause myButton');
      break
    case 'Pause':
      currentData.podcastIsPlaying = true
      button.setAttribute('class', 'pause_play myButton');
      break
    default:
      break
  }
}

function updatePopupPlayer (episodeTitle, startingTime, endingTime) {
  let myEpisodeTitleElement = document.getElementsByClassName('episodeTitle')[0];
  let myTimecodeElement = document.getElementsByClassName('current_timecode')[0];
  myEpisodeTitleElement.innerHTML = episodeTitle;
  myTimecodeElement.innerHTML = startingTime + ' / ' + endingTime;

  previousEpisodeTitle = currentEpisodeTitle;
  currentEpisodeTitle = episodeTitle;
}

const updateStyleForEmptyComment = textArea => {
  textArea.placeholder = 'Entrez un commentaire valide';
  textArea.style.setProperty('color', 'white', 'important');
  textArea.style.setProperty('background-color', 'pink', 'important');
}

function cleanBadWords (comment ) {
  var badWords = ['badword'];
  var sentence = comment;
  for (let i = 0; i < badWords.length; i++) {
    var regex = new RegExp(badWords[i], 'gi');
    sentence = sentence.replace(regex, '***');
  }
  return sentence;
}

function Removeslash(title){
  var slashes = ["/"];
  var sentence = title;
  for (let i = 0; i < slashes.length; i++) {
    var regex = new RegExp(slashes[i], 'gi');
    sentence = sentence.toString().replace(regex, '[xyyyzzeret]');
  }
  return sentence;
}

function Restoreslash(title){
  var slashes = ['[xyyyzzeret]'];
  for (let i = 0; i < slashes.length; i++) {
    var regex = new RegExp(badWords[i], 'gi');
    sentence = sentence.replace(regex, '/');
  }
  return sentence;
}

const addDocFirestore = async (collectionName, data) => {
  if (collectionName !== '' && data !== null) {
    addDoc(collection(db, Removeslash(collectionName) ), data)
      .then(result => {
        console.log('Document written with ID: ', result.id);
        let iddoc = result.id;
        testAff (commentObjectToSend, iddoc)
        ajouterElement(commentObjectToSend)
      })
      .catch(err => {
        console.error('Error adding document: ', err);
      })
  }
}

function getPlayPauseOrder () {
  let button = document.getElementById('play_pause');
  let buttonClass = button.className;

  if (buttonClass === 'play_pause btn') {
    return 'play';
  } else {
    return 'pause';
  }
}

function switchPlayPauseButton () {
  let button = document.getElementById('play_pause');
  let buttonClass = button.className;
  if (buttonClass === 'play_pause btn') {
    button.className = 'pause_play btn';
  } else {
    button.className = 'play_pause btn';
  }
}

// fonction d'affichage des comentaires
function getComments(){


    
  
    let loopid = setInterval(() => {

      
      if(currentData.timecode.startingTime != currentData.timecode.endingTime && currentData.podcastIsPlaying){
        // setTimeout(1400);
      var preced;
      currentCommentsList.forEach(messages => {

      let mess = messages.data();
      if(mess.TimeCode == currentData.timecode.startingTime && !contientElement(mess)){

       ajouterElement(mess);

       

      const messageElement = document.createElement('div');
      messageElement.id = numMess;
      console.log(messages.id)

      var pri = 'Private';
    
      if (mess.UUID == currentUser.uid) {
        numMess++;
        console.log(mess.Private);
        if (mess.Private == 0) {
          pri = 'Public';
        }
        messageElement.innerHTML = `<div class="chat-message user-message" data-id="${messages.id}">
            <div class="chat-message-content">
            <button class="delete-message-button" data-id="${messages.id}">
    </button>
              <p class="chat-message-username"> <span class="pubpri">${pri}</span><span class="time">${mess.TimeCode}</span>${mess.UserName}</p>
              <p class="chat-message-text">${mess.Comment}</p>
              
          </div>
          
          `;
        const messagesContainer = document.querySelector('#messages');
        messagesContainer.appendChild(messageElement);
        preced = messagesContainer;
      } else if (mess.Private == 0) {
        numMess++;
        messageElement.innerHTML = ` <div class="chat-message">
            <div class="chat-message-content">
            
              <p class="chat-message-username">${mess.UserName}  <span class="time">${mess.TimeCode}</span> </p>
              <p class="chat-message-text">${mess.Comment}</p>
              
            </div>
            </div>
          </div>
           `;
        const messagesContainer = document.querySelector('#messages');
        messagesContainer.appendChild(messageElement);
        preced = messagesContainer;
      }
      
      
    }

    

      // messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });

      response();

      // if (numMess > limite) {
      //   //limiter le nombre de messages dans le chat
      //   const messagesToDelete = numMess - limite - 1;

      //   let myDiv = document.getElementById(messagesToDelete);
      //   // console.log(myDiv)
      //   myDiv.parentNode.removeChild(myDiv);
      // }
    })
  }else{
    console.log("fin d'épisode")
  }
    // if(currentData.timecode.startingTime == currentData.timecode.endingTime){
    //   console.log("fin d'épisode")
    //   // clearInterval(loopid)
    // }
    
    
  }, 1400);
  
}

function testAff (mess, iddoc) {
  //juste une fonction d'injection de commentaire qu'il faut que je renomme

  let messageElement = document.createElement('div');

  var pri = 'Private';
  if (mess.private == 0) {
    pri = 'Public';
  }
  messageElement.innerHTML = `<div class="chat-message user-message" data-id="${iddoc}">
  <div class="chat-message-content">
  <button class="delete-message-button" data-id="${iddoc}">
</button>
    <p class="chat-message-username"> <span class="pubpri">${pri}</span><span class="time">${mess.TimeCode}</span>${mess.UserName}</p>
    <p class="chat-message-text">${mess.Comment}</p>
    
</div>

`;
  numMess++;
  const messagesContainer = document.querySelector('#messages');
  messagesContainer.appendChild(messageElement);
  // preced = messagesContainer;

  // if (numMess > limite) {
  //   //limiter le nombre de messages dans le chat
  //   const messagesToDelete = numMess - limite - 1;

  //   let myDiv = document.getElementById(messagesToDelete);
  //   // console.log(myDiv)
  //   myDiv.parentNode.removeChild(myDiv);
  // }

  response();
}

// =========== IDEAS ===========
/*
TODO : créer une fonction qui prends un commentaire en paramètre et qui l'affiche
TODO : créer une fonction qui prends une liste de commentaire en paramètre et qui les affiche dans le bonne ordre
*/

//ATTENTION A APPELER CETTE FONCTION POUR CHAQUE ENTREEE D UTILISATEUR
function escapeHtml(input) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
}


function ajouterElement(element) {
  precedentCommentaire[tetePreced] = element;
  tetePreced = (tetePreced + 1) % MAX_SIZE;
}

function contientElement(mess) {
  for (let i = 0; i < MAX_SIZE; i++) {
    if (precedentCommentaire[i] === mess) {
      return true;
    }
  }
  return false;
}

// const messagesContainer = document.querySelector('#messages');
// messagesContainer.addEventListener('click', event => {
//   db.collection(currentData.episode.title).doc(data-id).delete().then(() => {
//     console.log("Document supprimé avec succès !");
//   }).catch((error) => {
//     console.error("Erreur lors de la suppression du document :", error);
//   });
// });
const messagesContainer = document.querySelector('#messages');
 messagesContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-message-button')) {
  const messageId = event.target.dataset.id;
  deleteDoc(doc(db, Removeslash(currentData.episode.title), messageId)).then(() => {

    const elementToRemove = document.querySelector(`[data-id="${messageId}"]`);
    elementToRemove.remove();

    console.log("Document supprimé avec succès !");
  }).catch((error) => {
    console.error("Erreur lors de la suppression du document :", error);
  });
}
})