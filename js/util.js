var faviconEndpoint = "http://g.etfv.co/";

var keyEnter = 13;

var storageDefaults = {
    "type": "manual"
};

var l = function(x) { console.log (x) };

var changeFaviconQuick = function(tabId) {
    changeFavicon("http://www.google.com", "Totally Actually Google", tabId);
}

var getFavicon = function(url) {
    if (url !== "blank") {
        return faviconEndpoint + url;
    } else {
        return chrome.extension.getURL("images/chrome-favicon.png");
    }
}

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
