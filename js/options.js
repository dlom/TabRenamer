var save = function(key, value) {
    setStatus("Saving...");
    storage.set(key, value);
    setStatus("Saved", 500);
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
    parent.appendChild(document.createElement("hr"));
    drawAutoOptions(parent);
    parent.appendChild(document.createElement("hr"));
    drawShowAdvanced(parent);
    setStatus("Loaded", 1000);
};

var drawStatusBar = function(parent) {
    var status = document.createElement("h1");
    status.id = "status";
    status.appendChild(document.createTextNode("Tab Renamer Options"));

    parent.appendChild(status);
};

var statusTimeout;

var setStatus = function(text, timeout, callback) {
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
        "manual": "Manual",
        "quickChange": "Quick Change"
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
    setPopupEnabled(this.value !== "quickChange");
    save("type", this.value);
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
        "-10000000": "None",
        "113": "F2",
        "115": "F4",
        "118": "F7",
        "119": "F8",
        "120": "F9",
        "121": "F10"
    });
    shortcutKey.value = storage.get("shortcutKey");
    shortcutKey.addEventListener("change", shortcutKeyHandler);

    var shortcutKeyLabel = createLabel("shortcutKey", "Shortcut Key: ");

    var preset = createInput("preset", "checkbox");
    preset.checked = storage.get("preset");
    preset.addEventListener("change", presetHandler);

    var presetLabel = createLabel("preset", "Use presets");

    var presetOrNot = document.createElement("div");
    presetOrNot.id = "presetOrNot";

    parent.appendChild(shortcutKeyLabel);
    parent.appendChild(shortcutKey);
    parent.appendChild(document.createElement("br"));
    parent.appendChild(preset);
    parent.appendChild(presetLabel);
    parent.appendChild(presetOrNot);

    presetHandler.apply(preset);
};

var shortcutKeyHandler = function() {
    save("shortcutKey", this.value);
};

var presetHandler = function() {
    var presetOrNot = document.getElementById("presetOrNot");
    presetOrNot.innerHTML = "";
    if (this.checked) {
        drawQuickPresetOptions(presetOrNot);
    } else {
        drawQuickNonPresetOptions(presetOrNot);
    }
    save("preset", this.checked);
};

var drawQuickPresetOptions = function(parent) {
    var selectedPreset = createSelect("selectedPreset", presets);
    selectedPreset.value = storage.get("selectedPreset");
    selectedPreset.addEventListener("change", selectedPresetHandler);


    var selectedPresetLabel = createLabel("selectedPreset", "Selected Preset: ");

    parent.appendChild(selectedPresetLabel);
    parent.appendChild(selectedPreset);
};

var selectedPresetHandler = function() {
    save("selectedPreset", this.value);
};

var drawQuickNonPresetOptions = function(parent) {
    var quickTitle = createInput("quickTitle", "text", storage.get("quickTitle"));
    addTypingHandlers(quickTitle, function() {
        save("quickTitle", this.value);
    });

    var quickTitleLabel = createLabel("quickTitle", "Quick Change Title: ");

    var quickFavicon = createInput("quickFavicon", "text", storage.get("quickFavicon"));
    addTypingHandlers(quickFavicon, function() {
        quickFaviconTestButtonHandler();
        save("quickFavicon", this.value);
    });

    var quickFaviconLabel = createLabel("quickFavicon", "Site's Favicon: ", "Example: 'http://google.com'.  For a default blank favicon, use 'blank'.  To not change the favicon, use '' (Nothing)");

    var quickFaviconTestImage = document.createElement("img");
    quickFaviconTestImage.id = "quickFaviconTestImage";

    var quickFaviconTestButton = createInput("quickFaviconTestButton", "button", "Test");
    quickFaviconTestButton.addEventListener("click", quickFaviconTestButtonHandler);

    parent.appendChild(quickTitleLabel);
    parent.appendChild(quickTitle);
    parent.appendChild(document.createElement("br"));
    parent.appendChild(quickFaviconLabel);
    parent.appendChild(quickFavicon);
    parent.appendChild(quickFaviconTestImage);
    parent.appendChild(quickFaviconTestButton);

    quickFaviconTestButtonHandler.apply(quickFaviconTestButton);
};

var quickFaviconTestButtonHandler = function() {
    var value = document.getElementById("quickFavicon").value;
    var image = document.getElementById("quickFaviconTestImage");
    if (value === "") {
        image.classList.add("hidden");
    } else {
        image.src = getFaviconFromURL(value);
        image.classList.remove("hidden");
    }
};

var drawShowAdvanced = function(parent) {
    showAdvanced = createInput("showAdvanced", "checkbox");
    showAdvanced.addEventListener("click", showAdvancedHandler);

    showAdvancedLabel = createLabel("showAdvanced", "Show Advanced Options");

    var advancedOptions = document.createElement("div");
    advancedOptions.id = "advancedOptions";

    parent.appendChild(showAdvanced);
    parent.appendChild(showAdvancedLabel);
    parent.appendChild(advancedOptions);
};

var showAdvancedHandler = function() {
    var advancedOptions = document.getElementById("advancedOptions");
    advancedOptions.innerHTML = "";
    if (this.checked) {
        drawSyncSaveButton(advancedOptions);
        drawSyncLoadButton(advancedOptions);
        // drawResetOptionsButton(advancedOptions);
    }
};

var drawSyncSaveButton = function(parent) {
    var syncSave = createInput("syncSave", "button", "Sync Settings");
    syncSave.addEventListener("click", syncSaveHandler);

    parent.appendChild(syncSave);
};

var syncSaveHandler = function() {
    setStatus("Syncing settings...");
    chrome.storage.sync.set(storage.toObject(), function() {
        setStatus("Settings synced", 500);
    });
};

var drawSyncLoadButton = function(parent) {
    var syncLoad = createInput("syncLoad", "button", "Load Synced Settings");
    syncLoad.addEventListener("click", syncLoadHandler);

    parent.appendChild(syncLoad);
};

var syncLoadHandler = function() {
    setStatus("Loading synced settings...");
    chrome.storage.sync.get({}, function(values) {
        storage.fromObject(values, true, true);
        initialize();
    });
};

/*var drawResetOptionsButton = function(parent) {
    var resetOptions = createInput("resetOptions", "button", "Reset");
    resetOptions.addEventListener("click", resetOptionsHandler);

    parent.appendChild(resetOptions);
};

var resetOptionsHandler = function() {
    storage.fromObject(storageDefaults, false, true);
    initialize();
};*/

var drawAutoOptions = function(parent) {
    var autoOptions = document.createElement("div");
    autoOptions.id = "autoOptions";

    drawAutoMatches(autoOptions);

    parent.appendChild(autoOptions);
};

var drawAutoMatches = function(parent) {
    var autoMatchesHeader = document.createElement("h2");
    autoMatchesHeader.appendChild(document.createTextNode("Auto Options"));

    var autoMatches = document.createElement("ul");
    autoMatches.id = "autoMatches";

    var autoData = storage.get("autoData");
    if (autoData.length === 0) {
        autoData.push({
            "isRegexMatch": false,
            "isRegexReplace": false,
            "match": "",
            "replace": "",
            "regexReplace": {
                "match": "",
                "replace": ""
            }
        });
        save("autoData", autoData);

        drawAutoMatch(autoMatches, autoData[0], 0, 1);
    } else {
        for (var i = 0; i < autoData.length; i++) {
            drawAutoMatch(autoMatches, autoData[i], i, autoData.length);
        }
    }

    parent.appendChild(autoMatchesHeader);
    parent.appendChild(autoMatches);
};

var drawAutoMatch = function(parent, auto, num, length) {
    var autoMatch = document.createElement("li");
    autoMatch.dataset.matchNum = num;
    autoMatch.classList.add("autoMatch");

    var infoText1 = document.createTextNode("Match a url using the ");

    var autoMatchMatchType = createSelectNoId({
        "regex": "regular expression",
        "wildcard": "wildcard expression"
    });
    autoMatchMatchType.value = (auto.isRegexMatch) ? "regex" : "wildcard";
    autoMatchMatchType.classList.add("autoMatchMatchType");
    autoMatchMatchType.addEventListener("change", autoMatchMatchTypeHandler);

    var autoMatchMatch = createInputNoId("text", auto.match);
    autoMatchMatch.classList.add("autoMatchMatch");
    autoMatchMatch.placeholder = (auto.isRegexMatch) ? "/google/g" : "*google*";
    addTypingHandlers(autoMatchMatch, function() {
        // TODO validate
        var parent = this.parentElement;
        var autoData = storage.get("autoData");
        autoData[parent.dataset.matchNum].match = this.value;

        save("autoData", autoData);
    });


    var infoText2 = document.createTextNode(" and ");

    var autoMatchReplaceType = createSelectNoId({
        "regexReplace": "regex replace",
        "replace": "replace"
    });
    autoMatchReplaceType.value = (auto.isRegexReplace) ? "regexReplace" : "replace";
    autoMatchReplaceType.classList.add("autoMatchReplaceType");
    autoMatchReplaceType.addEventListener("change", autoMatchReplaceTypeHandler);

    var infoText3 = document.createTextNode(" it with ");

    var autoMatchRemove = createInputNoId("button", "Remove");
    autoMatchRemove.classList.add("autoMatchRemove");
    autoMatchRemove.addEventListener("click", autoMatchRemoveHandler);

    autoMatch.appendChild(infoText1);
    autoMatch.appendChild(autoMatchMatchType);
    autoMatch.appendChild(autoMatchMatch);
    autoMatch.appendChild(infoText2);
    autoMatch.appendChild(autoMatchReplaceType);
    autoMatch.appendChild(infoText3);
    autoMatch.appendChild(autoMatchRemove);
    drawAutoMatchReplaceOptions(autoMatch, auto); // hax

    if (num === length - 1) {
        var autoMatchAdd = createInputNoId("button", "Add");
        autoMatchAdd.classList.add("autoMatchAdd");
        autoMatchAdd.addEventListener("click", autoMatchAddHandler);
        autoMatch.appendChild(autoMatchAdd);
    }

    parent.appendChild(autoMatch);
};

var autoMatchMatchTypeHandler = function() {
    var parent = this.parentElement;
    var autoData = storage.get("autoData");
    autoData[parent.dataset.matchNum].isRegexMatch = (this.value === "regex") ? true : false;

    parent.children[1].placeholder = (this.value === "regex") ? "/google/g" : "*google*";

    save("autoData", autoData);
};

var autoMatchReplaceTypeHandler = function() {
    var parent = this.parentElement;
    var autoData = storage.get("autoData");
    var value = this.value
    autoData[parent.dataset.matchNum].isRegexReplace = (value === "regexReplace") ? true : false;

    parent.removeChild(parent.children[3]);
    drawAutoMatchReplaceOptions(parent, autoData[parent.dataset.matchNum]);

    save("autoData", autoData);
};

var autoMatchRemoveHandler = function() {
    var parent = this.parentElement;
    var autoData = storage.get("autoData");
    autoData.splice(parent.dataset.matchNum, 1);

    save("autoData", autoData);

    var autoOptions = document.getElementById("autoOptions");
    autoOptions.innerHTML = "";
    drawAutoMatches(autoOptions);
};

var autoMatchAddHandler = function() {
    var parent = this.parentElement.parentElement;
    this.parentElement.removeChild(this);
    var autoData = storage.get("autoData");
    var num = autoData.push({
        "isRegexMatch": false,
        "isRegexReplace": false,
        "match": "",
        "replace": "",
        "regexReplace": {
            "match": "",
            "replace": ""
        }
    });

    save("autoData", autoData);

    drawAutoMatch(parent, autoData[num - 1], num - 1, num)
};

var drawAutoMatchReplaceOptions = function(parent, auto) {
    var autoMatchReplaceOptions = document.createElement("span");
    autoMatchReplaceOptions.classList.add("autoMatchReplaceOptions");
    if (auto.isRegexReplace) {
        var autoMatchReplaceMatch = createInputNoId("text", auto.regexReplace.match);
        autoMatchReplaceMatch.classList.add("autoMatchReplaceMatch");
        autoMatchReplaceMatch.placeholder = "/google/gi";
        addTypingHandlers(autoMatchReplaceMatch, function() {
            // TODO validate
            var parent = this.parentElement.parentElement;
            var autoData = storage.get("autoData");
            autoData[parent.dataset.matchNum].regexReplace.match = this.value;

            save("autoData", autoData);
        });

        var autoMatchReplaceReplace = createInputNoId("text", auto.regexReplace.replace);
        autoMatchReplaceReplace.classList.add("autoMatchReplaceReplace");
        autoMatchReplaceReplace.placeholder = "bugle";
        addTypingHandlers(autoMatchReplaceReplace, function() {
            // TODO validate
            var parent = this.parentElement.parentElement;
            var autoData = storage.get("autoData");
            autoData[parent.dataset.matchNum].regexReplace.replace = this.value;

            save("autoData", autoData);
        });
        autoMatchReplaceOptions.appendChild(autoMatchReplaceMatch);
        autoMatchReplaceOptions.appendChild(autoMatchReplaceReplace);
    } else {
        var autoMatchReplace = createInputNoId("text", auto.replace);
        autoMatchReplace.classList.add("autoMatchReplace");
        addTypingHandlers(autoMatchReplace, function() {
            // TODO validate
            var parent = this.parentElement.parentElement;
            var autoData = storage.get("autoData");
            autoData[parent.dataset.matchNum].replace = this.value;

            save("autoData", autoData);
        });

        var autoMatchReplaceSpacer = createInputNoId("text", "");
        autoMatchReplaceSpacer.classList.add("autoMatchReplaceSpacer");

        autoMatchReplaceOptions.appendChild(autoMatchReplace);
        autoMatchReplaceOptions.appendChild(autoMatchReplaceSpacer);
    }

    parent.insertBefore(autoMatchReplaceOptions, parent.children[3]); // uberhax
};

window.addEventListener("load", initialize);
