window.addEventListener("load", function() {
    getCurrentTab(function(t) {
        var titleBox = document.getElementById("title");

        titleBox.addEventListener("keydown", function(e) {
            var keyPressed = e.key || e.keyCode || e.which;
            if (keyPressed === KEY_ENTER) {
                if (storage.get("permanentManual") === true) {
                    var autoData = storage.get("autoData");
                    autoData.push({
                        "isRegexMatch": true,
                        "isRegexReplace": false,
                        "match": "/" + t.url.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + "/",
                        "replace": titleBox.value,
                        "regexReplace": {
                            "match": "",
                            "replace": ""
                        },
                        "favicon": storage.get("keepFavicon") ? "" : "blank"
                    });
                    storage.set("autoData", autoData);
                }
                window.close();
            }
        });

        titleBox.addEventListener("keyup", function(e) {
            changeFavicon(storage.get("keepFavicon") ? "" : "blank", titleBox.value, t.id);
        });

        titleBox.focus();
    });
});
