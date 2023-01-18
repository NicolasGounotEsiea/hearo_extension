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

function nonstopSendingTimecode() {
  var loop = setInterval(() => {
    if (loopIsActive) {
      startingTime = document.getElementsByClassName("oG0wpe")[0].firstChild.textContent;
      endingTime = document.getElementsByClassName("oG0wpe")[0].lastChild.textContent;
      currentEpisode.episodeTitle = document.querySelector("div[jsname='jLuDgc']").textContent;
      currentEpisode.podcastRssUrl = document.querySelector("div[jsname='NTHlvd']").textContent;
      
      if (document.querySelector("div[jsname='IGlMSc']").ariaLabel === "Lecture") {
        podcastIsPlaying = false;
      } else if (document.querySelector("div[jsname='IGlMSc']").ariaLabel === "Pause") {
        podcastIsPlaying = true;
      }

      if (popupMainViewIsOpen) {
        console.log("Main open - podcast playing ("+podcastIsPlaying+") - Timecode (" + startingTime + " / " + endingTime + ")");
        chrome.runtime.sendMessage({
          podcastIsPlaying: podcastIsPlaying,
          startingTime: startingTime,
          endingTime: endingTime,
          episodeTitle: currentEpisode.episodeTitle
        });
      } else {
        clearInterval(loop);
        console.log("Popup main view is not open");
      }
    } else {
      clearInterval(loop);
    }
  }, 1000);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if (request.mainViewIsOpen) {
    popupMainViewIsOpen = request.mainViewIsOpen;
    if (!loopIsActive) {
      nonstopSendingTimecode();
      loopIsActive = true;
    }
  } else {
    loopIsActive = false;
    popupMainViewIsOpen = request.mainViewIsOpen;
  }
  
  switch (request.playerAction) {
    case 'PLAY PAUSE':
      console.log('PLAY PAUSE');
      document.querySelector("div[jsname='IGlMSc']").click();
      break;
    case 'PLUS THIRTY':
      console.log('PLUS THIRTY');
      document.querySelector("div[jsname='xBcuNc']").click();
      break;
    case 'MINUS TEN':
      console.log('MINUS TEN');
      document.querySelector("div[jsname='HQzqRc']").click();
      break;
    case '':
      console.log('RIEN');
      break;
    default:   
  }
});