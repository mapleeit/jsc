/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-1-6
 * Time: 上午10:13
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        console = lib.get('./console'),
        Module = common.get('./module'),
        widgets = common.get('./ui.widgets'),
        update_cookie = common.get('./update_cookie'),
        user_log = common.get('./user_log'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        request = common.get('./request'),
        tmpl = require('./tmpl'),
        mini_tip = common.get('./ui.mini_tip'),
        undefined;

    require('dimensional_code_css');

    var file_qrcode = new Module('file_qrcode', {
        _ui: require('./ui'),

        render: function () {

        },
        show:function(files, is_client){
            var me = this,
                file = files[0],
                name = file.get_name(),
                size = file.get_readability_size(true),
                icon = file.get_type() || this.get_default_icon();
            me.create_file_qrcode_req(file,name,size,icon,is_client);
        },

        get_default_icon: function() {
            if(constants.IS_OLD) {
                return 'image';
            }
            return 'nor';
        },

        show_file_qrcode: function (url, name, size, icon) {
            var me = this;
            me._ui.show(url, name, size, icon);
        },

        //TODO:创建分享链接cgi联调
        create_file_qrcode_req: function (file,name,size,icon,is_client) {
            var me=this,
                _files = [],
                pid = file.get_pid();

            _files.push(file.get_id());
            var req_body;
            if(file.is_temporary && file.is_temporary()) {
                req_body = {
                    "qr_flag":1,//是否是二维码外链 0表示不是，1表示是
                    "share_type":12,//12表示中转站文件
                    dir_info_list: [{
                        dir_key: pid,
                        file_id_list: _files
                    }]
                }
            } else {
                req_body = {
                    pdir_key: pid,
                    file_id: _files,
                    "qr_flag": 1,//是否是二维码外链 0表示不是，1表示是
                    "share_type": 3,//0表示原始外链，2表示笔记分享，3表示单文件临时外链分享（外链有效期5分钟），4表示笔记临时外链分享
                    "share_business": 0 //0表示微云外链，1表示qzone分享

                };
            }
            request
                .xhr_post({
                    url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                    cmd: 'WeiyunShareAdd',
                    body: req_body,
                    cavil: true,
                    pb_v2: true
                })
                .ok(function (msg, body) {
                    var _url = body['raw_url'];
                    me.show_file_qrcode(_url, name, size, icon);
                })
                .fail(function (msg, ret) {
                    if(!!is_client && (ret === 190011 || ret === 190051 || ret === 190062 || ret === 190065)) {
                        update_cookie.update(function() {
                            me.create_file_qrcode_req(file,name,size,icon,is_client);
                        });
                    } else {
                        mini_tip.error(msg);
                    }
                })
        }

    });

    return file_qrcode;
});
