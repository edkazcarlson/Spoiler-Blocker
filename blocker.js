let importantCharSet = '';
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

window.onload = async function(){
	importantCharSet= await getLocalStorageValue('names');
	importantCharSet = new Set(importantCharSet.names);

	MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	var observer = new MutationObserver(function(mutations, observer) {
		let autoCompleteWatchingReady = null;
		let serachVal = $('input[name = "search_query"]')[0].value.split(' ');
		if (serachVal[serachVal.length - 1] != '' && 'death'.indexOf(serachVal[serachVal.length - 1]) == 0){
			autoCompleteWatchingReady = false
		} else {
			autoCompleteWatchingReady = true;
		}
		if (autoCompleteWatchingReady){
			for (var x in mutations){
				if (mutations[x].type == 'childList' && mutations[x].addedNodes.length == 2){
					let curMutation = mutations[x].target;
					if (curMutation.innerText.includes('death')){
						let deathLineSet = new Set(curMutation.innerText.toLowerCase().split(' '));
						let intersection = new Set([...deathLineSet].filter(x => importantCharSet.has(x)));
						if (intersection.size > 0){
							curMutation.innerHTML = curMutation.innerHTML.replace('death', 'fight');
						}
					}
				}
	
			}
		} 
	});
	observer.observe(document, {
		subtree: true,
		attributes: true,
		childList: true,
		characterData: true
	});
}