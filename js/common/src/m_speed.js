/**
 * m.isd.com 测速4.0上报
 * @author jameszuo
 * @date 13-6-13
 */
define(function (require, exports, module) {
    var
        lib = require('lib'),
        configs = {},
        action_times = {},
        log_images = {},
        log_image_id_seq = 0,

        console = lib.get('./console').namespace('m_speed'),
        constants = require('./constants'),
        speed_url = constants.IS_HTTPS ? 'https://huatuospeed.weiyun.com/cgi-bin/r.cgi' : 'http://isdspeed.qq.com/cgi-bin/r.cgi';

    var speed = {
        __enable: Math.random() < 100 / 100, // 采样率
        config: function (cfg) {
            configs = cfg;
        },
        start: function (mod_name, action_name) {
            var action = this._get_action(mod_name, action_name);
            if (!action._done && !action._start) {
                action._start = new Date();
            }
        },
        done: function (mod_name, action_name) {
            var action = this._get_action(mod_name, action_name);
            if (action._start && !action._done) {
                action._done = new Date();
            }
        },
        time: function (mod_name, action_name) {
            var action = this._get_action(mod_name, action_name);
            if (action._done && action._start) {
                return action._done.getTime() - action._start.getTime();
            } else if (action._time) {
                return action._time;
            }
            return '';
        },
        set: function (mod_name, action_name, start_date, done_date) {
            var action = this._get_action(mod_name, action_name);
            action._start = start_date;
            action._done = done_date;
        },
        set_taken: function (mod_name, action_name, taken_mill) {
            var action = this._get_action(mod_name, action_name);
            action._time = taken_mill;
        },
        /**
         * 测速上报
         * @param {String} mod_name 模块名，如 base / disk / recycle
         * @param {String} [action_name] 操作名，如 image_preview，为空表示发送模块下所有记录
         * @param {Number} [time] 毫秒，为空表示从
         */
        send: function (mod_name, action_name, time) {

            if (!this.__enable) {
                return;
            }

            var mod = configs[mod_name];
            var times = {}, time_arr = [];
            var index;

            if (action_name) {
                index = mod[action_name];
                time = time || this.time(mod_name, action_name);
                times[index] = time;
                time_arr.push(index + '(' + action_name + ')' + '=' + time);

                if (mod_name in action_times) {
                    delete action_times[mod_name][action_name];
                }

            } else {
                for (var action in mod) {
                    if (action.indexOf('_') !== 0) {
                        index = mod[action];
                        time = this.time(mod_name, action);
                        times[index] = time;
                        time_arr.push(index + '(' + action + ')' + '=' + time);
                    }
                }
                delete action_times[mod_name];
            }

            if (console) {
                // console.debug('测速 > ' + mod_name + (action_name ? '.' + action_name : '') + ' > ' + mod.__flags.substr(0, mod.__flags.lastIndexOf('-')) + '-' + index + '  ' + time_arr.join(', '));
            }
            this._send(mod.__flags, times);
        },
        send_one: function (flags, index, time) {
            var times = {};
            times[index] = time;
            this._send(flags, times);
        },
        _send: function (flags, index_map_time) {
            if (!index_map_time) return;

            var times_arr = [];
            for (var index in index_map_time) {
                var time = index_map_time[index];
                if (time) {
                    times_arr.push(index + '=' + time);
                }
            }

            if (!times_arr.length) return;

            var flags_arr = flags.split('-'),
                args = ['flag1=' + flags_arr[0], 'flag2=' + flags_arr[1], 'flag3=' + flags_arr[2]].concat(times_arr);
            var uin = require('./query_user').get_uin_num();
            if(uin){
                args.push('uin='+uin);
            }

            var id = log_image_id_seq++,
                img = log_images[id] = new Image();

            img.onload = img.onerror = img.onabort = function () {
                this.onload = this.onerror = this.onabort = null;
                delete log_images[id];
            };
            img.src = speed_url + '?' + args.join('&');
        },
        _get_action: function (mod_name, action_name) {
            var mod = action_times[mod_name] || (action_times[mod_name] = {});
            return mod[action_name] || (mod[action_name] = {});
        }
    };
    return speed;
});