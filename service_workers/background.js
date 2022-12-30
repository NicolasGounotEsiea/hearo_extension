console.log("---- background.js ----");

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "popup") {
    port.onDisconnect.addListener(function() {
      console.log("Popup has been closed");
      chrome.tabs.query({active: true, currentWindow: true},function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "popup_closed"}, function(response) {
            console.log(response);
        });
      });
    });
  }
});