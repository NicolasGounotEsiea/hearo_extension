console.log("popup main view!")

document.querySelector('#settings').addEventListener('click', () => {
  window.location.replace('./settings.html');
});

document.addEventListener("DOMContentLoaded", function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      files: ['./content_script.js']
    });
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    document.getElementsByClassName("current_timecode")[0].innerHTML = request.startingTime + " / " + request.endingTime;
  }
);



chrome.runtime.connect({ name: "popup" });