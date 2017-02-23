/**
 * 邮件\外链分享入口模块
 * @author hibincheng
 * @date 2013-09-16
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        ret_msgs = common.get('./ret_msgs'),
        update_cookie = common.get('./update_cookie'),
        urls = common.get('./urls'),
        user_log = common.get('./user_log'),
        query_user = common.get('./query_user'),
        request = common.get('./request'),
        mini_tip = common.get('./ui.mini_tip_v2'),
    // 可分享的文件字节数上限，0表示不限制
        size_limit = 0,

        File = common.get('./file.file_object'),

        create_share_req,

        undefined;

    var share_enter = new Module('share_enter', {

        ui: require('./ui'),

        render: function () {
            if (this._rendered) {
                return;
            }

            this._rendered = true;
        },

        /**
         * 校验
         * @param {File} file
         * @returns {string}
         * @private
         */
        _validate: function (file) {
            //效验兼容笔记
            if(file.is_note && file.is_note()){
                if(file.get_id() == ""){
                    return '未保存的笔记暂时无法分享';
                }
            }/*else{
                if (file.is_broken_file()) {
                    return '不能分享破损的文件';
                }
                else if (file.is_empty_file()) {
                    return '不能分享空文件';
                }
                else if (size_limit > 0 && file.get_cur_size() > size_limit) {
                    return '分享的文件应小于' + File.get_readability_size(size_limit);
                }
            }*/
        },

        /**
         * 判断所选择的文件是否可以被分享
         * @param files 所选择的文件
         * @returns {String} error_msg
         */
        is_sharable: function (files) {
            var err,
                me = this;
            //分享文件上限数判断
            if (files.length > constants.LINK_SHARE_LIMIT) {
                return err = '分享一次最多支持' + constants.LINK_SHARE_LIMIT + '个文件';
            }
           else{
                //每个文件是否可以被分享判断，如果其中有一个不能分享，则此次不能分享
                $.each(files, function (i, file) {
                    if (!file.is_dir() && (err = me._validate(file))) {
                        return false;
                    }
                });
            }



            return err;
        },
        /**
         * 创建要分享文件的链接
         * @param {Array<FileNode>} files 要分享的文件
         * @private
         */
        _create_share_link: function (files, is_client) {
            var me = this;

            var _files = [],
                _dirs = [],
                first_file = files[0],
                share_name = first_file.get_name(),
                share_type,
                pid = first_file.get_pid(),
                is_temporary = first_file.is_temporary && first_file.is_temporary(),
                temporary_info = [];
            if(first_file.is_note && first_file.is_note()) {//笔记
                share_type = files.length > 1? 11 : 2;
            } else if(is_temporary) {//中转站文件
                share_type = 12;
            } else {
                share_type = 0;
            }
            $.each(files, function (i, f) {
                if(is_temporary) {
                    temporary_info.push({
                        dir_key: f.get_pid(),
                        file_id_list: [f.get_id()]
                    })
                } else {
                    if (f.is_dir()) {
                        _dirs.push(f.get_id());
                    } else {
                        _files.push(f.get_id());
                    }
                }
            });

            if (files.length > 1) {
                share_name = share_name + '等' + files.length + '个文件';
            }

            //防止分享多余100个文件
            if (files.length > constants.LINK_SHARE_LIMIT) {
                mini_tip.warn('链接分享一次最多支持' + constants.LINK_SHARE_LIMIT + '个文件');
                return;
            }

            if (create_share_req) {
                create_share_req.destroy();
            }

            var req_body;
            if(is_temporary) {
                req_body = {
                    share_name: share_name,
                    share_type:share_type,
                    dir_info_list: temporary_info
                }
            } else if(first_file.is_note && first_file.is_note() && files.length > 1) {
                //多笔记分享
                req_body = {
                    note_list: _files,
                    share_name: share_name,
                    share_type: share_type
                }
            } else {
                req_body = {
                    pdir_key: pid,
                    dir_key: _dirs,
                    file_id: _files,
                    share_name: share_name,
                    share_type:share_type
                }
            }

            //TODO:创建分享链接cgi联调
            create_share_req = request
                .xhr_post({
                    url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                    cmd: 'WeiyunShareAdd',
                    body: req_body,
                    cavil: true,
                    pb_v2: true
                })
                .ok(function (msg, body) {
                    var link = body['raw_url'],
                        curr_pwd = body['share_pwd'];
                    me._set_share_key(body['share_key']);
                    me.trigger('create_share_success', files, link, curr_pwd);
                })
                .fail(function (msg, ret) {
                    if(is_client && (ret === 190011 || ret === 190051 || ret === 190062 || ret === 190065)) {
                        update_cookie.update(function() {
                            me._create_share_link(files, is_client);
                        });
                    } else {
                        mini_tip.error(msg);
                    }
                })
                .done(function () {
                    create_share_req = null;
                });
        },

        _share_key: '',

        /**
         * 设置当前的sharekey
         */
        _set_share_key: function (share_key) {
            this._share_key = share_key;
        },

        /**
         * 获取当前的sharekey
         */
        _get_share_key: function () {
            return this._share_key;
        },

        /**
         * 分享文件，外部统一入口
         * @param files
         */
        start_share: function (files, is_client) {
            if (!files || files.length === 0) {
                console.log('参数错误');
            }
            if (!$.isArray(files)) {
                files = [files];
            }


            var err = this.is_sharable(files);

            if (err) {
                mini_tip.warn(err);
                return;
            }
            if (!this._rendered) {
                this.render();
            }

            this._create_share_link(files, is_client);
        }
    });

    return share_enter;

});