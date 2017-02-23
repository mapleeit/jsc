/**
 * tpmini加速上传的文件相关操作模块
 * @author hibincheng
 * @date 2013-12-19
 */
define(function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        Module = common.get('./module'),
        request = common.get('./request'),
        ContextMenu = common.get('./ui.context_menu'),
        user_log = common.get('./user_log'),
        remove = require('./file_list.file_processor.remove.remove'),

        REQUEST_CGI = 'http://disk.cgi.weiyun.com/list.fcg',

        selected_cls = 'ui-selected',

        update_req,

        undefined;

    var tpmini = new Module('tpmini', {

        /**
         * 删除（tpmini上传失败的文件才能删除）
         * @param e
         * @private
         */
        _on_delete: function(e) {
            e.preventDefault();
            var node = this._context_node;
            if (node) {
                remove.remove_confirm([node], '', true);
                user_log('RIGHTKEY_MENU_DELETE');
            }
        },

        /**
         * 更新tpmini上传状态（是否已上传到去端，失败等）
         * @param file
         * @returns {*}
         * @private
         */
        _update_status: function(file) {
            var file_id = file.get_id(),
                file_name = file.get_name(),
                pdir_key = file.get_pid(),
                def = $.Deferred(),
                me = this;

            if(update_req) {
                update_req.destroy();
            }

            update_req = request
                .xhr_get({
                    url: REQUEST_CGI,
                    cmd: 'update_tpmini_status',
                    cavil: true,
                    body: {
                        file_list: [{
                            file_id: file_id,
                            file_name: file_name,
                            pdir_key: pdir_key
                        }]
                    }
                })
                .ok(function(msg, body) {
                    var file_info = body.file_list[0];
                    me._update_file_info(file, file_info);
                    def.resolve(file_info);
                })
                .fail(function(msg, ret) {
                    def.reject(msg, ret);
                })
                .done(function() {
                    update_req = null;
                });

            return def;

        },

        _update_file_info: function(file, file_info) {

            file.set_size(file_info.file_size);
            file.set_cur_size(file_info.file_curr_size);
            file.set_upload_by_tpmini_fail(file_info.tp_fail);
        },
        /**
         * 获取右键菜单
         * @private
         */
        _get_context_menu : function(){
            var menu = this.context_menu,
                items,
                me;
            if(!menu){
                me = this;
                items = [{
                    id: 'tpmini_delete',
                    text: '删除',
                    icon_class: 'ico-del',
                    click: function(e) {
                        me._on_delete(e);
                    }
                }];
                menu = this.context_menu = new ContextMenu({
                    width : 150,
                    items: items
                });

                menu.on('hide', function() {
                    me._context_node = null;
                    me._$on_item && me._$on_item.removeClass(selected_cls);
                    me._$on_item = null;
                });
            }
            return menu;
        },

        update_status: function(file) {
            if(!file.is_upload_by_tpmini()) {
                console.error('需要是tpmini加速上传的文件有可以刷新状态');
                return;
            }
            return this._update_status(file);
        },

        /**
         * 右键点击记录时弹出菜单
         * @param  node
         * @param  $on_item
         * @param {jQueryEvent} e
         */
        show_context_menu : function(node, $on_item, e){
            e.preventDefault();
            this._context_node = node;
            this._$on_item = $on_item;

            var menu = this._get_context_menu();
            $on_item.addClass(selected_cls)
            menu.show(e.pageX, e.pageY);
        }
    });

    return tpmini;
});