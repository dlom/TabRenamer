var storage = new Store("tabrenamer", storageDefaults);

var initialize = function() {
    setPopup(storage.get("type") !== "quickChange");
    chrome.extension.onMessage.addListener(function(message, sender, callback) {
        switch (message.action) {
        case "rename":
            changeFavicon(message.url, message.title, sender.tab.id);
            break;
        case "quickRename":
            changeFaviconQuick(sender.tab.id);
            break;
        case "getQuickChangeOptions":
            callback({
                "key": parseInt(storage.get("shortcutKey"), 10),
                "enabled": (storage.get("type") === "quickChange")
            });
            break;
        }
    });
    chrome.browserAction.onClicked.addListener(function(tab) {
        changeFaviconQuick(tab.id);
    });
};

initialize();
