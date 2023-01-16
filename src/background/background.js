console.log("------------ BACKGROUND.JS IS LOADED ------------");

var mainViewIsOpen = false;
var userIsLoggedIn = true;


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["./foreground.js"]
    })
      .then(() => {
        console.log("INJECTED THE FOREGROUND SCRIPT.");
      })
      .catch(err => console.log(err));
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    userIsLoggedIn = request.userIsLoggedIn;
    // console.log("request.userIsLoggedIn : ", request.userIsLoggedIn);
  }
);

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "main") {
    mainViewIsOpen = true;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // chrome.tabs.sendMessage(tabs[0].id, {mainViewIsOpen: true});
      chrome.tabs.sendMessage(tabs[0].id, {
        playerAction: "",
        userIsLoggedIn: userIsLoggedIn,
        mainViewIsOpen: true
      });
    });
    
    port.onDisconnect.addListener(function() {
      mainViewIsOpen = false;
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          playerAction: "",
          userIsLoggedIn: userIsLoggedIn,
          mainViewIsOpen: false
        });
      });
    });
  }
});

