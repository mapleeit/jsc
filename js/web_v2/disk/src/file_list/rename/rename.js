/**
 * 文件重命名
 * @author jameszuo
 * @date 13-3-4
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        date_time = lib.get('./date_time'),
        covert = lib.get('./covert'),

        constants = common.get('./constants'),
        request = common.get('./request'),
        Module = common.get('./module'),
        File = common.get('./file.file_object'),

        renaming_node, // 当前正在编辑的FileNode
        renaming_callback, // 当前绑定的回调
        renaming_scope, // 回调的this作用域

        deep_limit = constants.DIR_DEEP_LIMIT, // 创建目录的层级上限

        undefined;

    var rename = new Module('disk_file_rename', {

        ui: require('./file_list.rename.ui'),

        render: function () {
            this.on('deactivate', function () {
                this.close_edit();
            });
        },

        /**
         * 判断当前重命名模块是否处于空闲状态。因为它是单例的，有可能正在进行编辑或异步保存，这时要避免执行。
         * @return {Boolean} idle
         */
        is_idle : function(){
            // 考虑到健壮性，还是去掉正在编辑结点的判断，只判断异步保存。
            // 因为这里的start_edit是会同步调用close_edit的，不会出现冲突问题。
            return !this._saving;// && !renaming_node;
        },

        /**
         * 开始编辑文件名
         * @param {FileNode} node
         * @param {Function} callback (optional) 编辑完成的回调，参数为success、name、properties
         * @param {Object} scope (optional) callback的执行域
         */
        start_edit: function (node, callback, scope) {
            // rename操作是异步的，可能会导致一个rename的save进行中，另一个rename开始了，而最后的回调却修改了后rename的那个
            // 这里防止异常，应同时只允许一个rename正在进行
            if(this._saving){
                return;
            }

            // 未渲染,则渲染
            this.render();

            // 先取消已启动的改名动作
            this.close_edit();

            renaming_node = node;
            renaming_callback = callback;
            renaming_scope = scope;

            this.trigger('start', renaming_node);
        },

        /**
         * 取消|结束正在进行中的编辑(已发出的请求无法取消)
         * @param {String} new_name 新文件名(为空表示撤销)
         * @param {Object} properties 新的文件属性，仅在创建时有效
         */
        close_edit: function (new_name, properties) {
            if (renaming_node) {

                new_name = new_name || renaming_node.get_name();

                this.trigger('done', renaming_node, new_name);

                if(renaming_callback && $.isFunction(renaming_callback)){
                    renaming_callback.call(renaming_scope, !!new_name, new_name, properties);
                }

                renaming_node = null;
            }
        },

        /**
         * 尝试保存文件名(可能被拒绝, 要做好心理准备)
         * @param {String} new_name
         * @param {Boolean} keep_focus 出现错误时，是否保持输入状态
         */
        try_save: function (new_name, keep_focus) {
            if (renaming_node) {

                var changed = renaming_node.is_tempcreate() || new_name && new_name !== renaming_node.get_name();

                if (changed) {
                    var err = this._check_name(new_name);
                    if(!err && renaming_node.is_tempcreate()){
                        err = this._check_deep(renaming_node.get_parent());
                    }
                    if (err) {

                        // 这里触发deny事件，表示不允许改为这个文件名，请重新输入；触发error事件，表示修改失败，然后就没有然后了。
                        // this.trigger('deny', renaming_node, err);
                        this.trigger('error', err);

                        if (!keep_focus) {
                            this.close_edit();
                        }
                    } else {

                        this.trigger('temp_save', renaming_node, new_name);

                        // 真正的保存
                        this._try_save(new_name);
                    }
                } else {
                    this.close_edit();
                }
            }
        },

        /**
         * 请求CGI保存文件名
         * @param {String} new_name
         */
        _try_save: function (new_name) {
            var me = this;

            if(me._saving) {
                return false;
            }

            var ppdir_key = renaming_node.get_parent().get_parent().get_id();
            var pdir_key = renaming_node.get_parent().get_id();

            var
                data = {
                    ppdir_key: ppdir_key,
                    pdir_key: pdir_key
                },
                cmd,
                encode = encodeURIComponent;

            if (renaming_node.is_dir()) {
                if(renaming_node.is_tempcreate()){
                    cmd = 'DiskDirCreate';
                    data.dir_name = new_name;
                }else{
                    cmd = 'DiskDirAttrModify';
                    data.dir_key = renaming_node.get_id();
                    data.dst_dir_name = new_name;
                    data.src_dir_name = renaming_node.get_name();
                }
            } else {
                cmd = 'DiskFileBatchRename';
                data['file_list'] = [{
                    file_id: renaming_node.get_id(),
                    filename: new_name,
                    src_filename: renaming_node.get_name()
                }];
            }

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/qdisk_modify.fcg',
                cmd: cmd,
                body: data,
                pb_v2: true,
                cavil: true
            })

                .ok(function (msg, body) {
                    var old_name = renaming_node.get_name();
                    var properties = null;
                    var result = body['file_list'] && body['file_list'][0] || {};
                    if(renaming_node.is_tempcreate()){ //创建目录
                        properties  = {
                            id : body.dir_key,
                            name : new_name,
                            create_time : body.dir_ctime,
                            modify_time : body.dir_mtime
                        };
                    } else if(result.retcode) {
                        me.trigger('error', result.retmsg);
                        me.close_edit();
                        return;
                    }
                    me.trigger('ok', renaming_node, old_name, new_name);
                    me.close_edit(new_name, properties);
                })

                .fail(function (msg) {
                    me.trigger('error', msg);
                    me.close_edit();
                })

                .done(function () {
                    me._saving = false;
                });

            me._saving = true;
        },

        /**
         * 检查文件名是否有效
         * @param {String} new_name
         */
        _check_name: function (new_name) {
            var err = File.check_name(new_name);
            if (!err) {
                new_name = new_name.toLowerCase();
                var siblings = renaming_node.get_parent().get_kid_nodes();
                var name_conflict = collections.any(siblings, function (sib_node) {
                    if (sib_node !== renaming_node && sib_node.get_name().toLocaleLowerCase() === new_name) {
                        return true;
                    }
                });
                if (name_conflict) {
                    err = (renaming_node.is_dir() ? '文件夹' : '文件') + '名有冲突，请重新命名';
                }
            }
            return err;
        },

        _check_deep: function (dir_node) {
            var par_len = 0;
            while (dir_node = dir_node.get_parent()) {
                par_len++;
            }
            if (par_len > deep_limit) {
                return '文件夹路径过深，请重新创建';
            }
        }
    });

    return rename;
});