/**
 * Created by maplemiao on 03/12/2016.
 */
"use strict";

define("club/weiyun/js/server/mobile/lib/prettysize",[],function () {
    var sizes = [
        'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'
    ];

    /**
     Pretty print a size from bytes
     @method pretty
     @param {Number} size The number to pretty print
     @param {Boolean} [nospace=false] Don't print a space
     @param {Boolean} [one=false] Only print one character
     @param {String} maxUnit B|K|M|G|T|P|E
     */
    return function(size, nospace, one, maxUnit) {
        var result, f;

        maxUnit = maxUnit ? maxUnit : 'E';

        sizes.forEach(function(f, id) {
            if (one) {
                f = f.slice(0, 1);
            }
            var s = Math.pow(1024, id),
                fixed;
            if (size >= s) {
                fixed = String((size / s).toFixed(2));//微云使用精度为2个小数点
                if (fixed.indexOf('.00') === fixed.length - 3) { // 当1.00时显示为1
                    fixed = fixed.slice(0, -3);
                }
                result = fixed + (nospace ? '' : ' ') + f;
            }

            if (f.slice(0, 1) === maxUnit) {
                return result;
            }
        });

        // zero handling
        // always prints in Bytes
        if (!result) {
            f = (one ? sizes[0].slice(0, 1) : sizes[0]);
            result = '0' + (nospace ? '' : ' ') + f;
        }

        return result;
    };
});