var storage = new Store("tabrenamer", storageDefaults);

window.addEventListener("load", function() {
    chrome.windows.getCurrent(function(w) {
        chrome.tabs.getSelected(w.id, function (t) {
            var titleBox = document.getElementById("title");

            titleBox.addEventListener("keydown", function(e) {
                var keyPressed = e.key || e.keyCode || e.which;
                if (keyPressed === keyEnter) {
                    window.close();
                }
            });

            titleBox.addEventListener("keyup", function(e) {
                changeFavicon(storage.get("keepFavicon") ? "" : "blank", titleBox.value.replace("'", "\\'"), t.id);
            });

            titleBox.focus();
        });
    });
});
