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

window.addEventListener("keyup", function(e) {
    chrome.runtime.sendMessage({
        "action": "getQuickChangeOptions"
    }, function(response) {
        var keyPressed = e.key || e.keyCode || e.which;
        if (response.enabled && keyPressed === response.key) {
            chrome.runtime.sendMessage({
                "action": "quickRename"
            });
        }
    });
});

chrome.runtime.sendMessage({
    "action": "init",
    "title": document.title,
    "location": location
});
