window.addEventListener("load", function() {
    getCurrentTab(function(t) {
        var titleBox = document.getElementById("title");

        titleBox.addEventListener("keydown", function(e) {
            var keyPressed = e.key || e.keyCode || e.which;
            if (keyPressed === KEY_ENTER) {
                window.close();
            }
        });

        titleBox.addEventListener("keyup", function(e) {
            changeFavicon(storage.get("keepFavicon") ? "" : "blank", titleBox.value, t.id);
        });

        titleBox.focus();
    });
});
