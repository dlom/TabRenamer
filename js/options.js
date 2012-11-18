var storage = new Store("tabrenamer", storageDefaults);

var save = function(key, value, callback) {
    setStatus("Saving...");
    storage.set(key, value);
    storage.saveSync(function() {
        setStatus("Saved", 500);
        callback && callback();
    });
};

var initialize = function() {
    var main = document.getElementById("main");
    drawOptions(main);
};

var drawOptions = function(parent) {
    parent.innerHTML = "";

    drawStatusBar(parent);
    parent.appendChild(document.createElement("hr"));
    setStatus("Loading...");
    drawTypeOptions(parent);
    drawSyncSaveButton(parent);
    drawSyncLoadButton(parent);
    setStatus("Loaded", 1000);
};

var drawStatusBar = function(parent) {
    var status = document.createElement("h1");
    status.id = "status";
    status.appendChild(document.createTextNode("Tab Renamer Options"));

    parent.appendChild(status);
};

var statusTimeout;

var setStatus = function(text, timeout) {
    var status = document.getElementById("status");
    if (text == null) {
        status.innerText = "Tab Renamer Options";
    } else {
        status.innerText = "Tab Renamer Options - " + text;
        if (timeout != null) {
            clearTimeout(statusTimeout);
            statusTimeout = setTimeout(setStatus, timeout);
        }
    }
};

var drawTypeOptions = function(parent) {
    var type = createSelect("type", {
        "Manual": "manual",
        "Quick Change": "quickChange"
    });
    type.value = storage.get("type");
    type.addEventListener("change", typeHandler);

    var typeLabel = createLabel("type", "Renaming Type: ");

    var manualOrQuick = document.createElement("div");
    manualOrQuick.id = "manualOrQuick";

    parent.appendChild(typeLabel);
    parent.appendChild(type);
    parent.appendChild(manualOrQuick);

    typeHandler.apply(type);
};

var typeHandler = function() {
    var manualOrQuick = document.getElementById("manualOrQuick");
    manualOrQuick.innerHTML = "";
    if (this.value === "manual") {
        drawManualOptions(manualOrQuick);
    } else if (this.value === "quickChange") {
        drawQuickChangeOptions(manualOrQuick);
    }
    save("type", this.value, function() {
        setPopup(!(storage.get("type") === "quickChange"));
    });
};

var drawManualOptions = function(parent) {
    var keepFavicon = createInput("keepFavicon", "checkbox");
    keepFavicon.checked = storage.get("keepFavicon");
    keepFavicon.addEventListener("change", keepFaviconHandler);

    var keepFaviconLabel = createLabel("keepFavicon", "Keep the original favicon");

    parent.appendChild(keepFavicon);
    parent.appendChild(keepFaviconLabel);
};

var keepFaviconHandler = function() {
    save("keepFavicon", this.checked);
};

var drawQuickChangeOptions = function(parent) {
    var shortcutKey = createSelect("shortcutKey", {
        "None": -10000,
        "F2": 113,
        "F4": 115,
        "F7": 118,
        "F8": 119,
        "F9": 120,
        "F10": 121
    });
    shortcutKey.value = storage.get("shortcutKey");
    shortcutKey.addEventListener("change", shortcutKeyHandler);

    var shortcutKeyLabel = createLabel("shortcutKey", "Shortcut Key: ");

    var quickTitle = createInput("quickTitle", "text", storage.get("quickTitle"));
    addTypingHandlers(quickTitle);

    var quickTitleLabel = createLabel("quickTitle", "Quick Change Title: ");

    var quickFavicon = createInput("quickFavicon", "text", storage.get("quickFavicon"));
    quickFavicon.addEventListener("keydown", quickFaviconHandler);
    addTypingHandlers(quickFavicon);

    var quickFaviconLabel = createLabel("quickFavicon", "Site's Favicon: ", "Example: 'http://google.com'.  For a default blank favicon, use 'blank'.  For the same favicon, use '' (Nothing)");

    var quickFaviconTestImage = document.createElement("img");
    quickFaviconTestImage.id = "quickFaviconTestImage";

    var quickFaviconTestButton = createInput("quickFaviconTestButton", "button", "Test");
    quickFaviconTestButton.addEventListener("click", quickFaviconTestButtonHandler);

    parent.appendChild(shortcutKeyLabel);
    parent.appendChild(shortcutKey);
    parent.appendChild(quickTitleLabel);
    parent.appendChild(quickTitle);
    parent.appendChild(document.createElement("br"));
    parent.appendChild(quickFaviconLabel);
    parent.appendChild(quickFavicon);
    parent.appendChild(quickFaviconTestImage);
    parent.appendChild(quickFaviconTestButton);

    quickFaviconTestButtonHandler.apply(quickFaviconTestButton);
};

var shortcutKeyHandler = function() {
    save("shortcutKey", this.value);
};

var quickFaviconHandler = function(e) {
    var keyPressed = e.key || e.keyCode || e.which;
    if (keyPressed === keyEnter) {
        quickFaviconTestButtonHandler();
    }
};

var quickFaviconTestButtonHandler = function() {
    var value = document.getElementById("quickFavicon").value;
    var image = document.getElementById("quickFaviconTestImage");
    if (value === "") {
        image.classList.add("hidden");
    } else {
        image.src = getFavicon(value);
        image.classList.remove("hidden");
    }
};

var drawSyncSaveButton = function(parent) {
    var syncSave = createInput("syncSave", "button", "Force Sync Settings");
    syncSave.addEventListener("click", syncSaveHandler);

    parent.appendChild(syncSave);
};

var syncSaveHandler = function() {
    setStatus("Syncing settings...");
    storage.saveSync(function() {
        setStatus("Settings synced", 500);
    });
};

var drawSyncLoadButton = function(parent) {
    var syncLoad = createInput("syncLoad", "button", "Force Load Synced Settings");
    syncLoad.addEventListener("click", syncLoadHandler);

    parent.appendChild(syncLoad);
};

var syncLoadHandler = function() {
    setStatus("Loading synced settings...");
    storage.loadSync(initialize);
};

var typingIntervals = {};

var addTypingHandlers = function(input) {
    typingIntervals[input.id] = null;
    input.addEventListener("keyup", function() {
        clearTimeout(typingIntervals[input.id]);
        typingIntervals[input.id] = setTimeout(function() {
            save(input.id, input.value);
        }, 1000);
    });

    input.addEventListener("keydown", function() {
        clearTimeout(typingIntervals[input.id]);
    });

    input.addEventListener("blur", function() {
        clearTimeout(typingIntervals[input.id]);
        save(input.id, input.value);
    });
};

window.addEventListener("load", initialize);
