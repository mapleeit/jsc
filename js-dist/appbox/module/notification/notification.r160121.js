//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/appbox/module/notification/notification.r160121",["lib","common"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//notification/src/notification.js
//notification/src/station.js
//notification/src/station.tmpl.html

//js file list:
//notification/src/notification.js
//notification/src/station.js
/**
 * 通知中心
 * @author hibincheng
 * @date 2015-05-26
 */
define.pack("./notification",["./station"],function(require, exports, module) {

    return function() {
        //中转站过期提醒
        require('./station')();

    }
});/**
 * 中转站通知提醒
 * @author hibincheng
 * @date 2015-05-26
 */
define.pack("./station",["lib","common","./tmpl"],function(require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        events = lib.get('./events'),
        routers = lib.get('./routers'),
        store = lib.get('./store'),
        request = common.get('./request'),
        widgets = common.get('./ui.widgets'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        cloud_config = common.get('./cloud_config'),

        tmpl = require('./tmpl'),

        undefined;

    var redhot_key = 'WY_WEB_TEMPORARY_FILE_RED_POINT';
    var guide_key = 'WY_WEB_TEMPORARY_FILE_USER_GUIDE_FLOAT';

    var red_dot = {

        start: function () {
            var me = this;
            cloud_config.get(redhot_key).done(function (values) {
                //if (!values[redhot_key].value) {
                //    var $station_red_dot = $('.trans-file .red-dot');
                //    $station_red_dot.show()
                //
                //    me.listenTo(routers, 'add.m', function(mod_name) {
                //        if (mod_name === 'station') {
                //            me.cancel();
                //        }
                //    }).listenTo(routers, 'change.m', function (mod_name) {
                //        if (mod_name === 'station') {
                //            me.cancel();
                //        }
                //    });
                //}

            });
        },

        cancel: function() {
            //$('.trans-file .red-dot').hide();
            //cloud_config.set(redhot_key, 'true');
        }
    };

    var guide = {

        render: function() {
            var me = this;
            cloud_config.get(guide_key).done(function (values) {
                if (!values[guide_key].value) {


                    me.$ct = $(tmpl.station_guide()).appendTo(document.body);

                    me.$ct.on('click', '[data-action=enter]', function(e) {
                        me.enter();
                    }).on('click', '[data-action=close]', function(e) {
                        //me.close();
                        me.enter();
                    });
                }

            });
        },

        enter: function() {
            this.$ct.remove();
            this.$ct = null;
            cloud_config.set(guide_key, 'true');
            routers.go({ m: 'station' });
        },

        close: function() {
            this.$ct.remove();
            this.$ct = null;
        }
    }

    $.extend(red_dot, events);

    return function() {

        red_dot.start();

        //guide.render();

        var user = query_user.get_cached_user();
        var desc = user.is_weiyun_vip() ? '' : '您可以<a href="'+constants.GET_WEIYUN_VIP_URL+'from%3D1012" target="_blank">开通会员</a>，最大可上传20G文件且永久保存';
        var date = (new Date()).getDate();
        var last_tip_date = store.get(query_user.get_uin() + '_notification_station');
        if(last_tip_date && last_tip_date == date) {//当天只提示一次
            return;
        }

        store.set(query_user.get_uin() + '_notification_station', date);

        request.xhr_get({
            url: 'http://web2.cgi.weiyun.com/temporary_file.fcg',
            cmd: 'TemporaryFileExpiredInfoGet',
            pb_v2: true
        }).ok(function(msg, body) {
            if(body['to_be_expired_file_count']) {

                widgets.confirm('提醒', '中转站有'+body['to_be_expired_file_count'] +'个文件即将过期', desc, function(e) {
                    routers.go({ m: 'station' });
                }, $.noop, ['查看', '取消'], false)
            };
        }).fail(function(msg, ret) {
            //失败就不管了
        });

    }
});
//tmpl file list:
//notification/src/station.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'station_guide': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    ');

        var query_user = require('common').get('./query_user');
    __p.push('    <div class="pop-guide-wrapper">\r\n\
        <!-- 根据 .pop-mid-mask 的定位得到上下右浮层的大小和位置 -->\r\n\
        <div class="pop-mask-wrapper ');
 if(query_user.get_cached_user().is_weixin_user()) { __p.push(' for-wx');
 } __p.push('">\r\n\
            <!-- .pop-left-up-mask 的 height = .pop-mid-mask 的 top -->\r\n\
            <div class="pop-left-up-mask"></div>\r\n\
            <!-- JS 确定 .pop-mid-mask 的位置，得到.pop-mid-mask的 top 值 -->\r\n\
            <div class="pop-mid-mask">\r\n\
                <i class="icon icon-guide-arr"></i>\r\n\
                <div class="pop-mask-text">\r\n\
                    <i class="icon icon-guide-box"></i>\r\n\
                    <h3 class="pop-text-title">超大文件中转站已上线</h3>\r\n\
                    <p class="pop-text">超大文件无限传 非会员用户可保存7天</p>\r\n\
                    <input data-action="enter" class="pop-btn" type="submit" value="立即上传超大文件">\r\n\
                </div>\r\n\
            </div>\r\n\
            <!-- .pop-left-down-mask 的 width = .pop-mid-mask 的 width\r\n\
                 .pop-left-down-mask 的 top = .pop-mid-mask 的 top + .pop-mid-mask 的 height\r\n\
             -->\r\n\
            <div class="pop-left-down-mask"></div>\r\n\
            <!-- .pop-right-mask 的 left = .pop-mid-mask 的 width -->\r\n\
            <div class="pop-right-mask"></div>\r\n\
        </div>\r\n\
        <i data-action="close" class="icon icon-close"></i>\r\n\
    </div>');

return __p.join("");
}
};
return tmpl;
});
