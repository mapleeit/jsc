/**
 * 相册桥（使用iframe方式内嵌相册页面）
 * @author jameszuo
 * @date 13-6-19
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),

        Module = common.get('./module'),
        global_event = common.get('./global.global_event'),
        mini_tip=common.get('./ui.mini_tip'),

        undef;



    var photo_bridge = new Module('photo_bridge', {
        
        params_invoke_map : {
            reload : 'if_reload'
        },

        ui: require('./ui'),

        render: function () {

        },
        
        if_reload : function(if_reload){
            if(if_reload){
                this.ui.refresh();
            }
        }

    });
    
    var do_photo_refresh = function(){
        photo_bridge.ui.refresh().done(function(){
            mini_tip.ok('照片列表已更新');
        });
    };
    photo_bridge.on('activate', function(){
        global_event.on('photo_refresh', do_photo_refresh);
    });
    photo_bridge.on('deactivate', function(){
        global_event.off('photo_refresh', do_photo_refresh);
    });

    return photo_bridge;
});