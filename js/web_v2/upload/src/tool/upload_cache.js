/**
 * User: trumpli
 * Date: 13-7-30
 * Time: 下午8:29
 */
define(function (require, exports, module) {
    var console = require('lib').get('./console'),
        $ = require('$'),
        Queue = require('./tool.upload_queue'),
        Static,
        get_static= function(){
            return Static || (Static = require('./tool.upload_static'));
        };

    var Cache = function (cache_key) {
        this.cache_key = cache_key;
        this.cache = {length:0};
        this.curr_cache = {length: 0};//当前正在上传的任务
        this.task_list = [];
        this.total_size = 0;//上传总量
        this.passed_size = 0;//已上传量
        this.count_nums = {'pause':0,'error':0,'done':0,'length':0};
        this.folder_type = -1;
    };

    $.extend(
        Cache.prototype,
        {
            _clear: function () {//清空
                this.passed_size = this.total_size = 0;
                this.cache = {length:0};
                this.count_nums = {'pause':0,'error':0,'done':0};
                this.curr_cache = {length:0};
                this.task_list = [];
                Queue.clear(this.cache_key);
                delete this._queue;
            },

            plus_info: function (key,task) {
                var has_key = '_has_count_' + key;
                if(!task[has_key]){
                    this.count_nums[key] += 1;
                    task[has_key] = true;
                }
            },
            minus_info: function (key,task) {
                var has_key = '_has_count_' + key;
                if(task[has_key]) {
                    this.count_nums[key] -= 1;
                    task[has_key] = false;
                }
            },
            get_all_length: function () {
                return this.cache.length;
            },
            get_total_size: function (total_size) {
                if (total_size) {
                    this.total_size = total_size;
                }
                return this.total_size;
            },
            get_passed_size: function (passed_size) {
                if (passed_size) {
                    this.passed_size = passed_size;
                }
                return this.passed_size;
            },
            get_count_nums: function(){
                this.count_nums.length = this.cache.length;
                return this.count_nums;
            },
            is_done: function () {
                var counts = this.get_count_nums();
                return counts.length <= counts.error + counts.pause + counts.done;
            },

            get_curr_upload: function () {
                return this.cache[this.get_queue().get_only_key()];
            },
            get_curr_cache: function () {
                return this.curr_cache;
            },

            pop_curr_cache: function(del_id){
                if(this.curr_cache[del_id]){
                    delete this.curr_cache[del_id];
                    this.curr_cache.length-=1;
                }
            },
            push_curr_cache: function(id,ctx){
                if(!this.curr_cache[ id ]){
                    this.curr_cache[ id ] = ctx;
                    this.curr_cache.length += 1;
                }
            },

            get_cache: function () {
                return this.cache;
            },
            push_cache: function(id,ctx){
                if( !this.cache[id] ){

                    this.cache[id] = ctx;
                    this.cache.length+=1;
	                this.count_nums.length = this.cache.length;
                    this.task_list.push(ctx);
                }
            },
            pop_cache: function(id){
                if( !!this.cache[id] ){
                    delete this.cache[id];
                    this.cache.length-=1;
	                this.count_nums.length = this.cache.length;
                }
            },
            each: function (fn) {
                var cache = this.get_cache();
                for(var key in cache){
                    if(key!=='length'){
                        if( false === fn.call(cache[key])){
                            return;
                        }
                    }
                }
            },
            get_queue: function () {
                return this._queue || ( this._queue = Queue.get(this.cache_key) );
            },
            /**
             * 任务中是否含有文件夹
             * @param force强制从缓存中读取
             */
            is_contain_folder: function( force ){
                var me = this;
                if(me.folder_type === -1 || force){
                    me.folder_type = false;
                    me.each(function(){
                        if( get_static().FOLDER_TYPE  === this.file_type ){
                            me.folder_type = true;
                            return false;
                        }
                    });
                }
                return me.folder_type;
            },
            /**
             * 执行下一个任务
             */
            do_next: function(){
                var me = this;
                if(me.curr_cache.length == 0){
                    if( ! get_static().cpu.is_proxy_able(
                        function(){
                            me.get_queue().dequeue();
                        }
                    )){
                        setTimeout(function(){
                            me.get_queue().dequeue();
                        },get_static().cpu.get_immediate_time());
                    }
                }
            },
            /**
             * 集合中是否有正在运行的任务
             * @returns {number} 1:有任务正在运行，0:已经没有任务在运行了
             */
            has_task_running: function(){
                if(this.get_all_length() > 0 && !this.is_done())
                    return 1;
                return 0;
            },

            get_next_task: function() {
                var cur_upload_task = this.get_curr_upload();
                var next_task_index = -1;
                var task_list = this.task_list || [];
                $.each(task_list, function(i, task) {
                    if(task == cur_upload_task) {
                        next_task_index = i + 1;
                        return false;
                    }
                });

                var find = false;
                while(task_list[next_task_index]) {
                    if(task_list[next_task_index].state == 'wait') {
                        find = true;
                        break;
                    } else {
                        next_task_index++;
                    }
                }

                if(find) {
                    return task_list[next_task_index];
                }
            }
        }
    );

    var caches = {length: 0};

    return {
        default_cache_key: 'default_cache_key',//上传默认Cache
        default_down_cache_key: 'down_cache_key',//下载默认Cache
	    default_offline_cache_key: 'offline_cache_key',//离线下载默认Cache
        /**
         * 上传管理器中的总长度
         */
        length: function(){
            return this.get_up_main_cache().get_count_nums().length + this.get_dw_main_cache().get_count_nums().length + this.get_od_main_cache().get_count_nums().length;
        },
        /**
         * 是否初始化
         * @returns {boolean}
         */
        is_init: function () {
            return caches.length > 0;
        },
        /**
         * 获取cache
         * @param cache_key
         * @returns {*}
         */
        get: function (cache_key) {
            var _key = cache_key || this.default_cache_key;
            if (!caches[_key]) {
                caches[_key] = new Cache(_key);
                caches.length += 1;
            }
            return caches[_key];
        },
        /**
         * 清空
         * @param key 可选
         */
        clear: function (key) {
            var key = key || this.default_cache_key;
            if(caches[key]){
                caches[key]._clear();
                caches[key] = null;
                delete caches[key];
                caches.length -= 1;
            }
        },
        /**
         * 获取指定local_id的任务对象
         * @param local_id
         * @returns {*}
         */
        get_task: function(local_id){
            for (var key in caches) {
                if (key === 'length')
                    continue;
                var task = caches[key].get_cache()[local_id];
                if (task) {
                    return task;
                }
            }
        },
        /**
         * 获取上传主任务cache
         * @returns {*}
         */
        get_up_main_cache: function () {
            return this.get(this.default_cache_key);
        },
        /**
         * 获取下载主任务cache
         * @returns {*}
         */
        get_dw_main_cache: function () {
            return this.get(this.default_down_cache_key);
        },
	    /**
	     * 获取离线下载主任务cache
	     * @returns {*}
	     */
	    get_od_main_cache: function () {
		    return this.get(this.default_offline_cache_key);
	    },
        /**
         * 通过 local_id 获取主任务中的对象，注意：这种获取方式，只适用于文件夹
         * @param local_id
         * @returns {*}
         */
        get_folder_by_id: function (local_id) {
            return this.get_up_main_cache().cache[local_id];
        },
        /**
         * 获取当前正真上传的任务
         * @returns {*}
         */
        get_curr_real_upload: function () {
            var task = this.get_up_main_cache().get_curr_upload();
            if (task && get_static().FOLDER_TYPE  === task.file_type) {
                return task.get_sub_cache().get_curr_upload();
            }
            return task;
        }
    }
});
