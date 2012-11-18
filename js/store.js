(function () {
    var Store = this.Store = function (name, defaults) {
        var key;
        this.name = name;
        if (defaults != null) {
            for (key in defaults) {
                if (defaults.hasOwnProperty(key) && this.get(key) == null) {
                    this.set(key, defaults[key]);
                }
            }
        }
    };

    Store.prototype.get = function (name) {
        name = "store." + this.name + "." + name;
        if (localStorage.getItem(name) === null) {
            return undefined;
        }
        try {
            return JSON.parse(localStorage.getItem(name));
        } catch (e) {
            return null;
        }
    };

    Store.prototype.set = function (name, value) {
        if (value == null) {
            this.remove(name);
        } else {
            if (typeof value === "function") {
                value = null;
            } else {
                try {
                    value = JSON.stringify(value);
                } catch (e) {
                    value = null;
                }
            }
            localStorage.setItem("store." + this.name + "." + name, value);
        }

        return this;
    };

    Store.prototype.remove = function (name) {
        localStorage.removeItem("store." + this.name + "." + name);
        return this;
    };

    Store.prototype.removeAll = function () {
        var name;
        var i;
        name = "store." + this.name + ".";
        for (i = (localStorage.length - 1); i >= 0; i--) {
            if (localStorage.key(i).substring(0, name.length) === name) {
                localStorage.removeItem(localStorage.key(i));
            }
        }
        return this;
    };

    Store.prototype.toObject = function () {
        var values = {};
        var name;
        var i;
        var key;
        var value;
        name = "store." + this.name + ".";
        for (i = (localStorage.length - 1); i >= 0; i--) {
            if (localStorage.key(i).substring(0, name.length) === name) {
                key = localStorage.key(i).substring(name.length);
                value = this.get(key);
                if (value != null) {
                    values[key] = value;
                }
            }
        }
        return values;
    };

    Store.prototype.fromObject = function (values, merge, overwrite) {
        if (merge !== true) {
            this.removeAll();
        }
        for (var key in values) {
            if (values.hasOwnProperty(key) && (this.get(key) != null && overwrite) || this.get(key) == null) {
                this.set(key, values[key]);
            }
        }
        return this;
    };

    Store.prototype.saveSync = function(callback) {
        var that = this;
        chrome.storage.sync.set(this.toObject(), function() {
            callback && callback(that);
        });
    };

    Store.prototype.loadSync = function(defaults, merge, callback) {
        var that = this;
        if (typeof defaults === "function" && merge == null && callback == null) {
            callback = defaults;
            merge = true;
            defaults = {};
        }
        if (typeof merge === "function" && callback == null) {
            callback = merge;
            merge = true;
            if (typeof defaults === "boolean") {
                merge = defaults;
                defaults = {};
            }
        }
        chrome.storage.sync.get(defaults, function(values) {
            that.fromObject(values, merge, true);
            callback && callback(that);
        });
    };
}());
