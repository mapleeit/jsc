/**
 * Created by maplemiao on 14/11/2016.
 */
"use strict";

define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$');

    var cookie = lib.get('./cookie'),
        Module = lib.get('./Module'),
        urls = common.get('./urls');
    var ar = require('./ar'),
        view = require('./view'),
        mgr = require('./mgr');


    return new Module('capacity_purchase', {
        init: function (syncData) {
            document.domain = 'weiyun.com';

            view.init(syncData);
            mgr.init({
                view: view,
                ar: ar
            });
        }
    });
});