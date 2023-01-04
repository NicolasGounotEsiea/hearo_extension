console.log("---- content-script.js ----");

var startingTime = "00:00";
var endingTime = "00:00";

var refreshIntervalId = setInterval(() => {
  startingTime = document.getElementsByClassName("oG0wpe")[0].firstChild.textContent;
  endingTime = document.getElementsByClassName("oG0wpe")[0].lastChild.textContent;
  chrome.runtime.sendMessage({
    startingTime: startingTime,
    endingTime: endingTime
  });
  console.log("TIMECODE : " + startingTime + " / " + endingTime);
}, 1000);


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if (request.greeting == "popup_closed") {
    console.log("break loop");
    clearInterval(refreshIntervalId);
  } else {
    console.log("---- no ----");
  }
});

console.log("hey");
