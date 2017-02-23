/**
 * 新版空页面模块
 * @author xixinhuang
 * @date 16-09-12
 * */
define(function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        collections = lib.get('./collections'),
        console = lib.get('./console'),

        tmpl = require('./tmpl'),
        widgets = require('./ui.widgets'),

        map = {},

        undefined;


    var blank_tip = {
        default_cfg: {
            icon_class: 'icon-nofile',
            title: '暂无文件',
            content: '请点击左上角的“上传”按钮添加'
        },

        _render: function (data) {
            var id = data.id,
                $to = data.to;

            if(map[id]) {
                return map[id];
            }

            var $el = $(tmpl['blank_tip'](data));
            $el.appendTo($to);
            map[id] = $el;
        },

        /**
         * 显示空页面提示
         * @param {object} data
         * @returns {*}
         * @private
         */
        show: function (data) {
            if(!data.id || !data.to) {
                return;
            }
            data = $.extend(this.default_cfg, data);
            this._render(data);
            return map[data.id];
        },

        hide: function (id) {
            if(map[id]) {
                var $el = map[id];
                $el.hide();
            }
        },

        remove: function(id) {
            if(map[id]) {
                var $el = map[id];
                $el.remove();
            }
        }
    };

    return blank_tip;
});