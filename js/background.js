var storageDefaults = {
    "type": "manual"
};

var storage = new Store("tabrenamer", storageDefaults);

var initialize = function() {
    var quickChangeEnabled = true;
    setPopup(!quickChangeEnabled);
    chrome.extension.onMessage.addListener(function(message, sender, callback) {
        switch (message.action) {
        case "rename":
            changeFavicon(message.url, message.title, sender.tab.id);
            break;
        case "quickRename":
            changeFavicon("blank", "Totally Wikipedia", sender.tab.id)
        case "getQuickChangeOptions":
            callback({
                "key": 113,
                "enabled": quickChangeEnabled
            })
        }
    });
    chrome.browserAction.onClicked.addListener(function(tab) {
        changeFaviconQuick(tab.id);
    });
};

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

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
        storage.saveSync();
    }
});

storage.loadSync(initialize);
