var storage = new Store("tabrenamer", storageDefaults);

var save = function(key, value) {
    setStatus("Saving...");
    storage.set(key, value);
    storage.saveSync(function() {
        setStatus("Saved", 500);
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
    setPopup(this.value !== "quickChange");
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
        "-10000": "None",
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
        save(quickTitle.id, quickTitle.value);
    });

    var quickTitleLabel = createLabel("quickTitle", "Quick Change Title: ");

    var quickFavicon = createInput("quickFavicon", "text", storage.get("quickFavicon"));
    addTypingHandlers(quickFavicon, function() {
        quickFaviconTestButtonHandler();
        save(quickFavicon.id, quickFavicon.value);
    });

    var quickFaviconLabel = createLabel("quickFavicon", "Site's Favicon: ", "Example: 'http://google.com'.  For a default blank favicon, use 'blank'.  For the same favicon, use '' (Nothing)");

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
        image.src = getFavicon(value);
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

window.addEventListener("load", initialize);
