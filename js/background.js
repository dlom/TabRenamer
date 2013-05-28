var detectOldVersion = function() {
    return localStorage.getItem("store.settings.version") != null;
}

var convertOldSettings = function() {
    return {
        "faviconEndpoint": "http://g.etfv.co/",
        "type": JSON.parse(localStorage.getItem("store.settings.selectedType")),
        "keepFavicon": JSON.parse(localStorage.getItem("store.settings.keepFavicon")),
        "quickTitle": JSON.parse(localStorage.getItem("store.settings.quickTitle")),
        "quickFavicon": JSON.parse(localStorage.getItem("store.settings.quickFavicon")),
        "shortcutKey": JSON.parse(localStorage.getItem("store.settings.shortcutKey")),
        "preset": JSON.parse(localStorage.getItem("store.settings.presets")),
        "selectedPreset": JSON.parse(localStorage.getItem("store.settings.selectedPreset"))
    };
}

var storage = new Store("tabrenamer", storageDefaults);
if (detectOldVersion()) {
    oldSettings = convertOldSettings();
    localStorage.clear();
    storage.fromObject(oldSettings, false, true);
}

var initialize = function() {
    setPopupEnabled(storage.get("type") !== "quickChange");
    chrome.runtime.onMessage.addListener(function(message, sender, callback) {
        switch (message.action) {
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
