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

var onKeyPress = function(e) {
    chrome.extension.sendMessage({
        "action": "getQuickChangeOptions"
    }, function(response) {
        /* if (e.which >= 112 && e.which <= 123) {
            console.log(e.which);
        } */
        if (e.which === response.key && response.enabled) {
            changeFavicon()
        }
    });
}

window.addEventListener('keyup', onKeyPress, false);
