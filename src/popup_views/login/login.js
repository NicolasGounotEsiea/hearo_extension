console.log('LOGIN ready !')

import { firebaseApp } from '../../firebase_config'
import {
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth'

const auth = getAuth(firebaseApp) // Auth instance for the current firebaseApp
setPersistence(auth, browserLocalPersistence) // To keep user signin localy

document.querySelector('#signin_google').addEventListener('click', () => {
  console.log('Google button pressed')
  initFirebaseApp()
})

function initFirebaseApp () {
  console.log('Detect auth state...')
  onAuthStateChanged(auth, user => {
    if (user != null) {
      console.log('Logged in and current user is : ', user)
      chrome.storage.sync.set({ 'userIsLogin': true });
      window.location.replace('./main.html')
    } else {
      console.log('No user then start the sign-in process :')
      startSignIn()
    }
  })
}

function startSignIn () {
  console.log('Starts the sign-in process...')
  const user = auth.currentUser
  if (user) {
    console.log('current')
    console.log(user)
    auth.signOut()
  } else {
    console.log('proceed')
    chrome.storage.sync.set({ 'userIsLogin': false });
    startAuth(true)
  }
}

function startAuth (interactive) {
  console.log('Trying to start the auth process...')
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.')
      chrome.storage.sync.set({ 'userIsLogin': false });
    } else if (chrome.runtime.lastError) {
      console.error('chrome.runtime.lastError : ', chrome.runtime.lastError)
      chrome.storage.sync.set({ 'userIsLogin': false });
    } else if (token) {
      const credential = GoogleAuthProvider.credential(null, token)
      signInWithCredential(auth, credential)
        .then(result => {
          console.log('Success!!! -- result : ', result)
          chrome.storage.sync.set({ 'userIsLogin': true });
          window.location.replace('./main.html')
        })
        .catch(error => {
          chrome.storage.sync.set({ 'userIsLogin': false });
          console.log(error)
        })
    } else {
      console.error('The OAuth token was null')
      chrome.storage.sync.set({ 'userIsLogin': false });
    }
  })
}
