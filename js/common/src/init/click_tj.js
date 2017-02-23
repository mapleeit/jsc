/**
 *
 * @author jackbinwu
 * @date 13-5-9
 */
define(function (require, exports, module) {

    try{

        var
            lib = require('lib'),


            $ = require('$'),
            cookie = lib.get('./cookie'),
            store = lib.get('./store'),
            console = lib.get('./console'),

            user_log = require('./user_log'),
            constants = require('./constants'),
            log_event = require('./global.global_event').namespace('log'),

            sel_files_len = 0,
            view_id = 1,

            undefined;

        // 文件个数变化事件
        log_event.on('sel_files_len_change', function (len) {
            if(typeof len !== 'number') {
                console.error('sel_files_len_change 无效的参数');
                len = 0;
            }
            sel_files_len = len;
            user_log.set_base_param('extInt1', sel_files_len); //当前选中的文件数量
        });

        // 视图切换事件
        log_event.on('view_type_change', function (vid) {
            view_id = vid;
            user_log.set_base_param('extInt2', view_id); // 视图模式（grid: 1,  azlist : 3, newestlist : 4）
        });


        $('body').off('mouseup.EvtTongji')
                 .on('mouseup.EvtTongji', function(evt){

            var which = evt.which;
            var $el = $(evt.target).closest('[data-tj-action]');

            //通过左键点击上报统计
            //利用setTimeout错开，避免abort统计请求
            if(which == 1 && $el.length != 0){
                setTimeout(function(){
                    user_log(parseInt($el.attr('data-tj-value')), 0);
                }, 200);
            }
        });
    }catch(e){
        console && console.error(e.message);
    }

});