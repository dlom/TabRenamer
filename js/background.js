var storage = new Store("tabrenamer", storageDefaults);

var ready = false;

var initialize = function() {
    if (ready) {
        return;
    }
    ready = true;
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

storage.loadSync(initialize);

chrome.runtime.onStartup.addListener(function() {
    storage.loadSync(initialize);
});
