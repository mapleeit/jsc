/**
 * 展示loading
 * @param cursor|msg  进度|消息
 * @param count|delay_to_hide 总个数|延迟隐藏
 *
 * @author bondli
 * @date 13-10-08
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        routers = lib.get('./routers'),
        functional = common.get('./util.functional'),
        widgets = common.get('./ui.widgets'),
        constants = common.get('./constants'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        global_variable = common.get('./global.global_variable'),
        upload_event = common.get('./global.global_event').namespace('upload2'),

        FolderValidata = require('./upload_file_validata.upload_folder_validata'),
        G4Validata = require('./upload_file_validata.upload_4g_validata'),
        select_folder = require('./select_folder.select_folder'),

        is_newest_version = function () {
            return common.get('./util.plugin_detect').is_newest_version();
        }(),

        tmpl = require('./tmpl'),

        G1 = Math.pow(2, 30),
        G2 = G1 * 2,
        G4 = G1 * 4,
        G32 = G1 * 32;


    var upload_file_check = {

        upload_plugin : '',

        //检查文件大小的合法性
        check_max_files_size : function (files, upload_plugin) {
            var me = this;
            this.upload_plugin = upload_plugin;
            if (files.length > 1) {//选择的文件个数大于1个时，直接进入到任务管理器中，这里不进行32G限制检测
                select_folder.show(files, upload_plugin, 'plugin');
                return;
            }
            var file_size = me._get_file_size(files[0]),
                g4Validata = G4Validata.create(),
                ret;

           // var max_upload_size = query_user.get_cached_user().get_max_single_file_size();
            //max_upload_size = max_upload_size*1024 > 0 ? max_upload_size*1024 : Math.pow(2, 30);

           // g4Validata.add_validata('max_file_size', file_size, max_upload_size);
            ret = g4Validata.run();

            if ( ret ) {
                var $el = $('<p class="box-alert fn-middle"><s class="fn-middle-tag"></s><span class="ui-text">' + ret[0] + '</span></p>');
                var btn = {id: 'CANCEL', text: '确认', klass: 'g-btn-gray', visible: true};
                var dialog = new widgets.Dialog({
                    title: '上传提醒',
                    empty_on_hide: true,
                    destroy_on_hide: true,
                    content: $el,
                    tmpl: tmpl.dialog3,
                    mask_ns: 'gt_4g_tips',
                    buttons: [ btn ],
                    handlers: {
                    }
                });
                dialog.show();
                return;
            }
            else {
                select_folder.show(files, upload_plugin, 'plugin');
                return;
            }
        },

        //获取文件大小
        _get_file_size : function (path) {
            var me = this;
            var file_size = functional.try_it(function () {
                return me.upload_plugin.GetFileSizeString(path) - 0;
            }) || me.upload_plugin.GetFileSize(path) || 0;

            file_size = file_size - 0;
            if (file_size < 0) {
                file_size += G4;
            }

            return file_size;
        },

        //上传前对文件进行检查
        check_start_upload : function(files, upload_plugin, max){
            var me = this;
            this.upload_plugin = upload_plugin;
            var cur_user = query_user.get_cached_user(),
                main_key = cur_user.get_main_dir_key(),
                root_key = cur_user.get_root_key();

            //上传到中转站文件直接上传，不用进入选择目的地
            if(global_variable.get('upload_file_type') == 'temporary') {
                upload_event.trigger('add_upload', upload_plugin, files, {
                    'temporary': true,
                    'ppdir': root_key,
                    'pdir': main_key,
                    'ppdir_name': '微云',
                    'pdir_name': '中转站',
                    'dir_paths': ['中转站'],
                    'dir_id_paths': [main_key]
                });
                routers.go({ m: 'station' });
            } else {
                me.check_max_files_size(files, upload_plugin);
            }


        }

    };

    return upload_file_check;
});