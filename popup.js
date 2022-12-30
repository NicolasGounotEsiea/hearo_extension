// pour détecter si la popup n'est plus ouverte
chrome.runtime.connect({ name: "popup" });

// lance sendTimeCode.js quand la popup est chargé
document.addEventListener("DOMContentLoaded", function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript(
      {
        target: {tabId: tabs[0].id},
        files: ['sendTimeCode.js'],
      },
      () => {}
    );
  });
});

// pour recevoir le timecode
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Popup.js : ", request, sender, sendResponse);
    console.log("Current timecode : " + request.startingTime + " / " + request.endingTime);
    document.getElementsByClassName("current_timecode")[0].innerHTML = request.startingTime + " / " + request.endingTime;
    sendResponse({farewell: "goodbye"});
  }
);
  
  
  
  // if (window.closed) {
    // const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    // const response = await chrome.tabs.sendMessage(tab.id, {greeting: "popup_closed"});
    // let myClosedElement = document.createElement("h1");
  // myClosedElement.textContent = "Popup is closed";
  // document.body.appendChild(myClosedElement);
  // (async () => {
  //   const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  //   const response = await chrome.runtime.sendMessage(tab.id, {greeting: "popup is closed"});
  //   // do something with response here, not outside the function
  //   console.log(response);
  // })();
// } else {
  // let myOpenedElement = document.createElement("h1");
  // myOpenedElement.textContent = "Popup is open";
  // document.body.appendChild(myOpenedElement);
// }

// let myElement = document.createElement("h1");
// myElement.textContent = "Hello, World!";
// document.body.appendChild(myElement);


// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   document.getElementsByClassName("fdqd").textContent = "HEYYYY";
//   if (request.type === "information") {
//     console.log(request.data);
//     document.querySelector('h1').innerHTML = "HEY";
//   }
// });


// let test;
// let btnplay;
// // chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
// //   //console.log(message.data);
// //   document.querySelector('h1').innerHTML = JSON.stringify(message.testtitre);
// //   sendResponse({
// //       data: "I am fine, thank you. How is life in the background?"
// //   }); 
// // });

// chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
//   str = JSON.stringify(message.data);
//   test = parseInt(str) ;
//   testTT = JSON.stringify(message.greeting);
//   testPlay = JSON.stringify(message.play);

//   if(testPlay == "\"Lecture\"")
//   {
//     document.getElementById("button1").src = "/assets/play.png";
//   }
//   if(testPlay == "\"Pause\"")
//   {
//     document.getElementById("button1").src = "/assets/pause.png";
//   }

//   var els = document.querySelector('h2');

//   if(str != null)
//   {
//     els.innerHTML = str  ;
//   }

//   if(testTT != null)
//   {
//     document.querySelector('h1').innerHTML = testTT;
//   }
  

//   });
// chrome.runtime.sendMessage({data:test},function(response){
	
// });



// function popup() {
//   chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
//       var activeTab = tabs[0];
//       chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
//       var pp = document.getElementById("button1");
//       // if (pp.src == "chrome-extension://aooggcgcaefkdbohaobhfdboaccifmml/assets/pause.png"){
//       //   document.getElementById("button1").src = "/assets/play.png"
//       // }
//       // else{
//       //   document.getElementById("button1").src = "/assets/pause.png"
//       // }
    
      
//   });
// }

// document.addEventListener("DOMContentLoaded", function() {
//   document.getElementById("button1").addEventListener("click", popup);
  

// });

// document.addEventListener("DOMContentLoaded", function() {
//   document.getElementById("button+").addEventListener("click", m_Sec);
  

// });

// document.addEventListener("DOMContentLoaded", function() {
//   document.getElementById("button-").addEventListener("click", add_Sec);
  

// });

// function m_Sec(){
//   chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
//     var activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, {"message": "-10"});

//   })
// }

// function add_Sec(){
//   chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
//     var activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, {"message": "+10"});

//   })
// }