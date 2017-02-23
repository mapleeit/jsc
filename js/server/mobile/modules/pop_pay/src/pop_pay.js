/**
 * Created by maplemiao on 22/01/2017.
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


    return new Module('pop_pay', {
        init: function (syncData) {
            window.WEIYUN_AID = syncData.aid || '';
            document.domain = 'weiyun.com';

            view.init(syncData);
            mgr.init({
                view: view,
                ar: ar
            });
        }
    });
});