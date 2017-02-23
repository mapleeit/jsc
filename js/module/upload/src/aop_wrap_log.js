define(function (require, exports, module) {

    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        c = lib.get('./console').namespace('upload2'),
        functional = common.get('./util.functional'),
        plugin_detect = common.get('./util.plugin_detect'),
        user_log = common.get('./user_log'),
        stat_log = common.get('./stat_log'),
        constants = common.get('./constants'),
        Static = require('./tool.upload_static'),
        Cache = require('./tool.upload_cache'),
        upload_route = require('./upload_route'),

        normal_code = [ //正常逻辑错误,当成功上报
            1000001, 1000002, 1000003, 1000004,1000005,1000006,1000007,1000008,1000009,1000010,1000011,1000012,1000013,
            1024,1026, 1053, 1083, 1051, 1028, 1088, 100027, 8, 16, 17, 1029, 101, 102,
            -5950, 2, 3,  //文件被选入了上传队列中，但是用户在文件还没有被扫描的时候就删除了
            -5999, 6,  //文件正在上传过程中被删除了
            32252995,   //上传过程中删除了文件所在目录
            1019,   //扫描过程中删除了上传目录，导致CGI返回了错误
            92260005,  //文件上传过程中被修改
            1016,    //新用户一进页面就上传图片到相册
            32,     //另一个程序正在使用此文件，进程无法访问
            21,      //用户传U盘中的文件，U盘不稳定，导致控件读取文件失败
            1392,     //用户文件或目录损坏，无法读取
            53, 87,   //找不到网络,网络文件不可读
            200,     //请求成功
            190040, 190049, 190067,   //UIN在黑名单中，文件在黑名单中，文件敏感词
            190072,//新疆或者国外地区受限了
            1126, //文件超过大小限制，逻辑错误
            1127, //今日文件上传量已达到上限，请明日重试
            5        //文件没有读取权限，估计是被其他程序占用
        ],
        get_plugin_version = function () { //获取控件的版本号
            if(constants.IS_APPBOX){
                if(window.external.GetVersion){
                    return 'appbox-' + window.external.GetVersion();
                }else{
                    return 'appbox';
                }
            }
            switch (upload_route.type) {
                case('active_plugin'):
                    return plugin_detect.get_ie_plugin_version();
                case('webkit_plugin'):
                    //1.0.0.4以前的版本通过plugin_detect获取不到
                    var v = plugin_detect.get_webkit_plugin_version();
                    if( v === '0'){
                        try{
                            return upload_route.upload_plugin.Version;
                        }
                        catch(e){
                            return 0;
                        }
                    }
                    return v;
                default :
                    return '-';
            }
        },



        wrap_log = function (Upload) {

            Upload.getPrototype().dom_events.click_cancel = functional.before(Upload.getPrototype().dom_events.click_cancel, function () {
                if (!this.is_upload()) {
                    return;
                }
                var cache = this.get_cache(),
                    process = cache[this.local_id];

                if (!process) {    //删除上传错误的, 不上报
                    return; //这里要改;
                }
                if (process.state === 'wait') {    //还未开始上传的.
                    return user_log('DISK_UPLOAD_CANCEL'); //;
                }

                return user_log('DISK_UPLOAD_HAS_DATA_CANCEL');  //已经开始上传的.

            });

            //暂停
            Upload.getPrototype().dom_events.click_pause = functional.before(Upload.getPrototype().dom_events.click_pause, function () {
                //user_log('UPLOAD_FILE_MANAGER_PAUSE');
                this.transresult=1;
                stat_log.upload_stat_report_41(this,get_plugin_version());
                if (this.is_upload()) {
                    user_log('UPLOAD_FILE_MANAGER_PAUSE');
                }
                else{
                    user_log('DOWNLOAD_FILE_MANAGER_PAUSE');
                }
            });

            //重试
            Upload.getPrototype().dom_events.click_continuee = functional.after(Upload.getPrototype().dom_events.click_continuee, function () {
                if (this.is_upload()) {
                    user_log('UPLOAD_FILE_MANAGER_CONTINUE');
                }
            });

            //续传
            Upload.getPrototype().dom_events.click_resume_continuee = functional.after(Upload.getPrototype().dom_events.click_resume_continuee, function () {
                user_log('UPLOAD_FILE_MANAGER_RESUME');
                //记录任务的开始时间
                if(!this.is_upload()){
                    this.startTime=+new Date();
                }else{
                    this.start_time=+new Date();
                }

                this.start_file_prcessed=this.processed;//本次传输是从什么时候开始的．


            });

            //展开上传管理器
            Static.dom_events.click_to_max = functional.after(Static.dom_events.click_to_max, function () {
                user_log('UPLOAD_FILE_MANAGER_OPEN', 0);
            });

            //收拢上传管理器
            Static.dom_events.click_to_min = functional.after(Static.dom_events.click_to_min, function () {
                user_log('UPLOAD_FILE_MANAGER_CLOSE', 0);
            });

            Static.dom_events.click_clear_all = functional.after(Static.dom_events.click_clear_all, function () {
                var text = Cache.get_close_btn_text();
                if (text === '全部取消' || text === '取消') {//全部取消-取消
                    user_log('UPLOAD_FILE_MANAGER_CANCEL', 0);
                } else {//完成
                    user_log('UPLOAD_FILE_MANAGER_DONE');
                }
            });
            //全部重试统计
            Static.click_re_try_all = functional.after(Static.click_re_try_all, function () {
                user_log('UPLOAD_FILE_MANAGER_ALL_RETRY', 0);
            });


            Upload.getPrototype().states.error = functional.after(Upload.getPrototype().states.error, function (error_code) {
                this.transresult=3;

                //上传文件夹，不上报
                if (this.is_upload_folder()){
                    return;
                }

                stat_log.upload_stat_report_41(this,get_plugin_version());
                if (!this.is_upload()) {
                    return;
                }
                var rpt_data = {
                    "extInt1": this.start_time ? (+new Date()) - this.start_time : 0,
                    "extInt2": this.log_code,
                    "extInt3": this.file_type,//1:文件 2:文件夹
                    "str_file_size": this.file_size + '',
                    //"app_version": get_plugin_version(), //code by 20131014 增加控件版本上报
                    "file_type": this.get_file_type(),//文件类型 如 png,jpg,mp4 等等
                    "extString1": this.file_sha ? this.file_sha : '',//get_plugin_version(),
                    "extString2": (this.upload_svr_host && this.upload_svr_port) ?
                        [this.upload_svr_host, this.upload_svr_port].join(':') : '',
                    "extString3": this.file_name //这个字段被转化成int，所以展示不处理，需要更换
                };
                user_log(
                    this.upload_type,
                    $.inArray(this.log_code, normal_code) > -1 ? 0 : this.log_code,
                    rpt_data,
                    {"weiyun_ver": get_plugin_version()} //code by 20131014 增加控件版本上报
                );
            });

            Upload.getPrototype().states.done = functional.after(Upload.getPrototype().states.done, function (error_code) {
                this.transresult=0;
                this.processed=this.file_size;

                //上传文件夹，不上报
                if (this.is_upload_folder()){
                    return;
                }

                stat_log.upload_stat_report_41(this,get_plugin_version());

                if (!this.is_upload()) {
                    return;
                }

                var ret,
                    is_file_exit;

                if (this.is_miaoc()) {
                    is_file_exit = true;
                }

                if (is_file_exit) {
                    ret = 30000002;
                } else if (this.pause_mode === 1) {
                    ret = 30000003;
                } else {
                    ret = 30000001;
                }

                user_log(this.upload_type, 0, {  //需要上报参数：文件后缀，耗时，文件大小，采用的上传类型，返回状态
                    "extInt1": is_file_exit ? 0 : (+new Date() - this.start_time),//秒传时间为0
                    "extInt2": ret,
                    "str_file_size": this.file_size + '',
                    "file_type": this.get_file_type(),//文件类型 如 png,jpg,mp4 等等
                    "extString1": this.file_sha ? this.file_sha : '',
                    "extString2": (this.upload_svr_host && this.upload_svr_port) ?
                        [this.upload_svr_host, this.upload_svr_port].join(':') : '',
                    "extString3": this.file_name, //这个字段被转化成int，所以展示不处理，需要更换
                    "subop": this.upload_type
                },{
                    "weiyun_ver": get_plugin_version() //code by 20131014 增加控件版本上报
                });


            });
            return Upload;
        };


    return function (Upload) {
        return wrap_log(Upload);
    };

});