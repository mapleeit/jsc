/**
 * 启用更好的读屏软件支持
 * @author jameszuo
 * @date 13-12-10
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        console = lib.get('./console'),
        store = lib.get('./store'),

        user_log = require('./user_log'),
        constants = require('./constants'),

        re_time = new RegExp('^(\\d{4})\\-(\\d{1,2})\\-(\\d{1,2}) ((\\d{1,2})(:(\\d{1,2})(:\\d{1,2})?)?)?'),
        undef;


    return {
        _enabled: false,
        _store_key: 'screen_reader_mode',
        _inited: false,
        init: function () {
            if (this._inited) return;

            var me = this,
                $start = $('#_aria_start_trigger');

            if (!$start[0]) return;

            me._enabled = !!store.get(me._store_key);

            me._enabled && $(document.documentElement).addClass('screen-reader-mode');

            var $enable_trigger = $('<button type="button" tabindex="0" style="position: fixed;_position:absolute;top:-200px;">如果您使用的' + (me._enabled ? '不是' : '是') + '读屏软件，请点击这里' + (me._enabled ? '关闭' : '启用') + '微云的读屏软件支持.</button>');

            // 如果已启用，则将文字显示出来，防止普通用户不小心启用了该功能。
            me._enabled && ($enable_trigger.text($enable_trigger.attr('title'))[0].style.cssText = 'width:100%;background-color:yellow;border:1px dotted;');

            $start.after($enable_trigger);

            $enable_trigger.on('click', function (e) {
                e.preventDefault();
                me._toggle_enable();
            });

            // 上报
            me._enabled && setTimeout(function () {
                user_log(constants.IS_APPBOX ? 'USE_SCREEN_READER_APPBOX' : 'USE_SCREEN_READER_WEB');
            }, 4000);

            this._inited = 1;
        },

        /**
         * 判断是否已启用更好的读屏软件支持
         * @returns {boolean}
         */
        is_enable: function () {
            return this._enabled;
        },

        /**
         * 中文日期格式，易读
         * @param {String} time
         * @returns {string}
         */
        readable_time: function (time) {
            return  time.replace(re_time, function (m, year, month, day, $2, hour, $3, min) {
                return [year, '年', month, '月', day, '日', hour, '时', min, '分'].join('');
            });
        },

        _toggle_enable: function () {
            var me = this,
                change_to = me._enabled;

            if (me._enabled) {
                if (confirm('确定要关闭微云的读屏软件支持吗？如果您正在通过读屏软件使用微云，那么关闭后部分功能可能无法正常工作。')) {
                    store.remove(me._store_key);
                    change_to = false;
                }
            } else {
                if (confirm('确定要启用微云的读屏软件支持吗？')) {
                    store.set(me._store_key, 1);
                    if (store.get(me._store_key)) {
                        change_to = true;
                    } else {
                        alert('启用读屏软件支持失败，您的浏览器未能支持该特性');
                    }
                }
            }

            // 上报并刷新页面
            if (me._enabled !== change_to) {
                location.reload();
            }
        }
    };
});