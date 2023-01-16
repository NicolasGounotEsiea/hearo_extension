console.log("------------ FOREGROUND.JS IS LOADED ------------");

var popupMainViewIsOpen = false;
var startingTime = "xx:xx";
var endingTime = "xx:xx";

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
    // nonstopSendingTimecode();
  } else {
    popupMainViewIsOpen = request.mainViewIsOpen;
  }

  
  switch (request.playerAction) {
    case 'PLAY PAUSE':
      console.log('PLAY PAUSE');
      break;
    case 'PLUS TEN':
      console.log('PLUS TEN');
      break;
    case 'MINUS TEN':
      console.log('MINUS TEN');
      break;
    case '':
      console.log('RIEN');
      break;
    default:
      
  }




  if (request.playerAction !== "") {
    console.log("foreground.js - request.playerAction = " + request.playerAction);
    // cliquer sur 
  } else {
    console.log("foreground.js - request.playerAction = null");
  }

  console.log("popupMainViewIsOpen = ", popupMainViewIsOpen);
});



console.log("minus ten");
console.log("play pause");
console.log("plus ten");