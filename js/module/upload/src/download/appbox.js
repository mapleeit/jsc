/**
 * appbox下载控件组件
 * @author trump
 * @date 13-3-1
 */
define(function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        console = lib.get('./console'),
        common = require('common'),

        file_type_map = common.get('./file.file_type_map'),
        functional = common.get('./util.functional'),
        download_route,

        Class = require('./Upload_class'),
        Static = require('./tool.upload_static'),
        Cache = require('./tool.upload_cache'),
        view = require('./view');

    require.async('download_route', function (mod) {
        download_route = mod.get('./download_route');
    });

    var Down = Class.sub(function (e) {
        var me = this;
        me.local_id = me.del_local_id = e.task_id;//任务ID
        me.file_name = e.file_name;//文件名
        me.file_id = e.file_id;//文件ID
        me.file_size = functional.try_it(function(){//文件大小
            return e.file_size - 0;
        })  || 0;
        me.is_package_size = (me.file_size <= 1 || e.is_package);//标识打包下载
        me.real_target_path = e.target_path;//下载的本地目录
        me.download_url = e.download_url;

        (function(path) {
            var paths = path.split('\\'),
                dir_name = paths[paths.length-2];
            if(dir_name === 'Desktop'){
                paths[paths.length-2] = dir_name = '桌面';
            }
            me.dir_name = dir_name;//本地的目录名
            me.target_path = paths.join('\\');//本地的目录路径
        })(e.target_path);

        me.file_thum_url = e.file_thum_url;// 待确认
        me.cover_file = e.cover_file;//是否已经下载过，做覆盖下载
        me.validata = null;
        me.percent = '0%';  //默认进度
        me.init('', '', Cache.default_down_cache_key, 'webkit_down', Static.OP_TYPES.DOWN);
        me.startTime = (+new Date());
        me.detect_down_die();
    });
    var prototype_method = {
        /**
         * 覆盖基类方法 下载不需要插入网盘
         * @returns {boolean}
         */
        prepend_to_disk: function(){
            return false;
        },
        /**
         * 覆盖基类方法 下载暂时不能重试
         * @returns {boolean}
         */
        can_re_start: function(){
            return false;
        },
        /**
         * 是否打包下载
         */
        is_package: function () {
            return this.is_package_size;
        },
        /**
         * 删除下载
         */
        remove_file: function () {
            download_route && download_route.abort_download(this.local_id);
        },
        /**
         * 获取文件类型
         */
        get_file_type: function () {
            return file_type_map.get_type_by_ext(this.file_thum_url.split('-')[1]);
        },
        /**
         * 获取下载文件大小
         */
        get_file_size: function () {
            return this.file_size;
        },
        /**
         * 任务调度方法 在下载中什么也不做
         */
        call_next_task: $.noop,
        /**
         * 打开至目的地
         */
        open_to_target: function () {
            download_route && download_route.open_file_directory(this.local_id, this.real_target_path, this.file_name);
        },

        detect_down_die: function() {
            var me = this;
            this.die_detect_timer && clearTimeout(this.die_detect_timer);

            //200s还没进度响应则认为网络繁忙
            this.die_detect_timer = setTimeout(function() {
                me.change_state('error', 100);
            }, 200*1000);
        }
    };
    for(var key in prototype_method){
        Down.interface(key, prototype_method[key]);
    }

    /**
     * 暂停下载
     */
    Class.getPrototype().dom_events.click_pause = 
        functional.before(Class.getPrototype().dom_events.click_pause,function(){
            if (this.is_download()) {
                var taskid = this.local_id;
                console.log('pause:'+taskid);
                window.external.PauseDownload(taskid);
                clearInterval(this.die_detect_timer);
                //return false;
            };
        });

    /**
     * 继续下载
     */
    Class.getPrototype().dom_events.click_continuee = 
        functional.before(Class.getPrototype().dom_events.click_continuee,function(){
            if (this.is_download()) {
                var taskid = this.local_id;
                this.startTime=+new Date();
                this.start_file_processed=this.processed;//本次传输是从什么时候开始的．
                window.external.ResumeDownload(taskid);
                this.detect_down_die();
                //return false;
            };
        });

    /**
     * 从缓存中续传
     *
    Class.getPrototype().dom_events.click_resume_continuee = 
        functional.before(Class.getPrototype().dom_events.click_resume_continuee,function(){
            if (this.is_download()) {
                var taskid = this.local_id;
                console.log('resume continuee:'+taskid);
                window.external.ResumeDownload(taskid);
                return false;
            };
        });
    */


    Down.interface('states', $.extend({}, Class.getPrototype().states));
    /**
     * 预备下载
     */
    Down.interface('states.start', $.noop);
    /**
     * 下载中
     */
    Down.interface('states.processing', function (percent, speed) {
        if(!this.is_package()){//打包下载暂时不更新进度
            this.percent = parseInt(percent);
            this.processed = ( (this.file_size * this.percent) / 100 );
        }
        this.detect_down_die();
    });
    Down.interface('states.done', functional.after(Class.getPrototype().states.done, function () {
        clearTimeout(this.die_detect_timer);
    }));

    /**
     * 获取下载参数，续传需要
     */
    Down.interface('get_resume_param', function () {
        var ret = {
            task_id: this.local_id,
            file_name: this.file_name,
            file_size: this.file_size,
            target_path: this.real_target_path,
            file_thum_url: this.file_thum_url,
            cover_file: this.cover_file
        };
        return ret;
    });

    /*
    var add_resume = function (files) { //断点续传
        //console.log('add_resume:'+files);
        if(files.length){
            view.show();
        }
        $.each(files, function () {
            var obj = this;    //转化store中读取的记录
            var e = {
                'task_id': obj.task_id,
                'file_name': obj.file_name,
                'file_size': obj.file_size,
                'target_path': obj.target_path,
                'file_thum_url': obj.file_thum_url,
                'cover_file': obj.cover_file
            };
            var down_obj = Down.getInstance(e); //生成下载对象
            functional.try_it(function () {
                down_obj.change_state('resume_pause', obj);   //状态转为续传
            });
        });

    };
    */


    return {
        /**
         * 创建下载对象
         * 下载对象默认为 状态默认为开始
         * @param e
         */
        create: function (e) {
            view.show();
            Down.getInstance(e).change_state('start');
        }
        //,add_resume: add_resume
    };
});