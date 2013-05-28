var createInput = function(id, type, value) {
    var input = document.createElement("input");
    input.id = id;
    input.type = type;
    if (value != null) {
        input.value = value;
    }
    return input;
};

var createSelect = function(id, options) {
    var select = document.createElement("select");
    select.id = id;
    for (var value in options) {
        if (options.hasOwnProperty(value)) {
            var text = options[value];
            if (text.hasOwnProperty("text")) {
                text = text.text;
            }
            var option = document.createElement("option");
            option.value = value;
            option.appendChild(document.createTextNode(text));
            select.appendChild(option);
        }
    }
    return select;
};

var createLabel = function(elementFor, text, helpText) {
    var label = document.createElement("label");
    label.setAttribute("for", elementFor);
    if (helpText != null) {
        labelHelp = document.createElement("span");
        labelHelp.title = helpText;
        labelHelp.classList.add("help");
        labelHelp.appendChild(document.createTextNode(text));
        label.appendChild(labelHelp);
    } else {
        label.appendChild(document.createTextNode(text));
    }
    return label;
};

var addTypingHandlers = function(input, handler) {
    var state = {
        "e": null,
        "interval": null
    };
    input.addEventListener("keyup", function(e) {
        var keyPressed = e.key || e.keyCode || e.which;
        clearTimeout(state.interval);
        state.interval = null;
        if (keyPressed !== KEY_ENTER) {
            state = {
                "e": e,
                "interval": setTimeout(function() {
                    handler(e);
                }, 1000)
            };
        } else {
            handler(e);
        }
    });

    input.addEventListener("keydown", function() {
        clearTimeout(state.interval);
        state.interval = null;
    });

    input.addEventListener("blur", function() {
        clearTimeout(state.interval);
        if (state.interval != null) {
            handler(state.e);
        }
        state.interval = null;
    });
};
