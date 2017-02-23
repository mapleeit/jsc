/**
 * 从导航进入离线文件目录
 * @author hibincheng
 * @date 2013-11-22
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        Module = common.get('./module'),
        remote_config = common.get('./remote_config'),
        scr_reader_mode = common.get('./scr_reader_mode'),
        file_path_ui = require('./file_path.ui'),
        ui_offline = require('./file_list.ui_offline'),
        columns = require('./file_list.offline.offline_columns'),
        offline_guide = require('./file_list.offline.offline_guide'),

        undefined;

    var offline_opener = new Module('offline_opener', {

        init: function() {
            file_path_ui.toggle_$path(false);
            columns.render(file_path_ui.get_$path_warp());

            var me = this;
            //使用setTimeout hack，因为ui_offline会进入离线文件也会执行exit_dir 从而解决offline_destroy，这里采用异步使之在exit_dir后来绑定事件
            setTimeout(function() {
                me.listenToOnce(ui_offline, 'offline_destroy', function() {
                    file_path_ui.toggle_$path(true);
                    columns.destroy();//每次退出离线文件都把表头删除
                });
            }, 16);

            // 针对读屏软件不启用该引导 - james
            /*if (!scr_reader_mode.is_enable()) {
                this._render_guide();
            }*/

        },

        _render_guide: function() {
            offline_guide.render();
        }
    });

    return offline_opener;
});