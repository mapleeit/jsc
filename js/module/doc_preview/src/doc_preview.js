/**
 * 图片、文档预览
 * @author jameszuo
 * @date 13-3-15
 * todo 图片预览会话超时检测
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        ret_msgs = common.get('./ret_msgs'),
        query_user = common.get('./query_user'),
        global_event = common.get('./global.global_event'),
        session_event = common.get('./global.global_event').namespace('session'),

        tmpl = require('./tmpl'),

        preview_instance,

        undefined;

    require('office_css');

    var doc_preview = new Module('doc_preview', {

        ui: require('./ui'),

        /**
         * 预览文件
         * @param {File|FileNode} file
         */
        preview: function (file) {
            var me = this;

            if (file.is_preview_doc()) {

                me.render();


                if (query_user.check_cookie()) {

                    me._preview(file);

                } else {

                    this._require_login(ret_msgs.INVALID_SESSION, file);

                }
            }
        },

        _preview: function (file) {
            var me = this;

            me._close();

            preview_instance = me.ui.preview(file);

            // 刷新
            preview_instance.on('reload', function () {
                me._preview(file);
            });

            // 预览出错
            preview_instance.listenToOnce(global_event, 'preview_document_error', function (ret) {
                // 是否需要登录验证
                var invalid_session = ret === ret_msgs.INVALID_SESSION || ret === ret_msgs.INVALID_INDEP_PWD;

                preview_instance.error(ret, !invalid_session);

                if (invalid_session) {
                    // 关闭当前的预览
                    preview_instance.close();

                    me._require_login(ret, file);
                }
            });
        },

        _close: function () {
            if (preview_instance) {
                preview_instance.off().stopListening(global_event, 'preview_document_error').close();
                preview_instance = undefined;
            }
        },

        _require_login: function (ret, file) {
            var me = this;
            // 弹出登录框
            if (ret === ret_msgs.INVALID_SESSION) {
                console.debug('文档预览触发了session_timeout事件，已监听回调');
                session_event.trigger('session_timeout', function () {
                    me.preview(file);
                });
            } else if (ret === ret_msgs.INVALID_INDEP_PWD) {
                console.debug('文档预览触发了invalid_indep_pwd事件，已监听回调');
                session_event.trigger('invalid_indep_pwd', function () {
                    me.preview(file);
                });
            }
        }
    });

    return doc_preview;
});