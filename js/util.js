var faviconEndpoint = "http://g.etfv.co/";

var storage = chrome.storage.sync;

var changeFaviconQuick = function(tabId) {
    changeFavicon("http://www.google.com", "Totally Actually Google", tabId);
}

var changeFavicon = function(url, title, tabId) {
    if (tabId == null) tabId = null; // Testing if null *or* undefined
    if (url !== "blank") {
        url = faviconEndpoint + url;
    } else {
        url = "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/images/chrome-favicon.png";
    }
    chrome.tabs.executeScript(tabId, {
        "file": "favicon.js/favicon.min.js"
    }, function() {
        chrome.tabs.executeScript(tabId, {
            "code": "favicon.change('" + url + "', '" + title + "');"
        });
    });
};
