// *************************************************************
// *************************************************************
console.log('------------ SETTINGS-SCRIPT.JS IS LOADED ------------')
// *************************************************************
// *************************************************************

import { firebaseApp } from '../../firebase_config'
import { getAuth, onAuthStateChanged, deleteUser } from 'firebase/auth'

const auth = getAuth(firebaseApp) // Auth instance for the current firebaseApp
// document.oncontextmenu = function() {
//   return false;
// }

let currentUser = null

onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log('Logged in and current user is : ', user)
    currentUser = user
  } else {
    console.log('No user')
  }
})

document.querySelector('#sign_out').addEventListener('click', () => {
  auth.signOut()
  console.log('User sign out ! Lets go to login.html ...')
  window.location.replace('./login.html')
})

document.querySelector('#back').addEventListener('click', () => {
  console.log('Back to main.html ...')
  window.location.replace('./main.html')
})

document.querySelector('#delete').addEventListener('click', () => {
  console.log('DELETE ...')

  deleteUser(currentUser)
    .then(() => {
      console.log('User deleted ! Lets go to login.html ...')
      window.location.replace('./login.html')
    })
    .catch(error => {
      console.log('Error deleting user : ', error)
    })
})
