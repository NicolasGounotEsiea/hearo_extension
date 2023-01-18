// *************************************************************
// *************************************************************
console.log("------------ WRONG_TAB.JS IS LOADED ------------");
// *************************************************************
// *************************************************************

document.querySelector('#open-google-podcast').addEventListener('click', function() {
  chrome.tabs.create({url: "https://podcasts.google.com/"});
});

//location.reload();
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  let url = tabs[0].url;
  console.log(url);
  if(url.search("podcasts.google") != -1)
  {
    window.location.replace('./main.html');
  }
  // use `url` here inside the callback because it's asynchronous!
}); 

  