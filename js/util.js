var storageDefaults = {
    "faviconEndpoint": "http://g.etfv.co/",
    "type": "manual",
    "keepFavicon": false,
    "quickTitle": "",
    "quickFavicon": "blank",
    "shortcutKey": "-10000000",
    "preset": false,
    "selectedPreset": "wikipedia",
    "autoData": [{
        "isRegex": true,
        "match": "/.*google.com\\/?.*/",
        "replace": "GOOGLE SUX"
    }, {
        "isRegex": false,
        "match": "*github*",
        "replace": "GITHUB 4 LYFE"
    }]
};

var storage = new Store("tabrenamer", storageDefaults);

var presets = {
    "wikipedia": {
        "text": "Wikipedia",
        "title": "Wikipedia, the free encyclopedia",
        "favicon": "en.wikipedia.org"
    },
    "google": {
        "text": "Google",
        "title": "Google",
        "favicon": "google.com"
    },
    "cnn": {
        "text": "CNN",
        "title": "CNN.com - Breaking News, U.S., World, Weather, Entertainment & Video News",
        "favicon": "cnn.com"
    },
    "yahoo": {
        "text": "Yahoo",
        "title": "Yahoo!",
        "favicon": "yahoo.com"
    }
};

var KEY_ENTER = 13;

var l = function() { console.log.apply(console, arguments); };

var setPopupEnabled = function(enabled) {
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
    var url, title;
    if (storage.get("preset")) {
        var preset = presets[storage.get("selectedPreset")];
        url = preset.favicon;
        title = preset.title;
    } else {
        url = storage.get("quickFavicon");
        title = storage.get("quickTitle");
    }
    changeFavicon(url, title, tabId);
};

var getFaviconFromURL = function(url) {
    if (url === "") {
        return "";
    } else if (url === "blank") {
        return chrome.extension.getURL("images/chrome-favicon.png");
    } else {
        if (!/(.*?):\/\//.test(url)) {
            url = "http://" + url;
        }
        return storageDefaults.faviconEndpoint + url;
    }
};

var sanitize = function(dirty) {
    return dirty.replace(/'/g, "\\'");
};

var changeFavicon = function(url, title, tabId) {
    if (tabId == null) {
        tabId = null; // Seems wat-worthy, but in actuallity, sets tabId to null if undefined
    }
    url = getFaviconFromURL(url);
    chrome.tabs.executeScript(tabId, {
        "file": "favicon.js/favicon.min.js"
    }, function() {
        chrome.tabs.executeScript(tabId, {
            "code": "favicon.change('" + sanitize(url) + "', '" + sanitize(title) + "');"
        });
    });
};

var handleAuto = function(location, tabId) {
    var autoData = storage.get("autoData");
    l(autoData.length);
    for (var i = 0; i < autoData.length; i++) {
        var regex = autoData[i].match;
        if (!autoData[i].isRegex) regex = "/" + regex.replace(/([\\\+\|\{\}\[\]\(\)\^\$\.\#])/g, "\\$1").replace(/\*/g, ".*").replace(/\?/g, ".") + "/";
        l(regex, i);
        var parsedRegex = parseRegex(regex);
        l(parsedRegex, i);
        if (parsedRegex == null) {
            console.error("Malformed RegExp `" + regex + "`!", i);
            return;
        }
        var match = parsedRegex.exec(location.href);
        if (match != null) {
            changeFavicon("", autoData[i].replace, tabId);
        }
    }
};

var parseRegex = function(regex) {
    // Taken and adapted from the source of coffee-script
    var regexRegex = /^(\/(?![\s=])[^[\/\n\\]*(?:(?:\\[\s\S]|\[[^\]\n\\]*(?:\\[\s\S][^\]\n\\]*)*])[^[\/\n\\]*)*\/)([imgy]{0,4})(?!\w)/;
    var match = regexRegex.exec(regex);
    if (match == null) return null;
    if (match[1] === "//") match[1] = "/(?:)/";
    var parsedRegex;
    try {
        parsedRegex = new RegExp(match[1].slice(1, match[1].length - 1), match[2]);
    } catch(e) {
        parsedRegex = null;
    }
    return parsedRegex;
};
