define(function(require, exports, module) {

    (function (rAF, cAF) {
        var lastTime = 0, vendors = ['ms', 'moz', 'webkit', 'o'], x;

        for (x = 0; x < vendors.length && !window[rAF]; ++x) {
            window[rAF] = window[vendors[x] + 'RequestAnimationFrame'];
            window[cAF] = window[vendors[x] + 'CancelAnimationFrame']
                || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window[rAF]) {
            window[rAF] = function (callback) {
                var currTime = new Date().getTime(),
                    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                    id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);

                lastTime = currTime + timeToCall;

                return id;
            };
        }

        if (!window[cAF]) {
            window[cAF] = function (id) {
                window.clearTimeout(id);
            };
        }
    }('requestAnimationFrame', 'cancelAnimationFrame'));

});