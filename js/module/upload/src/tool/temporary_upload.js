/**
 * 中转站文件上传
 * @author hibincheng
 * @date 2015-05-11
 */
define(function(require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        events = lib.get('./events'),
        routers = lib.get('./routers'),
        widgets = common.get('./ui.widgets'),
        query_user = common.get('./query_user'),
        File_object = common.get('./file.file_object'),
        constants = common.get('./constants'),
        request = common.get('./request'),

        upload_cache = require('./tool.upload_cache'),
        upload_route = require('./upload_route'),

        undefined;

    var temporary_file_max_valid_day;

    var temporary = {
        /**
         * 尝试是否可以上传到中转站
         */
        upload_if: function() {
            var cache = upload_cache.get_up_main_cache(),
                over_max_size_tasks = [],
                over_flow_tasks = [],
                success_count = 0,
                can_temporary_upload_count = 0,
                me = this;

            if(query_user.get_cached_user().is_weixin_user()) {
                return;
            }

	        //表单上传不支持上传中转站
	        if(upload_route.type == 'upload_form') {
		        return;
	        }

            //这个each方法实现得有问题，导致要用this获取item
            cache.each(function() {
                var task = this;
                if(!task.folder_id && task.log_code && !task.is_temporary() && !task.is_temporary_ignored()) {
                    if(task.log_code == 1127) {
                        over_flow_tasks.push(task);
                        can_temporary_upload_count++;
                    } else if(task.log_code == 1029 || task.log_code == 1131) {
                        over_max_size_tasks.push(task);
                        can_temporary_upload_count++;
                    }
                }
                if(!task.log_code){
                    success_count++;
                }
            });
            if(!over_flow_tasks.length && !over_max_size_tasks.length) {
                return;
            }

            if(!temporary_file_max_valid_day) {
                me.load_valid_time().done(function(body) {
                    temporary_file_max_valid_day = Math.ceil(body.temporary_file_max_valid_time/(60*60*24));
                    me.show_confirm(can_temporary_upload_count, success_count, over_flow_tasks, over_max_size_tasks);
                }).fail(function() {
                    temporary_file_max_valid_day = 7;
                });
            } else {
                me.show_confirm(can_temporary_upload_count, success_count, over_flow_tasks, over_max_size_tasks);
            }

        },

        show_confirm: function(can_temporary_upload_count, success_count, over_flow_tasks, over_max_size_tasks) {
            var me = this;
            var user = query_user.get_cached_user(),
                max_single_size = user.get_max_single_file_size(),
                max_flow_size = user.get_flow_info()['flow_every_day_max_upload_size'];

            max_single_size = File_object.get_readability_size(max_single_size, false);
            max_flow_size = File_object.get_readability_size(max_flow_size, false);
            var title = over_flow_tasks.length
		            ? '您今日流量超过' + max_flow_size + '，' + success_count + '个文件上传成功'
		            : '有' + over_max_size_tasks.length + '个文件超过' + (upload_route.type == 'upload_form' ? '10M' : max_single_size) + '，' + success_count + '个文件上传成功',
	            desc = '剩余' + can_temporary_upload_count + '个可继续上传到中转站，为你暂存' + temporary_file_max_valid_day + '天';

            if(!user.is_weiyun_vip() && !user.is_weixin_user()) {
                desc += '或<a href="'+constants.GET_WEIYUN_VIP_URL+'from%3D1012" target="_blank">开通会员</a>上传更大文件';
            }

            widgets.confirm('提示', title, desc, function(e) {
                me.re_upload(over_flow_tasks.concat(over_max_size_tasks));
            }, function() {
                me.ignore_temporary_upload(over_flow_tasks.concat(over_max_size_tasks));
            }, ['继续上传到中转站', '取消'], false);
        },

        load_valid_time: function() {
            var def = $.Deferred();

            request.xhr_get({
                url: 'http://web2.cgi.weiyun.com/temporary_file.fcg',
                cmd: 'TemporaryFileDiskUserInfoGet',
                pb_v2: true
            }).ok(function(msg, body) {
                def.resolve(body);
            }).fail(function(msg, ret) {
                //拉取用户中转站信息失败
                def.reject();
            });

            return def;
        },

        /**
         * 可以上传到中转站的文件重新上传
         * @param retry_tasks
         */
        re_upload: function(retry_tasks) {
            $.each(retry_tasks, function(i, task) {
                task.set_temporary(true);
                task.log_code = 0;
                task.minus_info('error');
                task.change_state('wait');
            });

            retry_tasks[0].events.nex_task.call(retry_tasks[0]); //从第一个从新开始上传

            this.go_station();
        },

        ignore_temporary_upload: function(retry_tasks) {
            $.each(retry_tasks, function(i, task) {
                task.ignore_temporary_upload(true);
            });
        },

        /**
         * 跳转到中转站
         */
        go_station: function() {
            setTimeout(function() {
                routers.go({ m: 'station' });
            }, 500);

        }
    };

    $.extend(temporary, events);

    return temporary;
});