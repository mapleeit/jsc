define(function(require, exports, module) {

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

		console = lib.get('./console'),
		random = lib.get('./random'),

		functional = common.get('./util.functional'),
		Module = common.get('./module'),
		global_function = common.get('./global.global_function'),
		query_user = common.get('./query_user'),
		session_event = common.get('./global.global_event').namespace('session'),
		upload_event = common.get('./global.global_event').namespace('upload2'),
		ret_msgs = common.get('./ret_msgs'),

		photo_group = require('./select_folder.photo_group');

	var upload_lock = false;

	var clear_input_file = function() {
		//清除表单的值，这样下次就能够继续选择上次的文件
		if(upload_route.upload_plugin && upload_route.upload_plugin.reset) {
			upload_route.upload_plugin.reset();
		}
	};

	document.domain = 'weiyun.com';

	var Upload = Upload_class.sub(function(upload_plugin, id, path, attrs) {

		this.upload_plugin = upload_plugin;
		this.local_id = id;
		this.del_local_id = id;
		this.path = path;
		this.ppdir = attrs.ppdir; //上传到指定的目录父级目录ID
		this.pdir = attrs.pdir;   //上传到指定的目录ID
		this.ppdir_name = attrs.ppdir_name; //上传到指定的目录的父级目录名称
		this.pdir_name = attrs.pdir_name; //上传到指定的目录的名称
		this.skey = attrs.skey;
		this.file_name = this.get_file_name();
		this.processed = 0;
		this.code = null;
		this.log_code = 0;
		this.can_pause = false;
		this.state = null;
		this.view = null;
		this.time = this.get_timeout(180000); //超时
		this.validata = Validata.create();
		this.validata.add_validata('check_video', this.file_name);//视频文件
		this.init(attrs.dir_id_paths, attrs.dir_paths);

	});

	Upload.interface('states', $.extend({}, Upload_class.getPrototype().states));

	Upload.interface('get_timeout', function(__time) {

		var t,
			__self = this;

		var timeout = function() {
			t = setTimeout(function() {
				__self.change_state('error', 10001);//表单超时，激活错误状态
			}, __time);
		};

		var clear = function() {
			clearTimeout(t);
		};

		return {
			timeout: timeout,
			clear: clear
		};

	});
	/**
	 * 不能重试
	 */
	Upload.interface('can_re_start', function() {
		return false;
	});
	Upload.interface('states.done', function() {
		this.superClass.states.done.apply(this, arguments);
		this.upload_plugin.destory();
		//解决直接从“相册”、“最近”、“回收站” 进入上传时的错误
		if(disk.is_rendered() && disk.is_activated() && this.pdir == file_list.get_cur_node().get_id()) {
			file_list.reload(false, false);
		}
	});


	Upload.interface('states.error', function() {
		this.superClass.states.error.apply(this, arguments);
		this.upload_plugin.destory();
	});


	Upload.interface('states.start', function() {
		this.start_time = +new Date();
		var ret = this.superClass.states.start.apply(this, arguments);
		//获取里面的返回值，防止本地错误了，还会继续执行上传
		if(ret === false) {
			clear_input_file();
			this.upload_plugin.destory();
			return;
		}
		var send_param = {
			name: 'web',
			ppdir: this.ppdir,
			pdir: this.pdir,
			skey: this.skey
		};
		var group_id = photo_group.get_photo_group_id();
		if(group_id > 0) {
			this.group_id = send_param.group_id = group_id;
			send_param.upload_type = 1;//非控件上传
		}
		this.upload_plugin.send(send_param);
		this.time.timeout();

		clear_input_file();

	});

	var add_upload = function(upload_plugin, files, attrs) {
		attrs.skey = query_user.get_skey();

		functional.burst([upload_route.upload_plugin.get_path()], function(path) {

			var upload_obj = Upload.getInstance(upload_route.upload_plugin, random.random(), path, attrs);

			upload_obj.change_state('wait');    //状态转为wait，放入队列等待.

			upload_obj.events.nex_task.call(upload_obj);

		}, 3).start();
	};

	upload_event.on('add_upload', add_upload);

	var form_upload = new Module('form_upload', {

		render: function() {

			var me = this;

			this.listenTo(upload_route, 'render', function() {

				upload_route.upload_plugin.change(function() {

					//获取用户选择的文件名
					var file_name = $('#_upload_form_input').val(),
						ary = file_name.split(/\\|\//);
					me.file_name = ary[ary.length - 1] || '';

					var __files = [
						{"name": me.file_name, "size": 0}
					];

					//弹出上传路径选择框，第三个参数标识是上传类型
					select_folder.show(__files, upload_route.upload_plugin, 'form');

				});

			});
		}
	});


	global_function.register('weiyun_post_end', function(json) {
		//code by bondli 防止用户重复选择同一文件上传导致不会触发表单的change事件
		//try{$('#_upload_form_input').val('');}catch(e){};
		//code by iscowei 上面那行代码会导致失败重试上传时提交的表单空值，另外IE下不支持修改type="file"的value
		if(upload_route.upload_plugin && upload_route.upload_plugin.reset) {
			upload_route.upload_plugin.reset();
		}

		setTimeout(function() { // fix response try
			if(json.ret === 0) {
				upload_cache.get_curr_real_upload().change_state('done');
				return upload_lock = false; //清空single_upload，方便下一次上传.
			} else {
				upload_cache.get_curr_real_upload().change_state('error', json.ret);
				if(json.ret === ret_msgs.INVALID_SESSION) {//fixed bug 48758599 by hibincheng Form表单上传，会话过期，登陆框弹出显示。(其它上传在Upload_class.js request_upload方法中rqeuest请求配置cavil参数即可)
					session_event.trigger('session_timeout');
				}
				return upload_lock = false;
			}
		}, 0);
	});


	form_upload.render();

	module.exports = Upload;


});