/**
 * 右键菜单，文件定位
 * @author xixinhuang
 * @date 15-11-03
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        routers = lib.get('./routers'),

        Module = common.get('./module'),
        request = common.get('./request'),
        global_event = common.get('./global.global_event'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),

        tmpl = require('./tmpl'),
        main = require('main').get('./main'),

        undefined;

    var jump_path = new Module('disk_file_jump', {

        /**
         * 右键跳转到具体路径中
         * @param {FileNode} file
         */
        jump: function (file) {
            console.log('jump:' + file._id + ':' + file._pid)
            this.get_path(file._id, file._pid);
        },

        jump_to: function(file_id, data) {
            var path = [];
            if (data.items) {
                $.each(data.items, function (index, o) {
                    path.push({
                        name: o.dir_name,
                        id: o.dir_key
                    });
                });
            }
            path.shift();  // cgi返回的目录含微云根目录，不需要
            path.push([file_id]); // 目标文件(夹)要高亮显示

            main.async_render_module('disk', {
                path: path
            });
            routers.replace({
                m: 'disk'
            }, true);
        },

        /**
         * 获取指定目录的子目录
         * @param {String} node_par_id
         * @param {String} node_id
         */
        get_path: function (file_id, dir_key) {
            var me = this;

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/user_library.fcg',
                cmd: 'LibDirPathGet',
                cavil: true,
                pb_v2: true,
                body: {
                    dir_key: dir_key
                }
            }).ok(function (msg, body) {
                me.jump_to(file_id, body);
            }).fail(function (msg, ret) {
                //mini_tip.error(msg);
                console.log('get_path fail')
            }).done(function () {
                console.log('get_path done')
                //progress.hide();
            });
        }
    });

    return jump_path;
});