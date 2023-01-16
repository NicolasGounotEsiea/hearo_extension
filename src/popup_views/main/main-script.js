console.log("------------ MAINS-CRIPT.JS IS LOADED ------------");

var timecode = 0;

import { firebaseApp } from '../firebase_config'
import {
    getAuth,
    onAuthStateChanged,
    signInWithCredential,
    GoogleAuthProvider,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth';

var userIsLoggedIn = false;

// Auth instance for the current firebaseApp
const auth = getAuth(firebaseApp);
setPersistence(auth, browserLocalPersistence);

onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log('Below User is logged in :')
    console.log(user)
    userIsLoggedIn = true;
  } else {
    console.log('No user logged in!');
    userIsLoggedIn = false;
    window.location.replace('./login.html');
  }
  chrome.runtime.sendMessage({ userIsLoggedIn: userIsLoggedIn });
});

const DB =  [
	{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:01",
        "UserName":"heh",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alle "

    },
    {
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:02",
        "UserName":"aas",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"allevvv"

    },
    {
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:03",
        "UserName":"fff",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alle alle alle"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:04",
        "UserName":"ert",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"zertyuisdfghjk alle"

    },
    {
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:05",
        "UserName":"nana",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alleallealleallealle ttttt"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:06",
        "UserName":"pop",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alle alleallealle alletyu"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:07",
        "UserName":"okok",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":""

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:08",
        "UserName":"sasa",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alle"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:09",
        "UserName":"sisi",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"popopopoop hdhd"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:10",
        "UserName":"yui",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"opdbdjjhghjq hehehe"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:11",
        "UserName":"rasra",
        "Private":"1",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"hahah peeàpeopeopeo"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:12",
        "UserName":"rasra",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"ratatatata gagagaga"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:13",
        "UserName":"rasra",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"sesesese fofofofof"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:14",
        "UserName":"rasra",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"pytroeoei dkdkdkd"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:15",
        "UserName":"dkdk",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"catavsygsy opopoo"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:16",
        "UserName":"dfg",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"nonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:17",
        "UserName":"sdsd",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"bararayta"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:18",
        "UserName":"sasa",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"chachachachac jdjdjdjdjd"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:19",
        "UserName":"aas",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"chuuuuutttt nonnnnnnnn aiiiiiie"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:20",
        "UserName":"sisi",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"problemes à venir"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:21",
        "UserName":"ert",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"ça marche????"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:22",
        "UserName":"op",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"incroyable ça c'est trop vrai"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:23",
        "UserName":"pop",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"booom boopm boom hahaha"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:24",
        "UserName":"uiop",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alle alleallealle alletyu"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:27",
        "UserName":"erth",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"zertyuisdfghjk alle"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:32",
        "UserName":"ert",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"allevvv"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:35",
        "UserName":"erth",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"booom boopm boom hahaha"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:39",
        "UserName":"hgo",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"catavsygsy opopoo"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:42",
        "UserName":"yui",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"hahah peeàpeopeopeo"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:42",
        "UserName":"yui",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"chachachachac jdjdjdjdjd"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:42",
        "UserName":"mom",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"incroyable ça c'est trop vrai"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:43",
        "UserName":"qurt",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"tarlatata boom boom"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:45",
        "UserName":"ert",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"stop caaaaaaaaaaaa"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:46",
        "UserName":"erth",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alle alleallealle alletyu"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:47",
        "UserName":"cuit",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alleallealleallealle ttttt"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:48",
        "UserName":"erth",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"zertyuisdfghjk alle"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:49",
        "UserName":"fff",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alle gthjikopjshghnj styuisopoiuy svbnsjkiuhg"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:51",
        "UserName":"dfg",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"chuuuuutttt nonnnnnnnn aiiiiiie"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:58",
        "UserName":"klop",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"artyaqudjhjk hzdnzi"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:01",
        "UserName":"trit",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"foutu popooppopee gbhebh hebnej"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:05",
        "UserName":"klop",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":" test test alle test test"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:06",
        "UserName":"klop",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"nonnnnnnnnnnnnnnnnnnnnnnnnnnnn siiiiiiiiiiiiiiiiiiiiiiiiii"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:07",
        "UserName":"klap",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alle "

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:08",
        "UserName":"fff",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alle alleallealle alletyu"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:10",
        "UserName":"dfg",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alle gthjikopjshghnj styuisopoiuy svbnsjkiuhg"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:12",
        "UserName":"uiop",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alle gthjikopjshghnj styuisopoiuy svbnsjkiuhg"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:12",
        "UserName":"trit",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"tarlatata boom boom"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:13",
        "UserName":"mom",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"allevvv"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:14",
        "UserName":"ert",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alle gthjikopjshghnj styuisopoiuy svbnsjkiuhg"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:15",
        "UserName":"fff",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alleallealleallealle ttttt"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:16",
        "UserName":"drf",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"popopopoop hdhd"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:17",
        "UserName":"trit",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"hahah peeàpeopeopeo"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:18",
        "UserName":"cuit",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"problemes à venir"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:19",
        "UserName":"cuit",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"nonnnnnnnnnnnnnnnnnnnnnnnnnnnn siiiiiiiiiiiiiiiiiiiiiiiiii"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:21",
        "UserName":"fouu",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"opdbdjjhghjq hehehe"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:23",
        "UserName":"a*",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"pytroeoei dkdkdkd"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:23",
        "UserName":"nana",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"stop caaaaaaaaaaaa"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:25",
        "UserName":"nana",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"artyaqudjhjk hzdnzi"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:26",
        "UserName":"nino",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"artyaqudjhjk hzdnzi"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:27",
        "UserName":"cuit",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"booom boopm boom hahaha"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:28",
        "UserName":"ert",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"tarlatata boom boom"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:29",
        "UserName":"gbop",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"chuuuuutttt nonnnnnnnn aiiiiiie"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:30",
        "UserName":"hgo",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"allevvv"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:33",
        "UserName":"pop",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alle gthjikopjshghnj styuisopoiuy svbnsjkiuhg"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:35",
        "UserName":"pmop",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"artyaqudjhjk hzdnzi"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:36",
        "UserName":"mom",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"catavsygsy opopoo"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:37",
        "UserName":"qurt",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alle gthjikopjshghnj styuisopoiuy svbnsjkiuhg"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:38",
        "UserName":"vblm",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"popopopoop hdhd"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:39",
        "UserName":"gbop",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"aieeeeeeeeeeeeeeeeeeeeeeeeeee zut"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:39",
        "UserName":"dfg",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"ratatatata gagagaga"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:40",
        "UserName":"fuio",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"ça marche????"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:42",
        "UserName":"klap",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"alle "

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"01:43",
        "UserName":"klop",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"stop caaaaaaaaaaaa"

    }
	
]

document.addEventListener("DOMContentLoaded", function() {

  if(timecode != 0){
    console.log(timecode)
  }

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

      updateTimeCode(request.startingTime, request.endingTime);
      timecode = request.startingTime
    }
  );

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log(tabs[0].id);
    // doing something
    while(podcastIsPlaying == true){
      console.log(timecode)
    }
    console.log(timecode)
  });

  
  document.querySelector('#btn_user_profile').addEventListener("click", () => {
    window.location.replace('./settings.html');
  });
  
  
});

function updateTimeCode(startingTime, endingTime) {
  var myElement = document.getElementsByClassName("current_timecode")[0];
  myElement.innerHTML = startingTime + " / " + endingTime;
}

chrome.runtime.connect({ name: "main" });