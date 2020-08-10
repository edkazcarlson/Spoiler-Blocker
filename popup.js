window.addEventListener("load", init);
function init(){
    updateLabels();
    document.getElementById("enterButton").addEventListener("click", setUserInfo);
}

async function updateLabels(){
    let username = (await getLocalStorageValue('username')).username;
    if (username === undefined){
        $('#lastUsername')[0].innerText = 'Enter username above';
    } else {
        $('#lastUsername')[0].innerText = 'Current Username: ' + username;
        $('#lastUpdated')[0].innerText = 'Last Updated: ' + (await getLocalStorageValue('lastUpdated')).lastUpdated
    }
}

function setUserInfo(){
    chrome.storage.local.set({username: $("#username")[0].value});
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); 
    let yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    chrome.storage.local.set({lastUpdated: today});
    updateLabels();
    refresh();
}

async function getLocalStorageValue(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, function (value) {
                resolve(value);
            })
        }
        catch (ex) {
            reject(ex);
        }
    });
}

async function refresh(){
    let username  = (await getLocalStorageValue('username')).username;
    getCharacterList(username);
}
async function getCharacterList(username){
    let response = await fetch('http://api.jikan.moe/v3/user/' + username + '/animelist/watching');
    let jsonData = await response.json();
    let showIDs = []
    for (var show in jsonData.anime){
        showIDs.push(jsonData.anime[show].mal_id)
    }
    let charNames = new Set()
    for (var show of showIDs){
        let showURL = 'https://api.jikan.moe/v3/anime/' + show + '/characters_staff';
        let charResponse = await fetch(showURL);
        let charJson = await charResponse.json();
        for (var char in charJson.characters){
            char = charJson.characters[char].name;
            char = char.replace(",", "");
            char = char.split(' ');
            for (var c in char){
                charNames.add(char[c].toLowerCase());
            }
        }
    };
    charNames.delete('death');
    chrome.storage.local.set({names: Array.from(charNames)});
}

