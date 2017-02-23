define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        upload_route =require('./upload_route'),
        Upload_class = require('./Upload_class'),
        select_folder = require('./select_folder.select_folder'),
        upload_static = require('./tool.upload_static'),
        upload_cache = require('./tool.upload_cache'),
        Validata = require('./upload_file_validata.upload_file_validata'),
        View = require('./view'),

        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),
        stat_log = common.get('./stat_log'),
        c = lib.get('./console'),
        force_blur = lib.get('./ui.force_blur'),
        random = lib.get('./random'),

        file_type_map = common.get('./file.file_type_map'),
        query_user = common.get('./query_user'),
        global_function = common.get('./global.global_function'),
        functional = common.get('./util.functional'),
        constants = common.get('./constants'),
        upload_event = common.get('./global.global_event').namespace('upload2'),

        G2 = Math.pow(2, 30) * 2,

        burst_num = constants.IS_APPBOX ? 8 : 50;//添加上传频率

    /**
     *
     * @param result
     * @returns {0: 成功, 其他：则为错误码}
     */
    var check_flash_result = function (result) {
        var result = /(parent.ftn_post_end)(\()((\d+)|(-\d+))(\))/.exec(result);
        if (null != result && result[3] != 0) {
            return result[3];
        }
        return 0;
    };
    var Upload = Upload_class.sub(function (id, path, size, upload_plugin, attrs) {
        this.local_id = id;
        this.path = path;
        this.file_name = this.get_file_name();
        this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
        this.pdir = attrs.pdir;   //上传到指定的目录ID

        this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
        this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称

        this.file_size = size;
        this.processed = 0;
        this.upload_plugin = upload_plugin;
        this.del_local_id = random.random(); //用来删除缓存队列里的id
        this.code = null;
        this.log_code = 0;
        this.can_pause = false;
        this.state = null;
        this.view = null;
        this.validata = Validata.create();
        this.validata.add_validata('check_name',this.file_name);//名称校验
        this.validata.add_validata('check_video',this.file_name);//视频文件
        //上传大小的限制从后台获取
        var max_upload_size = query_user.get_cached_user().get_max_single_file_size();
        max_upload_size = max_upload_size*1024 > 0 ? max_upload_size*1024 : Math.pow(2, 30);
        
        this.validata.add_validata('max_size', this.file_size, max_upload_size);
        this.validata.add_validata('flash_max_size', this.file_size, 104857600 * 3);//flash 300M限制
	    this.validata.add_validata('max_single_file_size', this.file_size); //单文件大小限制验证
	    this.validata.add_validata('remain_flow_size', this.file_size); //当日上传流量限制验证
        this.validata.add_validata('max_space', this.file_size, query_user.get_cached_user().get_used_space(), query_user.get_cached_user().get_total_space());
        this.init(attrs.dir_id_paths, attrs.dir_paths);
    });

    Upload.interface('states', $.extend({}, Upload_class.getPrototype().states));

    Upload.interface('events', $.extend({}, Upload_class.getPrototype().events));

    /**
     * 停止上传
     */
    Upload.interface('stop_upload', function () {
        var me = this,
            plugin = me.upload_plugin,
            local_id = me.local_id;
        if (!plugin || !( local_id > 0 || local_id === 0 )) {
            return undefined;
        }
        plugin.cancelFile(local_id);
    });

    Upload.interface('states.start', functional.after(Upload_class.getPrototype().states.start, function () {
        var __self = this,
            data = this.get_upload_param.call(this, '', ''); //flash的md5和sha为空值.
        data.upload_type = 1; //flash

        this.request_upload(data, function (rsp_body, data) {
            __self.change_state('start_upload', rsp_body, data);
            // yuyanghe 2014-1-13 加入数据上报
            stat_log.upload_stat_report_41(__self,'-','UPLOAD_ACTIONTYPE_ID','UPLOAD_PRE_SUBACTIONTYPE_ID','UPLOAD_PRE_THRACTIONTYPE_ID');
        });
    }));

    /**
     * 重试的正真动作
     */
    Upload.interface('re_start_action', function () {
	    this.change_state('start');
    });

    Upload.interface('states.start_upload', function () {
        this.start_time = +new Date();
        this.upload_plugin.uploadFile(this.local_id, this.server_name, this.server_port - 0, this.file_key, this.check_key, {
            'FileSize' : this.file_size, // bugfix by jackbinwu
                                          // ubuntu下content－length会多出两个字节，原因是http请求最后加上了\r\n，
                                          // 导致存储侧计算文件长度的时候出错，解决方案是传递文件真实大小，存储再进行截取
            'mode': 'flashupload'
        });
    });

    var __reload = functional.throttle(function () {
        file_list.reload(false, false);
    }, 2000);

    Upload.interface('states.done', function () {
        this.superClass.states.done.apply(this, arguments);
        //判断是否加载disk 解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
        if (disk.is_rendered() && disk.is_activated() && this.pdir == file_list.get_cur_node().get_id()) {//正在当前目录下，才刷新列表
            __reload();
        }
    });


    Upload.interface('states.upload_file_update_process', function (processed) {
        this.processed = processed;
    });


    var add_upload = function (upload_plugin, files, attrs) {
        View.show();
        setTimeout(function(){
            var len  = files.length;
            functional.burst(files, function (opt) {
                var upload_obj = Upload.getInstance(opt.id, 'C\\' + opt.name, opt.size, upload_plugin, attrs); //生成上传对象
                upload_obj.change_state('wait');    //状态转为wait，放入队列等待.
                if( (len-=1) === 0 ){
                    upload_obj.events.nex_task.call(upload_obj);
                }
            }, burst_num).start();
            force_blur();
        },10);

    };

    upload_event.on('add_upload', add_upload);


    var op = [null, 'add', null, 'upload_file_update_process', 'done', 'upload_file_update_process'];

    global_function.register('FileUploaderCallback', function (code, opt) {
        var fn = op[code - 0];

        if (fn === null) {
            return;
        }

        fn = fn || 'upload_file_update_process';

        if (fn === 'add') {
            //ie下点击了flash，title会变，这个时候特殊处理改回来
            if ($.browser.msie) {
                var main = require('main').get('./main');
                //    cur_mod = main.get_cur_mod_alias(),
                //    mod_obj = {"disk": "网盘", "photo": "相册", "recent": "最近", "recycle": "回收站","share":"分享的链接"};
                document.title = "微云网页版";
            }
            //弹出上传路径选择框，第三个参数标识是上传类型
            select_folder.show(opt, upload_route.upload_plugin, 'flash');
            return;
        }

        var task = upload_cache.get_task(opt.id);
        if (task) {
            //flash 可能返回 "<script>document.domain="qq.com";try{parent.ftn_post_end(0)}catch(e){}</script>" ，其中的数字标识了操作结果状态
            if (fn === 'done' && opt && opt.res) {
                var error_code = check_flash_result(opt.res);
                if (error_code) {
                    c.debug('fileupload done errorCode= ' + error_code);
                    task.change_state('error', error_code);
                    return;
                }
            }
            task.change_state(fn, opt.processed);
        }
    });

    module.exports = Upload;

});