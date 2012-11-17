var faviconEndpoint = "http://g.etfv.co/";

var changeFavicon = function(url, title, tabId) {
    console.log(tabId);
    if (tabId == null) tabId = null; // Testing if null *or* undefined
    if (url !== "blank") {
        url = faviconEndpoint + url;
    }
    console.log(url);
    chrome.tabs.executeScript(tabId, {
        "file": "favicon.js/favicon.min.js"
    }, function() {
        chrome.tabs.executeScript(tabId, {
            "code": "favicon.change('" + url + "', '" + title + "');"
        });
    });
};

chrome.extension.onMessage.addListener(function(message, sender, callback) {
    switch (message.action) {
    case "rename":
        changeFavicon(message.url, message.title, sender.tab.id);
        break;
    case "quickRename":
        changeFavicon("http://en.wikipedia.org", "Totally Wikipedia", sender.tab.id)
    case "getQuickChangeOptions":
        callback({
            "key": 113,
            "enabled": true
        })
    }
});
