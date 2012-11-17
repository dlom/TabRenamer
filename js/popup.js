window.onload = function() {
    chrome.windows.getCurrent(function(w) {
        chrome.tabs.getSelected(w.id, function (t){
            var titleBox = document.getElementById("title");

            titleBox.addEventListener("keydown", function(e) {
                var keyPressed = e.key || e.keyCode || e.which;
                if (keyPressed === 13) {
                    window.close();
                }
            });

            titleBox.addEventListener("keyup", function(e) {
                changeFavicon("blank", titleBox.value, t.id);
            });

            titleBox.focus();
        });
    });
}
