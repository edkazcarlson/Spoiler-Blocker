window.addEventListener("load", init);
function init(){
    getCharacterList();
    document.getElementById("enterButton").addEventListener("click", onEntry)
}
function onEntry(){
    chrome.storage.sync.set({'apiKey': $("#apiKey")[0].value});
    chrome.storage.sync.set({'username': $("#username")[0].value});

}

function customConsole(input){
    document.getElementById("console").innerText = input;
}

async function getCharacterList(apiKey, username){
    let response = await fetch('http://api.jikan.moe/v3/user/' + username + '/animelist/watching');
    let jsonData = await response.json();
    let showIDs = []
    for (var show in jsonData.anime){
        showIDs.push(jsonData.anime[show].mal_id)
    }
    let charNames = []
    for (var show of showIDs){
        let showURL = 'https://api.jikan.moe/v3/anime/' + show + '/characters_staff';
        let charResponse = await fetch(showURL);
        let charJson = await charResponse.json();
        for (var char in charJson.characters){
            char = charJson.characters[char];
            if (char.role == 'Main'){
                charNames.push(char.name);
            }

        }
    };
    console.log(charNames)
}

