console.log("---- sendTimeCode.js ----");
var i = 0;

function looping(){
  var startingTime = document.getElementsByClassName("oG0wpe")[0].firstChild.textContent;
  var endingTime = document.getElementsByClassName("oG0wpe")[0].lastChild.textContent;
  
  console.debug("itération : " + i);
  console.debug(startingTime + " / " + endingTime);
  i++;

  chrome.runtime.sendMessage({startingTime: startingTime, endingTime: endingTime});
}

var refreshIntervalId = setInterval(looping, 500);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  console.log("sendTimeCode.js : request, sender, sendResponse : ");
  console.log(request, sender, sendResponse);
  if (request.greeting == "popup_closed") {
      console.log("TODO : Stopper le looping");
      clearInterval(refreshIntervalId);
  }
  sendResponse("Loop has been broken !");
});

var port = chrome.runtime.connect({name: "knockknock"});
port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(function(msg) {
  if (msg.question === "Who's there?")
    port.postMessage({answer: "Madame"});
  else if (msg.question === "Madame who?")
    port.postMessage({answer: "Madame... Bovary"});
});






// console.log("SEND MESSAGE TO background.js FROM sendTimeCode.js :");
// chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
//   console.log("response.farewell from sendTimeCode.js :");
//   console.log(response.farewell);
// });

// var information = document.getElementsByClassName("oG0wpe")[0].textContent;
// chrome.runtime.sendMessage({type: "information", data: information}, function(response) {
//   console.log(response.message);
// });



// navigator.serviceWorker.getRegistration().then(function(registration) {
  //   if (registration && registration.waiting) {
  //     console.log("Service worker is inactive");
  //   } else {
  //     console.log("Service worker is active");
  //   }
  // });