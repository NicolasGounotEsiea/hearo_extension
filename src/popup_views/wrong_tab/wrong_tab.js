// *************************************************************
// *************************************************************
console.log("------------ WRONG_TAB.JS IS LOADED ------------");
// *************************************************************
// *************************************************************
// document.oncontextmenu = function() {
//   return false;
// }
document.querySelector('#open-google-podcast').addEventListener('click', function() {
  chrome.tabs.create({url: "https://podcasts.google.com/"});
});

// //location.reload();
// chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
//   let url = tabs[0].url;
//   console.log(url);
//   if(url.search("podcasts.google") != -1)
//   {
//     window.location.replace('./main.html');
//   }
//   // use `url` here inside the callback because it's asynchronous!
// }); 

// TODO : lancer wrong_tab.html si l'utilisateur n'a pas d'onglet google podcast
chrome.tabs.query({}, function (tabs) {
  console.log('wrond tab - tabs : ', tabs)
  let weHaveGooglePodcastTab = false
  tabs.forEach(tab => {
    if (tab.url.includes('podcasts.google.com')) {
      weHaveGooglePodcastTab = true
    }
  })

  if (!weHaveGooglePodcastTab) {
    console.log('We dont have google podcast tab')
  } else {
    window.location.replace('./main.html');
  }
})

  