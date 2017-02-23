define(function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        compress = require('./compress'),

        reader = new FileReader(),
        MAX_SIZE = 200 * 1024,
        undefined;

    var util = new Module('util', {
        read_file: function(file, callback) {
            reader.onload = function () {
                var result = this.result;
                var img = new Image();
                img.src = result;

                //如果图片大小小于200kb，则直接上传
                if (result.length <= MAX_SIZE) {
                    img = null;
                    callback(result);
                    return;
                }

                img.onload = function() {
                    var data = compress(img);
                    callback(data);
                    img = null;
                };
            };

            reader.readAsDataURL(file);
        }
    });

    return util;
});