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
  if (request.mainViewIsOpen) {
    popupMainViewIsOpen = request.mainViewIsOpen;
    nonstopSendingTimecode();
  } else {
    popupMainViewIsOpen = request.mainViewIsOpen;
  }
  console.log("popupMainViewIsOpen = ", popupMainViewIsOpen);
});

