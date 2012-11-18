var changeFavicon = function() {
    chrome.extension.sendMessage({
        "action": "quickRename"
    });
};

/*\
 *  f1:  112  Help
 *  f2:  113
 *  f3:  114  Search
 *  f4:  115
 *  f5:  116  Refresh
 *  f6:  117  Highlight Omnibox
 *  f7:  118
 *  f8:  119
 *  f9:  120
 *  f10: 121
 *  f11: 122  Fullscreen
 *  f12: 123  Toggle Dev Tools
\*/

var onKeyUp = function(e) {
    chrome.extension.sendMessage({
        "action": "getQuickChangeOptions"
    }, function(response) {
        var keyPressed = e.key || e.keyCode || e.which;
        if (keyPressed === response.key && response.enabled) {
            changeFavicon();
        }
    });
};

window.addEventListener("keyup", onKeyUp);
