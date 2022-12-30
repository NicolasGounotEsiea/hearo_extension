console.log("---- background.js ----");

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "popup") {
    port.onDisconnect.addListener(function() {
      console.log("popup has been closed");
      chrome.tabs.query({active: true, currentWindow: true},function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "popup_closed"}, function(response) {
            console.log(response);
        });
      });
    });
  }
});

// chrome.extension.onConnect.addListener(function(port) {
//   if (port.name === "popup-connection") {
//     port.onDisconnect.addListener(function() {
//       // console.log("Popup is closed");
//       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         var tabId = tabs[0].id;
//         chrome.scripting.executeScript(
//           {
//             target: {tabId: tabId},
//             files: ['consoleLog.js'],
//           },
//           () => {}
//         );
//       });
//     });
//   }
// });

// function looping(){
//   console.log("background.JSSSSS");
// }

// setInterval(looping, 1000);

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   var tabId = tabs[0].id;
//   console.log(tabId);

//   chrome.scripting.executeScript(
//     {
//       target: {tabId: tabId},
//       files: ['sendTimeCode.js'],
//     },
//     () => {}
//   );
// });
// chrome.action.setPopup({popup : 'test.html'});

// chrome.action.onClicked.addListener(async(tab) => {
//   chrome.scripting.executeScript({
//       target: {tabId: tab.id},
//       files: ['sendTimeCode.js'],
//     },
//     (injectionResults) =>{}
//   );
// });


// chrome.action.setPopup({popup : 'popup.html'});

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   var tabId = tabs[0].id;
//   console.log(tabId);

//   chrome.scripting.executeScript(
//     {
//       target: {tabId: tabId},
//       files: ['sendTimeCode.js'],
//     },
//     () => {}
//   );
// });

// chrome.action.onClicked.addListener(async(tab) => {
//   // lancer ce code quand la popup est ouverte ⬇️
  
// });

// function looping(){
//   console.log("background.JSSSSS");
// }

// setInterval(looping, 2000);

// chrome.extension.onConnect.addListener(function(port) {
//   if (port.name === "popup-connection") {
//     port.onMessage.addListener(function(message) {
//       console.log(message.greeting);
//     });
//   }
// });



// setInterval(looping, 2000);

// function looping(){
//   console.log("background.JSSSSS");
// }

// const tabId = getTabId();
// chrome.scripting.executeScript(
//   {
//     target: {tabId: tabId},
//     files: ['content.js'],
//   },
//   () => {}
// );

// chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
//   if (changeInfo.status == 'complete' && tab.active) {
//     chrome.scripting.executeScript(
//       {
//         target: {tabId: tabId},
//         files: ['content.js'],
//       },
//       () => {}
//     );
//   }
// })



// console.log("LISTENNING MESSAGE OF sendTimeCode.js FROM background.js :");
// background.js
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log("request.greeting from background.js :");
//   console.log(request.greeting);
//   sendResponse({farewell: "goodbye"});
// });

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.type === "information") {
//     chrome.extension.sendMessage({type: "information", data: request.data});
//     sendResponse({message: "Information received"});
//   }
// });



// let testTC;

// chrome.action.onClicked.addListener(async(tab) => {
//   chrome.action.setPopup({popup : 'test.html'});
//   chrome.scripting.executeScript(
//     {
//       target: {tabId: tab.id},
//       files: ['content.js'],

    
//     },
//     (injectionResults) =>{

//     });});

  
  
//     const user = {
//       username: 'demo-user'
//     };
    
//     chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//       // 2. A page requested user data, respond with a copy of `user`
       
//         let testTC = message.data;
//         let testTitre = message.greeting;
//         let playpause = message.play
 
//         chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
//           //alert(message.data);
//             chrome.runtime.sendMessage({data:testTC, greeting:testTitre, play:playpause},function(response){
//                 });
//                 });
//         sendResponse(user);
//         return Promise.resolve("Réponse pour éviter une erreur dans la console");
      
//     });