/**
 * Created by maplemiao on 18/02/2017.
 */
"use strict";

define(function (require, exports, module) {
    var m2 = require('./module2');

    return {
        run: function () {
            console.log('module 1 running');

            m2.run();
        }
    }
});