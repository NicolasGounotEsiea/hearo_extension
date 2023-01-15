# Hearo extension

## Setup to use the project
* git clone
* npm install
* npm install --save-dev webpack webpack-cli html-webpack-plugin clean-webpack-plugin copy-webpack-plugin
* npm install firebase --save
* npm run build

## How firebase auth works
* Add zip extension (within the manifest is empty of "key") to 
[Google Chrome Store Dev Console](https://chrome.google.com/webstore/devconsole)
* Go to package section and copy public key
* Add it to manifest within "key" balise
* Load dist folder in chrome://extension
* Check if the id is the same as the id of [Google Chrome Store Dev Console](https://chrome.google.com/webstore/devconsole)
* Go to [Google Chrome Dev Console API](https://console.developers.google.com/apis)
* Go to Credentials section and create one with OAuth ID
* Select Chrome App application type
* Copy your chrome extension ID from chrome://extension or [Google Chrome Store Dev Console](https://chrome.google.com/webstore/devconsole)
* Paste it in Application ID section of your new credential OAuth ID
* Create it
* Add this balise to your manifest :
```
"oauth2": {
  "client_id": "",
  "scopes":[
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
}
```
* Go to [Google Chrome Dev Console API](https://console.developers.google.com/apis) and copy your OAuth 2.0 Client IDs from your Credentials section
* Paste it in the "client_id" section of your "oauth2" balise in manifest.json
* Your manifest.json looks like :
```
// manifest.json
{
  // classic information
  "oauth2": {
    "client_id": "<--client_id-->",
    "scopes": [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile"
    ]
  },

  "key": "<--your_key-->"
}
```
* npm run build
* load dist in chrome://extensions