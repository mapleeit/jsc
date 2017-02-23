/**
 * 本地存储
 * @sven
 */
define(function (require, exports, module) {
    var api,
        win = window,
        doc = win.document,
        localStorageName = 'localStorage',
        globalStorageName = 'globalStorage',
        storage,
        get,
        set,
        remove,
        clear,
        key_prefix = 'weiyun_',
        ok = false;

    set = get = remove = clear = function () {
    };

    try {
        if (localStorageName in win && win[localStorageName]) {
            storage = win[localStorageName];
            set = function (key, val) {
                storage.setItem(key, val)
            };
            get = function (key) {
                return storage.getItem(key)
            };
            remove = function (key) {
                storage.removeItem(key)
            };
            clear = function () {
                storage.clear()
            };

            ok = true;
        }
    }
    catch (e) {
    }


    try {
        if (!ok && globalStorageName in win && win[globalStorageName]) {
            storage = win[globalStorageName][win.location.hostname];
            set = function (key, val) {
                storage[key] = val
            };
            get = function (key) {
                return storage[key] && storage[key].value
            };
            remove = function (key) {
                delete storage[key]
            };
            clear = function () {
                for (var key in storage) {
                    delete storage[key]
                }
            };

            ok = true;
        }
    }
    catch (e) {
    }


    if (!ok && doc.documentElement.addBehavior) {
        function getStorage() {
            if (storage) {
                return storage
            }
            storage = doc.body.appendChild(doc.createElement('div'));
            storage.style.display = 'none';
            storage.setAttribute('data-store-js', '');
            // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
            // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
            storage.addBehavior('#default#userData');
            storage.load(localStorageName);
            return storage;
        }

        set = function (key, val) {
            try {
                var storage = getStorage();
                storage.setAttribute(key, val);
                storage.save(localStorageName);
            }
            catch (e) {
            }
        };
        get = function (key) {
            try {
                var storage = getStorage();
                return storage.getAttribute(key);
            }
            catch (e) {
                return '';
            }
        };
        remove = function (key) {
            try {
                var storage = getStorage();
                storage.removeAttribute(key);
                storage.save(localStorageName);
            }
            catch (e) {
            }
        };
        clear = function () {
            try {
                var storage = getStorage();
                var attributes = storage.XMLDocument.documentElement.attributes;
                storage.load(localStorageName);
                for (var i = 0, attr; attr = attributes[i]; i++) {
                    storage.removeAttribute(attr.name);
                }
                storage.save(localStorageName);
            }
            catch (e) {
            }
        }
    }

    api = {

        get: function (key) {
            return get(key_prefix + key);
        },

        set: function (key, val) {
            set(key_prefix + key, val);
        },

        remove: function (key) {
            remove(key_prefix + key);
        },

        clear: clear
    };

    module.exports = api;
});
