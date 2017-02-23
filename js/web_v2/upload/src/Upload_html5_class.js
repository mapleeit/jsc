define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        upload_route = require('./upload_route'),
        Upload_class = require('./Upload_class'),
        select_folder = require('./select_folder.select_folder'),
        upload_static = require('./tool.upload_static'),
        upload_cache = require('./tool.upload_cache'),
        file_object = common.get('./file.file_object'),
        file_exif = require('./file_exif'),
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
        stat_log = common.get('./stat_log'),
        photo_group = require('./select_folder.photo_group');

    var M_1 = Math.pow(2, 20); //1M

    document.domain = 'weiyun.com';


    var Upload = Upload_class.sub(function (upload_plugin, id, file, attrs, folder_id) {
        this.file = file.file||file;
        this.upload_plugin = upload_plugin;
        this.local_id = id;
        this.del_local_id = id;
        this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
        this.pdir = attrs.pdir;   //上传到指定的目录ID
        this.path = file.name;
        this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
        this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称
        this.temporary = '';//下线中转站 //!!attrs.temporary; //是否是中转站文件上传
        this.file_name = file.name;
        this.file_size = file.size;
        this.processed = 0;
        this.code = null;
        this.log_code = 0;
        this.can_pause = false;
        this.state = null;
        this.view = null;
        this.validata = Validata.create();
        this.validata.add_validata('check_video', this.file_name);//视频文件
        this.validata.add_validata('h5_max_size', this.file_size, M_1 * 300);
	    this.validata.add_validata('max_single_file_size', this.file_size); //单文件大小限制验证
	    this.validata.add_validata('remain_flow_size', this.file_size); //当日上传流量限制验证
        this.init(attrs.dir_id_paths, attrs.dir_paths, attrs.cache_key, attrs.view_key);
        if (folder_id) {
            this.folder_id = folder_id;
        }
        this.upload_type = 'upload_html5';
    });

    Upload.interface('states', $.extend({}, Upload_class.getPrototype().states));

    Upload.interface('states.done', function () {
        this.superClass.states.done.apply(this, arguments);
        //解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
        if (disk.is_rendered() && disk.is_activated() && this.pdir == file_list.get_cur_node().get_id()) { //正在当前目录下，才刷新列表
            file_list.reload(false, false);
        }
    });
    /**
     * 停止上传
     */
    Upload.interface('stop_upload', function () {
        var me = this,
            _xhr = me.xhr;
        if (_xhr) {
            _xhr.abort();
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
        var data = this.get_upload_param.call(this, '', ''); //flash的md5和sha为空值.
        data.upload_type = 1; //html5
        data.file_size = __self.file_size;
        if(__self.file_size === 0) {
            data.file_sha = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';
            data.file_md5 = 'd41d8cd98f00b204e9800998ecf8427e';
        }

        if(file_object.is_image(this.file_name)) {
            file_exif.get_exif_by_file(this.file, function(obj) {
                data.ext_info = obj;
                __self.request_upload(data, function (rsp_body, data) {
                    __self.change_state('start_upload', rsp_body, data);
                    stat_log.upload_stat_report_41(__self, '-', 'UPLOAD_ACTIONTYPE_ID', 'UPLOAD_PRE_SUBACTIONTYPE_ID', 'UPLOAD_PRE_THRACTIONTYPE_ID');
                });
            });
        } else{
            this.request_upload(data, function (rsp_body, data) {
                __self.change_state('start_upload', rsp_body, data);
                stat_log.upload_stat_report_41(__self,'-','UPLOAD_ACTIONTYPE_ID','UPLOAD_PRE_SUBACTIONTYPE_ID','UPLOAD_PRE_THRACTIONTYPE_ID');
            });
        }

    });

    /**
     * 重试的正真动作
     */
    Upload.interface('re_start_action', function () {
	    this.change_state('start');
    });

    Upload.interface('states.start_upload', function () {
        var uploadFileData = {
            local_id: this.local_id,
            server_name: this.server_name,
            port: (this.server_port - 0),
            file_key: this.file_key,
            check_key: this.check_key
        };
        this.upload_plugin.uploadFile(uploadFileData, this);

    });

    Upload.interface('states.upload_file_update_process', function (processed) {
        this.processed = processed;
    });

    module.exports = Upload;


});