// *************************************************************
// *************************************************************
console.log('------------ MAINS-CRIPT.JS IS LOADED ------------')
// *************************************************************
// *************************************************************

var timecode = 0
var userid
import * as firebase from 'firebase/app'
import { firebaseApp, db } from '../firebase_config'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, getDocs } from 'firebase/firestore'

const {
  initializeApp,
  applicationDefault,
  cert
} = require('../firebase_config')
const { getFirestore, Timestamp, FieldValue } = require('../firebase_config')
import 'firebase/database'

//VARIABLES GLOBALES
let comment = ''
let mess = ''
let limite = 10 //limite de message du chat
let numMess = 0 //nombre de messages affichés depuis le début
let messageElement = '' //élément injecter pour afficher le commentaire
let preced = '' //div du message precedent
// var lauchGetAllComments = true;

let mainForBackgroundPort = chrome.runtime.connect({ name: 'main_connection_for_background' })

let commentToSend = {
  podcastEpisode: {},
  timecode: '',
  userName: '',
  userId: '',
  comment: '',
  private: false
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

let commentsBuffer;


var currentUser = null

let episodeTempo = ''

// waiting for the current episode title to be loaded to get the episodeTempo
let getCurrentEpisodeTitle = setInterval(() => {
  if (currentData.episode.title !== '') {
    episodeTempo = currentData.episode.title;
    clearInterval(getCurrentEpisodeTitle);
  }
}, 1000);



const auth = getAuth(firebaseApp) // Auth instance for the current firebaseApp

onAuthStateChanged(auth, user => {
  if (user != null) {
    currentUser = user
    currentData.userIsLoggedIn = true
    // console.log('Below User is logged in : ', user)
  } else {
    currentData.userIsLoggedIn = false
    window.location.replace('./login.html')
  }
})

// Waiting for the current episode title to be loaded to launch getAllComments one time
var launchGetAllCommentsOneTime = setInterval(() => {
  if (currentData.episode.title != '') {
    // console.log("currentData.episode.title = ", currentData.episode.title)
    // console.log("launch getAllComments one time")
    // getAllComments(currentData.episode.title);
    // console.log("update buffer of currentData.episode.title = ", currentData.episode.title)

    chrome.storage.sync.get(null, function(items) {
      commentsBuffer = Object.keys(items);
      updateBuffer(currentData.episode.title)
    });
    
    // console.log("Stop launchGetAllCommentsOneTime setInterval")
    clearInterval(launchGetAllCommentsOneTime);
  }
}, 1000);

// Dectect when the episode title change to update the comments buffer
// var detectNewEpisode = setInterval(() => {
//   if (episodeTempo !== '') {
//     if (episodeTempo !== currentData.episode.title && currentData.episode.title !== '') {
//       console.log("Un changement d'épisode a été détecté !");
//       console.log("L'épisode précédent était : ", episodeTempo, " et l'épisode qui l'a remplacé est : ", );
//       updateBuffer(currentData.episode.title) // quand on detecte un changement d'épisode, on met à jour le buffer
//       episodeTempo = currentData.episode.title;
//     }
//   }
// }, 1000);

// detect when main.html is completely load
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#btn_user_profile').addEventListener('click', () => {
    window.location.replace('./settings.html')
  })

})

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.podcastIsPlaying) {
//     podcastIsPlaying = true
//     update_PlayPause()
//   } else {
//     podcastIsPlaying = false
//     update_PlayPause()
//   }

//   const mySwitch = document.getElementById('private')
//   mySwitch.addEventListener('switch', function () {
//     if (mySwitch.value == 0) {
//       document.getElementById('private').value = '1'
//     } else {
//       document.getElementById('private').value = '0'
//     }
//     console.log(mySwitch.value)
//   })

//   startingTime = request.startingTime
//   endingTime = request.endingTime
//   episodeTitle = request.episodeTitle
//   updateTimeCode(startingTime, endingTime)
//   updtateEpisodeTitle(episodeTitle)

//   if (numMess > limite) {
//     //limiter le nombre de messages dans le chat
//     const messagesToDelete = numMess - limite - 1

//     let myDiv = document.getElementById(messagesToDelete)
//     console.log(myDiv)
//     myDiv.parentNode.removeChild(myDiv)
//   }
// })

document.querySelector('#publish_btn').addEventListener('click', () => {
  commentToSend = {
    podcastEpisode: currentData.episode,
    timecode: currentData.timecode.startingTime,
    userName: currentUser.displayName,
    userId: currentUser.uid,
    comment: document.getElementById('text_field').value,
    private: document.getElementById('togBtn').checked
  }

  if (commentToSend.comment.length === 0) {
    document.getElementById('text_field').placeholder = 'Entrez un commentaire valide'
    document.getElementById('text_field').style.setProperty('color', 'white', 'important')
    document.getElementById('text_field').style.setProperty('background-color', 'pink', 'important')
  } else {
    document.getElementById('text_field').placeholder = ' votre commentaire'
    document.getElementById('text_field').style.setProperty('color', 'black')
    document.getElementById('text_field').style.setProperty('background-color', 'white')
    
    var badWords = ['badword']
    var sentence = commentToSend.comment
    for (let i = 0; i < badWords.length; i++) {
      var regex = new RegExp(badWords[i], 'gi')
      sentence = sentence.replace(regex, '***')
    }
    // console.log('Phrase modifiée : ' + sentence)
    commentToSend.comment = sentence
    document.getElementById('text_field').value = ''
    // console.log('SUBMIT : ', commentToSend)

    document.getElementById('text_field').value = ''
    // console.log('SUBMIT : ', commentToSend)
    
    // Add a new document.
    const docRef = addDoc(collection(db, currentData.episode.title), commentToSend)
    .then((result) => {
      console.log('Document written with ID: ', result.id)  
    }).catch((err) => {
      console.error('Error adding document: ', e)  
    });

    // testAff(commentToSend)
    // document.getElementById('private').value = '0'
  }
})

// fonction d'affichage des comentaires
const getComments = async timecode => {
  const querySnapshot = await getDocs(collection(db, episodeTitle)) // récupération depuis firestore
  querySnapshot.forEach(doc => {
    if (doc.data().TimeCode == timecode) {
      var preced
      var mess = doc.data()

      const messageElement = document.createElement('div')
      messageElement.id = numMess

      var pri = 'Private'
      // console.log(mess.UUID)
      if (mess.UUID == userid) {
        numMess++
        if (mess.Private == 0) {
          pri = 'Public'
        }
        messageElement.innerHTML = `<div class="chat-message user-message">
            <div class="chat-message-content">
            
              <p class="chat-message-username"> <span class="pubpri">${pri}</span><span class="time">${mess.TimeCode}</span>${mess.UserName}</p>
              <p class="chat-message-text">${mess.Comment}</p>
              <div class="container-mod">
  <div class="item">
   
    <div class="options-container">
        <button class="options-button"><i class="fas fa-ellipsis-v"></i>...</button>
        <div class="options">
            <button class="edit">  <i class="fas fa-edit"></i> Modifier</button>
            <button class="delete">  <i class="fas fa-trash"></i> Supprimer</button>
        </div>
    </div>
  </div>
</div>
            </div>
          </div>
          
          `
        const messagesContainer = document.querySelector('#messages')
        messagesContainer.appendChild(messageElement)
        preced = messagesContainer
      } else if (mess.Private == 0) {
        numMess++
        messageElement.innerHTML = ` <div class="chat-message">
            <div class="chat-message-content">
            
              <p class="chat-message-username">${mess.UserName}  <span class="time">${mess.TimeCode}</span> </p>
              <p class="chat-message-text">${mess.Comment}</p>
              <div class="container-mod">
              <div class="item">
               
                <div class="options-container">
                    <button class="options-button"><i class="fas fa-ellipsis-v"></i>...</button>
                    <div class="options">
                        <button class="edit">  <i class="fas fa-edit"></i> Modifier</button>
                        <button class="delete">  <i class="fas fa-trash"></i> Supprimer</button>
                    </div>
                </div>
              </div>
            </div>
            </div>
          </div>
           `
        const messagesContainer = document.querySelector('#messages')
        messagesContainer.appendChild(messageElement)
        preced = messagesContainer
      }

      messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' })

      response()

      if (numMess > limite) {
        //limiter le nombre de messages dans le chat
        const messagesToDelete = numMess - limite - 1

        let myDiv = document.getElementById(messagesToDelete)
        // console.log(myDiv)
        myDiv.parentNode.removeChild(myDiv)
      }
    }
  })
}

function testAff (mess) {
  //juste une fonction d'injection de commentaire qu'il faut que je renomme

  messageElement = document.createElement('div')

  var pri = 'Private'
  if (mess.private == 0) {
    pri = 'Public'
  }
  messageElement.innerHTML = `<div class="chat-message user-message">
  
  <div class="chat-message-content">
  
    <p class="chat-message-username">  <span class="pubpri">${pri}</span><span class="time">${mess.timeCode}</span>${mess.userName}</p>
    <p class="chat-message-text">${mess.comment}</p>
    <div class="container-mod">
  <div class="item">
   
    <div class="options-container">
        <button class="options-button"><i class="fas fa-ellipsis-v"></i>...</button>
        <div class="options">
            <button class="edit">  <i class="fas fa-edit"></i> Modifier</button>
            <button class="delete">  <i class="fas fa-trash"></i> Supprimer</button>
        </div>
    </div>
  </div>
</div>
  </div>
  </div>
  `
  numMess++
  const messagesContainer = document.querySelector('#messages')
  messagesContainer.appendChild(messageElement)
  preced = messagesContainer

  if (numMess > limite) {
    //limiter le nombre de messages dans le chat
    const messagesToDelete = numMess - limite - 1

    let myDiv = document.getElementById(messagesToDelete)
    // console.log(myDiv)
    myDiv.parentNode.removeChild(myDiv)
  }

  response()
}

function response () {
  //surligne les réponses utilisateurs ("@...")
  let elements = document.querySelectorAll('p, span')
  for (let i = 0; i < elements.length; i++) {
    elements[i].innerHTML = elements[i].innerHTML.replace(
      /\S*@\S*/g,
      '<mark>$&</mark>'
    )
  }
}

//fonction pour récupérer les commentaires du serveur firestore
const fetchComments = async (episodeTitle) => {
  let comments = [];
  const querySnapshot = await getDocs(collection(db, episodeTitle));
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, ' => ', doc.data());
    comments.push(doc.data());
  });
  return comments;
}

//fonction pour récupérer les commentaires du serveur firestore
const fetchBuffer = async () => {
  let buffer = [];
  chrome.storage.sync.get(null, function(items) {
    buffer = items;
  });  
  return buffer;
}





chrome.tabs.query({}, function (tabs) {
  tabs.forEach(function (tab) {
    if (tab.url.includes('podcasts.google.com')) {
      let previousEpisode = ''
      var mainForForegroundPort = chrome.tabs.connect(tab.id, { name: 'main_connection_for_foreground' })
      var podcastInformationsPort = chrome.tabs.connect(tab.id, { name: 'podcast_informations' })
      var playerActionsPort = chrome.tabs.connect(tab.id, { name: 'player_actions' })

      podcastInformationsPort.onMessage.addListener(function (msg) {
        currentData.episode.title = msg.episodeTitle
        currentData.episode.rssUrl = msg.podcastRssUrl
        updtateEpisodeTitle(currentData.episode.title)
        
        // Detect episode change
        if (previousEpisode != msg.episodeTitle) {
          updateBuffer(currentData.episode.title)
        }
        previousEpisode = msg.episodeTitle

        updateLecture(msg.lecture)

        currentData.timecode.startingTime = msg.startingTime
        currentData.timecode.endingTime = msg.endingTime
        updateTimeCode(
          currentData.timecode.startingTime,
          currentData.timecode.endingTime
        )
      })

      document.querySelector('#minus_ten').addEventListener('click', () => {
        playerActionsPort.postMessage({ order: 'click_minus_ten' })
      })

      document.querySelector('#play_pause').addEventListener('click', () => {
        playerActionsPort.postMessage({ order: 'click_play_pause' })
      })

      document.querySelector('#plus_thirty').addEventListener('click', () => {
        playerActionsPort.postMessage({ order: 'click_plus_thirty' })
      })
    }
  })
})





function updateBuffer(episodeTitle) {
  let bufferSize
  let bufferLimit = 3;
  let episodeAleradyExist = false;
  let commentsBuffer = [];

  chrome.storage.sync.get(null, function(items) {
    commentsBuffer = Object.keys(items);
    bufferSize = commentsBuffer.length;
    
    if (bufferSize > 0) {
      for (var i = 0; i < bufferSize; i++) {
        if (commentsBuffer[i] == episodeTitle) {
          episodeAleradyExist = true;
        }
      }
    } else {
      episodeAleradyExist = false;
    }

    if (!episodeAleradyExist) {
      // console.log("FETCH DATA FROM FIRESTORE")
      fetchComments(episodeTitle).then((commentsList) => {
        commentsBuffer.unshift({ [episodeTitle]: commentsList })
        
        if (bufferSize >= bufferLimit) {
          commentsBuffer.pop(); 
        }

        chrome.storage.sync.set({ [episodeTitle]: commentsList }).then(() => {
          // console.log("Value is set to ", commentsList);
        });
        
      });
    }
    
  });

}





document.querySelector('#test').addEventListener('click', async () => {
  // console.log('TEST')
  
  // Add a new document.
  const docRef = addDoc(collection(db, "test"), {"test": "test"})
  .then((result) => {
    console.log('Document written with ID: ', result.id)
  }).catch((err) => {
    console.error('Error adding document: ', e)  
  });
  
  // chrome.storage.sync.get(null, function(items) {
  //   console.log(items)
  // });

})

document.querySelector('#test2').addEventListener('click', async () => {
  chrome.storage.sync.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    }
  })
  
  
  // chrome.storage.sync.get(null, function(items) {
  //   commentsBuffer = Object.keys(items);

  //   let episodeTitle = "Une longue inspiration";
  //   chrome.storage.sync.get(episodeTitle, function(item) {
  //     let comments = item[episodeTitle];
  //     comments.forEach((comment) => {
  //       let messageToShow = {
  //         podcastEpisode: {
  //           title: episodeTitle,
  //           url: ""
  //         },
  //         timecode: comment.data.timecode,
  //         userName: comment.data.userName,
  //         userId: comment.data.userId,
  //         comment: comment.data.comment,
  //         private: comment.data.private
  //       }

  //       // TODO : Afficher chaque commentaires dans la popup
  //     })
  //   });
  // });

})

document.querySelector('#btn_user_profile').addEventListener('click', () => {
  window.location.replace('./settings.html')
})

function updateLecture (playingState) {
  var button = document.getElementById('play_pause')
  switch (playingState) {
    case 'Lecture':
      currentData.podcastIsPlaying = false
      button.setAttribute('class', 'play_pause myButton')
      break
    case 'Pause':
      currentData.podcastIsPlaying = true
      button.setAttribute('class', 'pause_play myButton')
      break
    default:
      break
  }
}

function updtateEpisodeTitle (episodeTitle) {
  var myElement = document.getElementsByClassName('episodeTitle')[0]
  myElement.innerHTML = episodeTitle
}

function updateTimeCode (startingTime, endingTime) {
  var myElement = document.getElementsByClassName('current_timecode')[0]
  myElement.innerHTML = startingTime + ' / ' + endingTime
}