/**
 * 类继承
 * @author cluezhang
 * @example
 * var SubClass = inherit({
 *     constructor: function () {},
 *     foo: function () {},
 *     ...
 * }, SuperClass);
 */
define(function (require, exports, module) {
    var $ = require('$');
    var object_proto = Object.prototype;
    var isObject = function (v) {
        return !!v && object_proto.toString.call(v) === '[object Object]';
    };
    var override = function (cls, overrides) {
        var proto = cls.prototype;
        $.extend(proto, overrides);
        if ($.browser.msie && overrides.hasOwnProperty('toString')) {
            proto.toString = overrides.toString;
        }
    };
    var object_constructor = object_proto.constructor;
    return function (sub_class, super_class, overrides) {
        if (isObject(super_class)) {
            overrides = super_class;
            super_class = sub_class;
            sub_class = overrides.constructor !== object_constructor ? overrides.constructor
                : function () {
                super_class.apply(this, arguments);
            };
        }
        var F = function () {
        }, sub_proto, super_proto = super_class.prototype;

        F.prototype = super_proto;
        sub_proto = sub_class.prototype = new F();
        sub_proto.constructor = sub_class;
        sub_class.superclass = super_proto;
        if (super_proto.constructor === object_constructor) {
            super_proto.constructor = super_class;
        }
        sub_class.override = function (o) {
            override(sub_class, o);
        };
        override(sub_class, overrides);
        return sub_class;
    };

});