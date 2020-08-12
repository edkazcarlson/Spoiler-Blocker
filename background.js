chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: "landingPage.html"});
});