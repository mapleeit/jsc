define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        upload_route = require('./upload_route'),
        Upload_class = require('./Upload_class'),
        select_folder = require('./select_folder.select_folder'),
        upload_static = require('./tool.upload_static'),
        upload_cache = require('./tool.upload_cache'),
        View = require('./view'),
        Validata = require('./upload_file_validata.upload_file_validata'),
        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),
        random = lib.get('./random'),
        functional = common.get('./util.functional'),
        global_function = common.get('./global.global_function'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        ret_msgs = common.get('./ret_msgs'),
        photo_group = require('./select_folder.photo_group');

    document.domain = 'weiyun.com';


    var Upload = Upload_class.sub(function (upload_plugin, id, file, attrs, folder_id) {
        this.file = file.file || file;
        this.path = file.name;
        this.endingByte=0;
        this.startingByte=0;
        this.upload_plugin = upload_plugin;
        this.local_id = id;
        this.del_local_id = id;
        this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
        this.pdir = attrs.pdir;   //上传到指定的目录ID
        this.sha ="";
        this.md5 ="";
        this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
        this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称
        this.file_name = file.name;
        this.file_size = file.size;
	    this.temporary = '';  //下线中转站  //!!attrs.temporary; //是否是中转站文件上传
        this.pdir_create_ret = attrs.pdir_create_ret; //父目录创建结果
        this.processed = 0;
        this.code = null;
        this.log_code = 0;
        this.can_pause = true;
        this.state = null;
        this.view = null;
        this.file_sign_update_process = 0; //当前签名进度
        this.validata = Validata.create();
        this.validata.add_validata('check_video', this.file_name);//视频文件
	    this.validata.add_validata('max_single_file_size', this.file_size); //单文件大小限制验证
	    this.validata.add_validata('remain_flow_size', this.file_size); //当日上传流量限制验证
        this.init(attrs.dir_id_paths, attrs.dir_paths, attrs.cache_key, attrs.view_key);
        if (folder_id) {
            this.folder_id = folder_id;
        }
        this.upload_type = 'upload_h5_flash';
    });

    Upload.interface('states', $.extend({}, Upload_class.getPrototype().states));


    Upload.interface( 'states.file_sign_update_process', function(percent) {
        this.file_sign_update_process =  percent;
    });


    Upload.interface('states.pre_file_sign', function () {
        if(!this.is_pre_file_sining) {
            this.is_pre_file_sining = true;
            this.upload_plugin.varityFile(this);
        }
    });

    Upload.interface('states.start', function () {
        if(this.pdir_create_ret) {
            this.change_state('error', this.pdir_create_ret);
            return;
        }
        var __self = this;
        this.start_time = +new Date();
        var ret = this.superClass.states.start.apply(this, arguments);
        //获取里面的返回值，防止本地错误了，还会继续执行上传
        if(ret === false){
            return;
        }

        //之前已扫描过，中转站文件直接申请上传
        if(this.file_sha || this.file_md5) {
            global_function.get('FileUploaderCallback')(0, {
                id: this.local_id,
                sha: this.file_sha,
                md5: this.file_md5
            });
            /*this.change_state('file_sign_done', {
                Md5: this.file_md5,
                SHA: this.file_sha
            });*/
            return;
        }

        if(this.file_size === 0) {
            var data = this.get_upload_param.call(this, '','');
            data.file_sha = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';
            data.file_md5 = 'd41d8cd98f00b204e9800998ecf8427e';
            data.upload_type = 0; //走分片上传的协议
            data.file_size = 0;
            var me = this;
            this.request_upload(data, function (rsp_body, data) {
                if(rsp_body.file_exist){
                    me.change_state('done', rsp_body, data);
                }else{
                    //空文件会秒传
                }
            });
        } else if(this.is_pre_file_sining){//已经在扫描中
            this.is_pre_file_sining = false;//转为开始状态
        }else {
            __self.upload_plugin.varityFile(__self);
        }
    });

    Upload.interface('states.start_upload', function () {
        this.upload_plugin.uploadFile(this);
        //this.change_state("upload_file_update_process",0);
        if(!this.folder_id) {
            this.don_next_task_sign();    //先禁用掉预扫描
        }
    });

    Upload.interface('states.to_continuee', function () {
        //记录任务的开始时间
        this.startTime=+new Date();
        this.start_time=+new Date();
        this.start_file_processed=this.processed;//本次传输是从什么时候开始的．
        //做为下一个执行，准备执行
        this.get_queue().head(this, function () {
            this.get_belong_cache().push_curr_cache(this.del_local_id, this);
            this.upload_plugin.uploadFile(this);
        });
    });


    Upload.interface('states.done', function () {
        this.superClass.states.done.apply(this, arguments);
        //解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
        if (disk.is_rendered() && disk.is_activated() && this.pdir == file_list.get_cur_node().get_id()) { //正在当前目录下，才刷新列表
            file_list.reload(false, false);
        }
        this.file = null;
    });

    Upload.interface('don_next_task_sign', function () {
        var cache = upload_cache.get_up_main_cache();
        var next_task = cache.get_next_task();
        if(next_task) {
            next_task.change_state('pre_file_sign');
        }
    });
    /**
     * 重试的正真动作
     */
    Upload.interface('re_start_action', function () {
        var me = this;
        var data;
	    if(me.file_md5 && me.file_sha) {
		    data = this.get_upload_param.call(this, me.file_md5, me.file_sha);
		    this.startingByte = 0;
		    this.endingByte = 0;
		    data.upload_type = 0; //走分片上传的协议
		    data.file_size = me.file_size;
		    me.request_upload(data, function(rsp_body, data) {
			    if(rsp_body.file_exist) {
				    me.change_state('done', rsp_body, data);
			    } else {
				    me.change_state('start_upload', rsp_body, data);
			    }
		    });
	    } else {
		    me.change_state('start');
	    }
    });


    Upload.interface('states.upload_file_update_process', function (processed) {
        this.processed = processed;
    });


    /**
     * 是否妙传
     */
    Upload.interface('is_miaoc', function () {
        return this.file_exist;
    });

    module.exports = Upload;


});