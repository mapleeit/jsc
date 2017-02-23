/**
 * 通过 new Image().src 方式发送请求
 * 这个模块存在的意义是为了解决 IE 下 new Image() 的bug：当这个 image 没有挂载到某个常驻内存的对象中时，有小概率会被直接GC而不会发出请求
 * @author jameszuo
 * @date 13-5-29
 */
define(function (require) {
    var $ = require('$'),

    // 挂载 image 到该对象上，防止被IE无情GC
        loading_images = {},

        id_seq = 0,

        undefined;

    var image_loader = {

        load: function (url) {
            var me = this,
                def = $.Deferred(),
                id = id_seq++,
                img = new Image();

            img.onload = function () {
                me._destroy(id);
                def.resolve(this);
            };
            img.onerror = img.onabort = function () {
                me._destroy(id);
                def.reject(this);
            };

            img.src = url;

            // 防止被GC
            loading_images[id] = img;

            return def;
        },

        _destroy: function (id) {
            var img = loading_images[id];
            if (img) {
                img.onload = img.onerror = img.onabort = null;
                delete loading_images[id];
            }
        }
    };

    return image_loader;
});