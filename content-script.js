console.log("---- content-script.js ----");

// setInterval(looping, 2000);

// function looping(){
//   console.log("content.JSSSSS");
// }

// looping();

// document.getElementsByClassName("wv3SK")[0].textContent = "CONTENT !";
// console.log(document.getElementsByClassName("wv3SK")[0].textContent);

// const badge = document.createElement("h1");
// const heading = document.getElementsByClassName("wv3SK")[0];
// document.getElementsByClassName("wv3SK")[0].textContent

// console.log(document.getElementsByClassName("wv3SK")[0].textContent);

// const PLAY = 0;
// let PAUSEPLAY = document.querySelector("div[jsname='IGlMSc']").ariaLabel;
// const TITRE = document.querySelector("div[jsname='jLuDgc']").textContent;

// function getTitle(){
  
//   const sending = chrome.runtime.sendMessage({
//     greeting: TITRE,
//   });
//   sending.then(handleResponse, handleError);
  
// }

// function handleResponse(message) {
//   console.log(`Message from the background script: ${message.response}`);
// }

// function handleError(error) {
//   console.log(`Error: ${error}`);
// }

// function updateTC(){
//   let testvar = 0;
//   document.getElementsByClassName("oG0wpe")[0]
//    var currentTimecode = document.querySelector("span[jsname='QK5oLb']").textContent ;
//    //var labelPlay = document.querySelector("div[jsname='IGlMSc']").ariaLabel;
//   //  console.log(currentTimecode);
//   //  var testhehe = parseInt(currentTimecode) + 1;
  

//   chrome.runtime.sendMessage({
//     data : currentTimecode
//   }); 
//   //document.getElementsByClassName("U26fgb mUbCce fKz7Od M9Bg4d").click;
//   setTimeout(updateTC ,200);
// }

// function recLab(){
//   var labelPlay = document.querySelector("div[jsname='IGlMSc']").ariaLabel;

//   if(labelPlay != PAUSEPLAY){

//     PAUSEPLAY = labelPlay;

//     chrome.runtime.sendMessage({
//       play: PAUSEPLAY
//     });
    

//   }

//   setTimeout(recLab ,200);

// }

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//       if( request.message === "start" ) {
//         document.querySelector("div[jsname='IGlMSc']").click();
//       }
//       if( request.message == "-10"){
//         document.querySelector("div[jsname='HQzqRc']").click();
//       }
//       if( request.message == "+10"){
//         document.querySelector("div[jsname='xBcuNc']").click();
//       }
//   }
// );

// // 
// recLab();
// updateTC();
// getTitle();
