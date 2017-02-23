/**
 * Created by maplemiao on 18/02/2017.
 */
"use strict";


define(function (require, exports, module) {
    var m1 = require('./module1');
    var tmpl = require('./tmpl');

    return {
        init: function () {
            var htmlString = tmpl.index({
                string: 'this is a test string',
                number: 1,
                boolean: true
            });

            $('#container').html(htmlString);

            m1.run();
        }
    }
});