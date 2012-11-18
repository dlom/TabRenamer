var faviconEndpoint = "http://g.etfv.co/";

var keyEnter = 13;

var storageDefaults = {
    "type": "manual"
};

var l = function(x) { console.log (x) };

var setPopup = function(enabled) {
    if (enabled) {
        chrome.browserAction.setPopup({
            popup: "html/popup.html"
        });
    } else {
        chrome.browserAction.setPopup({
            popup: ""
        });
    }
};

var changeFaviconQuick = function(tabId) {
    changeFavicon(storage.get("quickFavicon"), storage.get("quickTitle"), tabId);
};

var getFavicon = function(url) {
    if (url === "") {
        return "";
    } else if (url === "blank") {
        return chrome.extension.getURL("images/chrome-favicon.png");
    } else {
        if (!/(.*?):\/\//.test(url)) {
            url = "http://" + url;
        }
        return faviconEndpoint + url;
    }
};

var changeFavicon = function(url, title, tabId) {
    if (tabId == null) tabId = null; // Testing if null *or* undefined
    url = getFavicon(url);
    chrome.tabs.executeScript(tabId, {
        "file": "favicon.js/favicon.min.js"
    }, function() {
        chrome.tabs.executeScript(tabId, {
            "code": "favicon.change('" + url + "', '" + title + "');"
        });
    });
};
