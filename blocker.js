async function getLocalStorageValue(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, function (value) {
                resolve(value);
            });
        }
        catch (ex) {
            reject(ex);
        }
    });
}

let importantCharSet = '';
window.onload = async function(){
	importantCharSet= await getLocalStorageValue('names');
	importantCharSet = new Set(importantCharSet.names);
}

let autoCompleteWatchingReady = false;
window.onkeyup = function(){
    autoCompleteWatchingReady = true;
}


MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
	// fired when a mutation occurs
	if (autoCompleteWatchingReady){
		$('.sbqs_c:contains("death")').each(function(idx, val){
			let deathLineSet = new Set(val.innerText.toLowerCase().split(' '));
			let intersection = new Set([...deathLineSet].filter(x => importantCharSet.has(x)));
			if (intersection.size > 0){
				val.innerHTML = val.innerHTML.replace('death', 'fight');
			}
			if (idx >= 14){
				return false;
			}
		});   
		autoCompleteWatchingReady = false;          
	}
});

observer.observe(document, {
    subtree: true,
    attributes: true,
    childList: true,
    // characterData: true
});