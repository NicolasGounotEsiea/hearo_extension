console.log("------------ FOREGROUND.JS IS LOADED ------------");

var popupMainViewIsOpen = false;
var startingTime = "xx:xx";
var endingTime = "xx:xx";
var loopIsActive = false;

function nonstopSendingTimecode() {
  var loop = setInterval(() => {
    startingTime = document.getElementsByClassName("oG0wpe")[0].firstChild.textContent;
    endingTime = document.getElementsByClassName("oG0wpe")[0].lastChild.textContent;
    
    if (popupMainViewIsOpen) {
      console.log("Popup main view is open & current timecode = " + startingTime + " / " + endingTime);
      chrome.runtime.sendMessage({
        startingTime: startingTime,
        endingTime: endingTime
      });
    } else {
      clearInterval(loop);
      console.log("Popup main view is not open");
    }
  }, 1000);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  console.log(request);
  
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
    case 'PLUS TEN':
      console.log('PLUS TEN');
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