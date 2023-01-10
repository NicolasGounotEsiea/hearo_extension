console.log("------------ CONTENT.JS IS LOADED ------------");

// var popupMainViewIsOpen = false;


// setInterval(() => {
//   var startingTime = "00:00";
//   var endingTime = "00:00";

//   startingTime = document.getElementsByClassName("oG0wpe")[0].firstChild.textContent;
//   endingTime = document.getElementsByClassName("oG0wpe")[0].lastChild.textContent;

//   console.log("TIMECODE : " + startingTime + " / " + endingTime);

//   if (popupMainViewIsOpen) {
//     console.log("Popup main view is open");
//     chrome.runtime.sendMessage({
//       startingTime: startingTime,
//       endingTime: endingTime
//     });
//   } else {
//     console.log("Popup main view is not open");
//   }
// }, 1000);



// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
//   if (request.greeting == "main_is_open") {
//     console.log("Message main_is_open received");
//     popupMainViewIsOpen = true;
//   }
//   if (request.greeting == "main_is_close") {
//     console.log("Message main_is_close received");
//     popupMainViewIsOpen = false;
//   }
// });