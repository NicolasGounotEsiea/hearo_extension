// *************************************************************
// *************************************************************
console.log("------------ MAINS-CRIPT.JS IS LOADED ------------");
// *************************************************************
// *************************************************************

var timecode = 0;
var userid;
import { firebaseApp } from '../firebase_config'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

var userIsLoggedIn = false;
var podcastIsPlaying = false;
var startingTime = "";
var endingTime = "";
var lastComment = {
  uid: "",
  comment: "",
  startingTime: "",
  private: true,
  podcastName: ""
};
var episodeTitle = "";
var userID = "";
const auth = getAuth(firebaseApp); // Auth instance for the current firebaseApp

chrome.runtime.connect({ name: "main" });

onAuthStateChanged(auth, user => {
  if (user != null) {

    console.log('Below User is logged in :')
    console.log(user)
    userid =  user.uid
    userID = userid



    userIsLoggedIn = true;
    console.log('Below User is logged in : ', user);
  } else {
    userIsLoggedIn = false;
    console.log('No user logged in! then lets go to login.html page...');
    window.location.replace('./login.html');
  }

  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      playerAction: "TEST",
      userIsLoggedIn: userIsLoggedIn,
      mainViewIsOpen: true
    });
  });

});

const DB =  [
	{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:01",
        "UserName":"heh",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t1",
        "Comment":"alle cdcxvxvdf swdfsdfsdf qsdfqedf qdfqdfsq dfqdfq dqdfqd q sqdfsfs "

    },
    {
      "podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
      "TimeCode":"00:01",
          "UserName":"heh",
          "Private":"0",
          "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t1",
          "Comment":"alle cdcxvxvdf swdfsdfsdf qsdfqedf qdfqdfsq dfqdfq dqdfqd q sqdfsfs "
  
      },
      {
        "podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
        "TimeCode":"00:01",
            "UserName":"heh",
            "Private":"0",
            "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t1",
            "Comment":"alle cdcxvxvdf swdfsdfsdf qsdfqedf qdfqdfsq dfqdfq dqdfqd q sqdfsfs "
    
        },
        {
          "podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
          "TimeCode":"00:01",
              "UserName":"heh",
              "Private":"0",
              "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t1",
              "Comment":"alle cdcxvxvdf swdfsdfsdf qsdfqedf qdfqdfsq dfqdfq dqdfqd q sqdfsfs "
      
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
        "Private":"1",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t1",
        "Comment":"mon commentaire PERSOOOOO"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:06",
        "UserName":"pop",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t1",
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
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t22",
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
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t1",
        "Comment":"mon commentaire PERSOOOOO"

    },{
		"podcast":"Episode spécial Halloween 🎃​ : Les Dullahans ​de Loys Brueyre",
		"TimeCode":"00:12",
        "UserName":"rasra",
        "Private":"0",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t1",
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
        "Private":"1",
        "UUID":"hyhWpdw7k7cR4fWErxXjiHHLs5t2",
        "Comment":"nonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn"

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
        "Comment":"nonnnnnnnnnnnn siiiiiiiiiiiiiiiiiiiiiiiiii"

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

var limite = 10
var numMess = 0

});

document.addEventListener("DOMContentLoaded", function() {



  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      playerAction: "",
      userIsLoggedIn: userIsLoggedIn,
      mainViewIsOpen: true
    });
  });
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    document.querySelector('#minus_ten').addEventListener("click", () => {
      chrome.tabs.sendMessage(tabs[0].id, {
        playerAction: "MINUS TEN",
        userIsLoggedIn: userIsLoggedIn,
        mainViewIsOpen: true
      });
    });
  });

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    document.querySelector('#play_pause').addEventListener("click", () => {  
      chrome.tabs.sendMessage(tabs[0].id, {
        playerAction: "PLAY PAUSE",
        userIsLoggedIn: userIsLoggedIn,
        mainViewIsOpen: true
      });
    });
  });

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    document.querySelector('#plus_thirty').addEventListener("click", () => {
      chrome.tabs.sendMessage(tabs[0].id, {
        playerAction: "PLUS THIRTY",
        userIsLoggedIn: userIsLoggedIn,
        mainViewIsOpen: true
      });
    });
  });

  document.querySelector('#btn_user_profile').addEventListener("click", () => {
    window.location.replace('./settings.html');
  });

  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.podcastIsPlaying) {
        podcastIsPlaying = true;
      } else {
        podcastIsPlaying = false;
      }
      updateTimeCode(request.startingTime, request.endingTime);
      timecode = request.startingTime
      if(podcastIsPlaying == true){
        var preced
        
        var mess = testComment(timecode)
        // console.log(mess.TimeCode)
        const messageElement = document.createElement('div');
        messageElement.id = numMess
        
        

        
        var pri = "Private"
        console.log(mess.UUID)
        if(mess.UUID == userid){
          numMess++
          if(mess.Private == 0){
            pri = "Public"
          }
          messageElement.innerHTML = `<div class="chat-message user-message">
          <div class="chat-message-content">
            <p class="chat-message-username"> <span class="pubpri">${pri}</span><span class="time">${mess.TimeCode}</span>${mess.UserName}</p>
            <p class="chat-message-text">${mess.Comment}</p>
          </div>
        </div>
        
        `;
          const messagesContainer = document.querySelector('#messages');
          messagesContainer.appendChild(messageElement);
          preced = messagesContainer
        }
        else{
          numMess++
          messageElement.innerHTML = ` <div class="chat-message">
          <div class="chat-message-content">
            <p class="chat-message-username">${mess.UserName}  <span class="time">${mess.TimeCode}</span> </p>
            <p class="chat-message-text">${mess.Comment}</p>
          </div>
        </div>
         `;
          const messagesContainer = document.querySelector('#messages');
          messagesContainer.appendChild(messageElement);
          preced = messagesContainer
        }


        messageElement.scrollIntoView({behavior: "smooth", block: "end"});

        
//           var chatContainer = document.querySelector('.chat-container');
//           var isScrolledToBottom = chatContainer.scrollHeight - chatContainer.clientHeight <= chatContainer.scrollTop + 1;
//           chatContainer.appendChild(messageElement);
//           if(isScrolledToBottom) {
//           requestAnimationFrame(function(){
//             chatContainer.scrollTop = chatContainer.scrollHeight;
//             messageElement.scrollIntoView({behavior: "smooth", block: "end"});
//           });
// }

        

        

        
        // var chatContainer = document.querySelector('.chat-container');
        // var isScrolledToBottom = chatContainer.scrollHeight - chatContainer.clientHeight <= chatContainer.scrollTop + 1;
        // chatContainer.appendChild(message);
        // if(isScrolledToBottom) {
        //   requestAnimationFrame(function(){
        //   chatContainer.scrollTop = chatContainer.scrollHeight;
        //   messageElement.scrollIntoView({behavior: "smooth", block: "end"});
        //   });
        // }

        // var chatContainer = document.querySelector('.chat-container');
        // var isScrolledToBottom = chatContainer.scrollHeight - chatContainer.clientHeight <= chatContainer.scrollTop + 1;
        // chatContainer.appendChild(message);
        // if(isScrolledToBottom) {
        //   messagesContainer.scrollIntoView({behavior: "smooth", block: "end"});
        //    chatContainer.scrollTop = chatContainer.scrollHeight ;
           

           
        // }

        
        

        

        // Check if message limit is exceeded
        if (numMess > limite) {
          const messagesToDelete = numMess - limite -1;
          
            let myDiv = document.getElementById(messagesToDelete);
            console.log(myDiv)
            myDiv.parentNode.removeChild(myDiv);
            
          
        }


        

      }
    
    }
  );

  

});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.podcastIsPlaying) {
      podcastIsPlaying = true;
    } else {
      podcastIsPlaying = false;
    }
    startingTime = request.startingTime;
    endingTime = request.endingTime;
    episodeTitle = request.episodeTitle;
    updateTimeCode(startingTime, endingTime);
    updtateEpisodeTitle(episodeTitle);
  }
);

document.querySelector('#publishBtn').addEventListener("click", () => {
  lastComment.comment = document.getElementById("text_field").value;
  lastComment.startingTime = startingTime;
  lastComment.uid = userID;
  lastComment.episodeTitle = episodeTitle;
  document.getElementById("text_field").value = "";
  console.log("SUBMIT : ", lastComment);

});

function updateTimeCode(startingTime, endingTime) {
  var myElement = document.getElementsByClassName("current_timecode")[0];
  myElement.innerHTML = startingTime + " / " + endingTime;
}


function testComment(timecode){
  for(var com = 0; com < DB.length ; com ++){
    if(DB[com].TimeCode == timecode  /*DB[com].podcast == podcastname*/ ){
      return DB[com]
    }
  }
}
chrome.runtime.connect({ name: "main" });




function updtateEpisodeTitle(episodeTitle) {
  var myElement = document.getElementsByClassName("episodeTitle")[0];
  myElement.innerHTML = episodeTitle;
}

