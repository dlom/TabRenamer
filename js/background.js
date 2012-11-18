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
            changeFaviconQuick(sender.tab.id)
            break;
        case "getQuickChangeOptions":
            callback({
                "key": 113,
                "enabled": quickChangeEnabled
            });
            break;
        }
    });
    chrome.browserAction.onClicked.addListener(function(tab) {
        changeFaviconQuick(tab.id);
    });
};

storage.loadSync(initialize);
