/**
 * The Sea.js plugin for concatenating HTTP requests
 */
(function (seajs) {

    var Module = seajs.Module;
    var FETCHING = Module.STATUS.FETCHING;

    var data = seajs.data;
    var comboHash = data.comboHash = {};

    var comboSyntax = ["??", ","];
    var comboMaxLength = 2000;
    var comboExcludes;
    var regSplit = /(^https?:\/\/[^\/]+)([^\?]+)/;

    seajs.on("load", setComboHash);
    seajs.on("fetch", setRequestUri);

    function setComboHash(uris) {
        var len = uris.length;
        if (len < 2) {
            return;
        }

        data.comboSyntax && (comboSyntax = data.comboSyntax);
        data.comboMaxLength && (comboMaxLength = data.comboMaxLength);

        comboExcludes = data.comboExcludes;
        var needComboUris = [];

        for (var i = 0; i < len; i++) {
            var uri = uris[i];

            if (comboHash[uri]) {
                continue;
            }

            var mod = Module.get(uri);

            // Remove fetching and fetched uris, excluded uris, combo uris
            if (mod.status < FETCHING && !isExcluded(uri) && !isComboUri(uri)) {
                needComboUris.push(uri);
            }
        }

        if (needComboUris.length > 1) {
            paths2hash(needComboUris);
        }
    }

    function setRequestUri(data) {
        data.requestUri = comboHash[data.uri] || data.uri;
    }

    // Helpers
    //事项：精简后必须保证所有url在同一域名
    function paths2hash(paths) {
        var match = regSplit.exec(paths[0]);
        var root = match[1];
        var length = root.length + 2;  //预留合并符号
        var cache = [];
        for (var i = 0, len = paths.length; i < len; i++) {
            var path = paths[i];
            match = regSplit.exec(path);
            var file = match[2];
            if (length + file.length + 1 > comboMaxLength) {
                //超长url，立即flush
                setHash(root, cache);
                cache = [];
                length = root.length + 2;
            } else {
                cache.push(file);
                length += file.length + 1;
            }
        }
        if (cache.length != 0) {
            // 按文件类型分组(如 js / css 分开加载)
            var groups = {};
            for (var i = 0, l = cache.length; i < l; i++) {
                var m = cache[i].match(/.*\.(\w+)[^\?&]?/), type;
                if (m && (type = m[1])) {
                    (groups[type] || (groups[type] = [])).push(cache[i]);
                }
            }
            for (var type in groups) {
                setHash(root, groups[type]);
            }
        }
        return comboHash;
    }

    function setHash(root, files) {
        var comboPath = root + comboSyntax[0] + files.join(comboSyntax[1])
        for (var i = 0, len = files.length; i < len; i++) {
            comboHash[root + files[i]] = comboPath;
        }
    }

    function isExcluded(uri) {
        if (comboExcludes) {
            return comboExcludes.test ?
                comboExcludes.test(uri) :
                comboExcludes(uri);
        }
    }

    function isComboUri(uri) {
        var comboSyntax = data.comboSyntax || ["??", ","];
        var s1 = comboSyntax[0];
        var s2 = comboSyntax[1];

        return s1 && uri.indexOf(s1) > 0 || s2 && uri.indexOf(s2) > 0;
    }

    // Register as module
    define({});

})(seajs);
