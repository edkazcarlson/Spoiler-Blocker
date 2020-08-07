let autoCompleteWatchingReady = false;
window.onkeyup = function(){
  autoCompleteWatchingReady = true;
}


MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    if (autoCompleteWatchingReady){
      $('.sbqs_c:contains("death")').each(function(idx, val){
        val.innerHTML = val.innerHTML.replace('death', 'fight');
        if (idx >= 14){
          return false;
        }
        autoCompleteWatchingReady = false;
      });       
    }
});

observer.observe(document, {
  subtree: true,
  attributes: true,
  childList: true,
  // characterData: true
});