/**
 * 删除虚拟文件
 * @author jameszuo
 * @date 13-7-4
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        text = lib.get('./text'),

        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        request = common.get('./request'),
        user_log = common.get('./user_log'),

        undef;


    var vir_remove = new Module('disk_file_list_vir_remove', {

        remove_confirm: function (node, thing, desc, op) {
            var me = this,
                files = [node],

                unit = files.length > 1 ? '些' : '个',

                msg = text.format('确定删除这{unit}{thing}吗？', { unit: unit, thing: thing }),

                def = $.Deferred();

            widgets.confirm('删除文件', msg, '已删除的文件可以在回收站找到', function () {
                me.remove(node, op, def);
            }, function () {
                def.reject()
            });

            return def;
        },

        remove: function (node, op, def) {
            def = def || $.Deferred();

            var data = {
                ppdir_key: node.get_parent().get_pid(),
                pdir_key: node.get_pid(),
                delete_list: [
                    {
                        file_id: node.get_id(),
                        filename: node.get_name() || ''
                    }
                ]
            };

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/weiyun_other.fcg',
                cmd: 'VirtualDirBatchItemDelete',
                body: data,
                cavil: true,
                resend: true,
                pb_v2: true
            })
                .ok(function (msg, body) {
                    var result = body.ret_list[0];
                    if(result.retcode == 0) {

                        node.remove();

                        def.resolve();
                    } else {
                        def.reject(result.retmsg, result.retcode);
                    }
                })
                .fail(function (msg, ret) {
                    def.reject(msg, ret);
                });

            if (op) {
                user_log(op);
            }

            return def;
        }

    });

    return vir_remove;
});