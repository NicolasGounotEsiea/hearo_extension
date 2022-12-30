console.log("---- content_script.js ----");

function looping(){
  var startingTime = document.getElementsByClassName("oG0wpe")[0].firstChild.textContent;
  var endingTime = document.getElementsByClassName("oG0wpe")[0].lastChild.textContent;
  chrome.runtime.sendMessage({
    startingTime: startingTime,
    endingTime: endingTime
  });
}

var refreshIntervalId = setInterval(looping, 1000);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if (request.greeting == "popup_closed") {
    clearInterval(refreshIntervalId);
  }
});