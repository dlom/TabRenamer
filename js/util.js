var faviconEndpoint = "http://g.etfv.co/";

var keyEnter = 13;

var storageDefaults = {
    "type": "manual",
    "keepFavicon": false,
    "quickTitle": "",
    "quickFavicon": "blank",
    "shortcutKey": "-10000"
};

var l = function(x) { console.log (x); };

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
    if (tabId == null) {
        tabId = null;
    }
    url = getFavicon(url);
    chrome.tabs.executeScript(tabId, {
        "file": "favicon.js/favicon.min.js"
    }, function() {
        chrome.tabs.executeScript(tabId, {
            "code": "favicon.change('" + url + "', '" + title + "');"
        });
    });
};

var createInput = function(id, type, value) {
    var input = document.createElement("input");
    input.id = id;
    input.type = type;
    if (value != null) {
        input.value = value;
    }
    return input;
};

var createSelect = function(id, options) {
    var select = document.createElement("select");
    select.id = id;
    for (var name in options) {
        if (options.hasOwnProperty(name)) {
            var option = document.createElement("option");
            option.value = options[name];
            option.appendChild(document.createTextNode(name));
            select.appendChild(option);
        }
    }
    return select;
};

var createLabel = function(elementFor, text, helpText) {
    var label = document.createElement("label");
    label.setAttribute("for", elementFor);
    if (helpText != null) {
        labelHelp = document.createElement("span");
        labelHelp.title = helpText;
        labelHelp.classList.add("help");
        labelHelp.appendChild(document.createTextNode(text));
        label.appendChild(labelHelp);
    } else {
        label.appendChild(document.createTextNode(text));
    }
    return label;
};
