/**
 * 上传控件组件
 * @author svenzeng
 * @date 13-3-1
 */


define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        View = require('./view'),
        Upload_class = require('./Upload_class'),
        msg = require('./msg'),
        upload_route = require('./upload_route'),
        Validata = require('./upload_file_validata.upload_file_validata'),
        upload_static = require('./tool.upload_static'),
        upload_cache = require('./tool.upload_cache'),

        functional = common.get('./util.functional'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),

        disk_mod = require('disk'),
        file_list_ui = disk_mod.get('./file_list.ui'),

        c = lib.get('./console'),
        random = lib.get('./random'),

        plugin_detect = common.get('./util.plugin_detect'),

        G4 = Math.pow(2, 30) * 4,
        G2 = Math.pow(2, 30) * 2,
        G32 = Math.pow(2, 30) * 32,

        burst_num = constants.IS_APPBOX ? 8 : 50,//添加上传频率
        is_newest_version = function () {//频繁验证，在大批量上传时，有性能有问题；这里用一个缓存读取
            return plugin_detect.is_newest_version();
        }(),
        //appbox等控件升级后再开放,ie控件小于1.0.3.17，webkit控件小于1.0.0.11就不是tpmini了
        is_support_tpmini = function () {
            if(constants.IS_APPBOX){ //appbox暂时还不支持
                return false;
            }
            var cur_ver = plugin_detect.get_cur_upload_plugin_version();
            if($.browser.msie || window.ActiveXObject !== undefined) {
                return (cur_ver < 10317) ? false : true;
            }
            else{
                return (cur_ver < 10011) ? false : true;
            }
        }();

    var Upload = Upload_class.sub(function (file_path, upload_plugin, attrs, folder_id) {
        this.path = file_path; //文件路径
        this.file_name = this.get_file_name();  //文件名
        this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
        this.pdir = attrs.pdir;   //上传到指定的目录ID

        this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
        this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称

        this.pdir_create_ret = attrs.pdir_create_ret; //父目录创建结果
	    this.temporary = ''; //下线中转站 //!!attrs.temporary; //是否是中转站文件上传
        this.upload_plugin = upload_plugin; //上传插件
        this.local_id = random.random(); //文件上传的local_id
        this.del_local_id = random.random(); //用来删除缓存队列里的id
        this.state = null;  //上传状态
        this.file_size = this.get_file_size(); //文件总大小
        this.file_sign_update_process = 0; //当前签名进度
        this.code = 0; //当前错误吗
        this.log_code = 0;  //上报的错误吗
        this.processed = 0; //已上传进度
        this.event_param = null;
        this.can_pause = true; //能暂停
        this.view = null; //视图
        this.file_sign_done_flag = false;    //计算回调次数, 修改客户端偶尔扫描完成之后不回调的bug(客户端现在是多次回调).
        this.pause_mode = 0;    //是否点了暂停, 暂时用来上报.

        this.is_retry = false; //是否重新来一次上传

        this.is_qq_receive = attrs.is_qq_receive || false; //添加一个是否从qq客户端接收到的文件上传

        this.validata = Validata.create();

        this.validata.add_validata('check_name',this.file_name);//名称校验

        this.validata.add_validata('check_video',this.file_name);//视频文件

        //上传大小的限制从后台获取
        var max_upload_size = query_user.get_cached_user().get_max_single_file_size();
        max_upload_size = max_upload_size*1024 > 0 ? max_upload_size*1024 : Math.pow(2, 30);
        if(constants.IS_APPBOX) {
            var m = navigator.userAgent.match(/QQ\/([\d\.]+)/i),
                version = m && m[1];
            if(version && parseInt(version[0], 10) < 7) {
                this.validata.add_validata('plugin_max_size', this.file_size, Math.pow(2, 30));
            }
        }
	    this.validata.add_validata('max_single_file_size', this.file_size); //单文件大小限制验证
	    this.validata.add_validata('remain_flow_size', this.file_size); //当日上传流量限制验证

        if (folder_id) {
            this.folder_id = folder_id;
        }
        this.init(attrs.dir_id_paths, attrs.dir_paths, attrs.cache_key, attrs.view_key);
    });

    Upload.interface('states', $.extend({}, Upload_class.getPrototype().states));
    /**
     * 是否控件上传
     */
    Upload.interface('is_plugin_upload', function () {
        return true;
    });
    /**
     * 是否妙传
     */
    Upload.interface('is_miaoc', function () {
        return this.file_exist;
    });

    /**
     * 是否tpmin加速
     */
    Upload.interface('is_tpmini', function () {
        //appbox等控件升级后再开放,ie控件小于1.0.3.17，webkit控件小于1.0.0.11就不是tpmini了
        if(!is_support_tpmini){
            return false;
        }
        return this.tp_key;
    });

    /**
     * 是否需要自动保存进度，防止断电等情况下
     */
    Upload.interface('need_auto_save_process', function () {
        return false; //由服务端返回nextOffset来续传
        //return this.file_size>=Math.pow(2, 20) * 500 && !this.file_exist;
    });

    /**
     * 停止上传
     * return {boolean} true停止上传成功， false停止上传失败
     */
    Upload.interface('stop_upload', function () {
        var me = this,
            ret;
        if (me.upload_plugin && (me.local_id === 0 || me.local_id > 0)) {
            //判断如果是扫描状态下cancel的，需要停止扫描
            if(me.state === 'file_sign_update_process' || me.state ==='error' && me.processed == 0){
                try{
                    me.upload_plugin.StopFileSign(me.local_id);
                    ret = 0;
                } catch(e){
                    c.error('停止扫描错误:', (typeof me.local_id), me.local_id);
                }
            } else if(me.state === 'upload_file_update_process' || me.state ==='error'){
                ret = me.upload_plugin.StopUpload(me.local_id);//WEB浏览器
                if (0 !== ret) {
                    try {
                        me.upload_plugin.StopUpload(me.local_id + ''); //APPBOX
                        ret = 0;
                    } catch (xe) {
                        c.error('停止上传错误:', (typeof me.local_id), me.local_id, ret);
                    }
                }
            }
        }
        return ret === 0 ;
    });

    /**
     * 自己能否暂停
     */
    Upload.interface('can_pause_self', function () {
        if(this.state === 'upload_file_update_process' && this.stop_upload()){
            return true;
        }
        return false;
    });

    /**
     * 正真重试动作
     */
    Upload.interface('resume_file_local', function () {
        var ret = this.upload_plugin.ResumeFileLocal(this.local_id); //继续上传的时候不重新分配local_id
        if (ret !== 0) {//续传失败
            try {
                this.upload_plugin.ResumeFileLocal(this.local_id + '');
            } catch (xe) {
                c.error('续传出错:', (typeof this.local_id), this.local_id, ret);
                this.change_state('pause');
            }
        }
    });
    /**
     * 页面断开，重新续传 ，返回 local_id;
     */
    Upload.interface('resume_file_remote', function () {
        var me = this;
        //local_id
        //新增设置每个分片大小
        if(upload_route.type === 'webkit_plugin'){
            me.upload_plugin.BreakSize = 128*1024;
            c.log('resume uplaod BreakSize:128k');
        }
        //webkit下大于2G的需要新的续传接口,APPBOX下也没有这个方法
        if (upload_route.type === 'webkit_plugin' && this.file_size > G2 && !constants.IS_APPBOX) {
            return this.upload_plugin.ResumeFileV2(this.server, this.port, this.check_key, this.file_sha, this.file_key, this.path, this.processed, 0, 'weiyun');
        }
        else {
            return this.upload_plugin.ResumeFile(this.server, this.port, this.check_key, this.file_sha, this.file_key, this.path, this.processed, 'weiyun');
        }
    });

    Upload.interface('states.pre_file_sign', function () {
        if(!this.is_pre_file_sining) {
            this.is_pre_file_sining = true;
            var local_id = this.upload_plugin.FileSign(this.path, 'weiyun'),    //开始控件签名
                __self = this,
                callee = arguments.callee;
           // c.log('pre filesign start:', local_id,this.file_name);
            if (!local_id || local_id == -1) {   //客户端的bug, 扫描可能未发起.
                return setTimeout(function () {
                    return callee.call(__self);
                }, 1000);
            }

            this.set_local_id(local_id);
        }
    });

    Upload.interface('don_next_task_sign', function () {
        var cache = upload_cache.get_up_main_cache();
        var next_task = cache.get_next_task();
        if(next_task) {
            next_task.change_state('pre_file_sign');
        }
    });

    Upload.interface('states.start', functional.after(Upload_class.getPrototype().states.start, function () {
        if(this.is_qq_receive){ //上传时就让上传任务管理器最大化
            View.max();
        }
        if (this.file_size < Math.pow(2, 20) * 20) {//小于20M的文件不显示扫描.
            this.no_show_sign = true;
        }
        if (this.is_retry) {  //重新开始上传也不显示扫描
            this.no_show_sign = true;
        }
        if(this.pdir_create_ret) {
            this.change_state('error', this.pdir_create_ret);
            return;
        }
        //之前已扫描过，中转站文件直接申请上传
        if(this.file_sha || this.file_md5) {
            this.file_sign_done_flag = false;
            this.change_state('file_sign_done', {
                Md5: this.file_md5,
                SHA: this.file_sha
            });
            return;
        }

        if(!this.is_pre_file_sining) {
            var local_id = this.upload_plugin.FileSign(this.path, 'weiyun'),    //开始控件签名
                __self = this,
                callee = arguments.callee;
            c.log('filesign start:', local_id,this.filename);
            if (!local_id || local_id == -1) {   //客户端的bug, 扫描可能未发起.
                return setTimeout(function () {
                    return callee.call(__self);
                }, 1000);
            }

            this.set_local_id(local_id);
        } else {
            this.is_pre_file_sining = false;
        }
    }));

    /**
     * 重试的正真动作
     */
    Upload.interface('re_start_action', function () {
        this.stop_upload();
        this.file_sign_done_flag = false;//标识未扫描完成
        if (this.file_md5 && this.file_sha) {
            this.resume_file_local();
        } else {
            var local_id = this.upload_plugin.FileSign(this.path, 'weiyun'),    //开始控件签名
                __self = this,
                callee = arguments.callee;
            if (!local_id) {   //客户端的bug, 扫描可能未发起.
                return setTimeout(function () {
                    return callee.call(__self);
                }, 1000);
            }
            this.set_local_id(local_id);
        }
    });
    /**
     * 释放控件资源
     */
    Upload.interface('release_plugin', function () {
        try{
            this.upload_plugin.ReleaseLocal(constants.IS_APPBOX ? (this.local_id + '') : this.local_id);
        } catch(xe){
            c.error('释放控件资源错误:', (typeof this.local_id), this.local_id, xe);
        }
    });

    /**
     * 高亮文件
     */
    Upload.interface('highlight_files', function () {
        var me = this;
        var file_ids = me.file_id;//me.get_file_id_by_dir();
        if (file_ids && file_ids.length) {
            file_list_ui.highlight_$item(file_ids);//高亮完成文件
        }
    });

    /**
     * 上传完成后做的一些特殊处理
     */
    Upload.interface('after_done', function () {
        var me = this;
        if(this.is_qq_receive){
            me.highlight_files();
        }
    });

    /**
     * 是否重新来一次上传
     */
    Upload.interface('get_is_retry', function () {
        return this.is_retry;
    });

    /**
     * 设置重新来一次上传
     */
    Upload.interface('set_retry', function () {
        this.is_retry = true;
    });

    Upload.interface('states.start_upload', function (rsp_body, data) {   //这次是真的开始上传
        //code by bondli 增加上传开始时间点记录
        var me = this;
        me.start_time = +new Date();
        if (rsp_body && data) {
            me.server = rsp_body.server_name;
            me.port = rsp_body.server_port;
            me.new_name = rsp_body.filename;
            me.check_key = rsp_body.check_key;
            me.file_key = rsp_body.file_key;
            me.file_md5 = data.file_md5;
            me.file_sha = data.file_sha;
            me.file_exist = rsp_body.file_exist;
            //增加tp_key
            me.tp_key = rsp_body.tp_key;
            this.release_plugin();//获取到上传的存储连接后，释放控件上传线程
        }
        if (!me.server && !me.file_exist) {//未请求过server，调用者可能来自（远程服务爆出的容量不足错误，这个情况下是请求CGI是没有 返回这些数据的）
            return setTimeout(function () {
                me.change_state('error', me.code);
            }, 200);
        }
        if(!me.file_exist){//非妙传用户，打印server
            c.log('start_upload url:',me.server);
        }
        else{ //秒传的话，直接提示成功
            me.change_state('done');
            return;
        }

        //新增设置tp_key
        if(!me.file_exist && me.tp_key){
            try{
                me.upload_plugin.ThirdPartyUploadKey = 'tp_key='+me.tp_key;
                c.log('upload ThirdPartyUploadKey:',me.tp_key);
                //tpmini下设置分片大小为1M
                me.upload_plugin.BreakSize = 1024*1024;
                me.upload_plugin.UseServerBlockSize = false;
                c.log('upload BreakSize:1M');
            }
            catch(e){
                c.log('upload tpkey');
            }
        }
        else {
            //新增设置每个分片大小为128K
            if(upload_route.type === 'webkit_plugin'){
                me.upload_plugin.BreakSize = 128*1024;
                c.log('upload BreakSize:128k');
            }
        }

        //大于2G的走新接口
        if (!constants.IS_APPBOX) {
            var local_id = me.upload_plugin.UploadFileV2(this.server, this.port, this.check_key, this.file_sha, this.file_key, this.path, 'weiyun', 0, 0),
                callee = arguments.callee;
        }
        else {
            var local_id = me.upload_plugin.UploadFile(this.server, this.port, this.check_key, this.file_sha, this.file_key, this.path, 'weiyun'),
                callee = arguments.callee;
        }

        if (!local_id) {   //客户端的bug, 上传可能未发起.
            return setTimeout(function () {
                return callee.call(me, rsp_body, data);
            }, 1000);
        }

        this.set_local_id(local_id); //local_id已变化,  重新分配.
        if(!this.folder_id) {
            this.don_next_task_sign(); //先禁掉预扫描
        }
    });


    var add_upload = function (upload_plugin, files, attrs) {   //添加上传对象
        View.show();
        setTimeout(function () {//延时执行，给浏览器以喘气的机会
            var len = files.length;
            functional.burst(files,function (path) {
                var upload_obj = Upload.getInstance(path, upload_plugin, attrs);
                upload_obj.change_state('wait');    //状态转为wait，放入队列等待.
                if ((len -= 1) === 0) {
                    upload_obj.events.nex_task.call(upload_obj);
                }
            }, burst_num , 63).start();
        }, 16);
    };


    var add_resume = function (files, upload_plugin) { //断点续传
        //var cache = upload_cache.get()
        //info = cache.get_info();
        //cache.set_info('undone', info.undone + files.length);
        //cache.set_info('length', info.length + files.length);
        if (files.length) {
            View.show();
        }
        $.each(files, function () {
            //var obj = JSON.parse(this);    //转化store中读取的记录
            var obj = this;    //转化store中读取的记录
            var attrs = {
                'ppdir' : obj.ppdir,
                'pdir': obj.pdir,
                'ppdir_name': obj.ppdir_name,
                'pdir_name': obj.pdir_name
            };
            var upload_obj = Upload.getInstance(obj.path, upload_plugin, attrs); //生成上传对象
            functional.try_it(function () {
                upload_obj.change_state('resume_pause', obj);   //状态转为续传
            });
        });

    };

    return {
        get_class: function () {
            return Upload;
        },
        add_resume: add_resume,
        add_upload: add_upload
    }
});