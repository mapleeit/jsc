//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module/qboss/qboss.r151229",["lib","common","$"],function(require,exports,module){

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
//qboss/src/qboss.js

//js file list:
//qboss/src/qboss.js
/**
 * qboss
 */
define.pack("./qboss",["lib","common","$"],function(require, exports, module){

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        constants = common.get('./constants'),
        query_user = common.get('./query_user'),
        urls = common.get('./urls'),

        undefined;

    return new function(){

        /**
         * 拉取单条广告
         * @param opt
         *      {
					board_id	: 广告位id
					uin			: 用户uin
				}
         * @returns {*}
         */
        this.get = function(opt){
            var defer		= $.Deferred();
            $.ajax({
                type: 'get',
                url: '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_get_strategy',
                data :{
                    board_id: opt.board_id,
                    uin: opt.uin
                },
                requestType: 'jsonp',
                dataType: 'jsonp',
                cache: false,
                timeout: 60000,
                scriptCharset: 'UTF-8',
                qzoneCoolCbName: true,
                jsonpCallback:"success_callback",
                success: function(rep){
                    (rep && rep.code === 0) ? defer.resolve(rep) : defer.reject(rep);
                },
                error: function(rep){
                    defer.reject(rep);
                }
            });

            return defer.promise();
        };

        /**
         * 拉取多条广告
         * @param opt
         *      {
					board_id	: 广告位id
					uin			: 用户uin
					need_cnt    : 拉取条数
				}
         * @returns {*}
         */
        this.getMulti = function(opt){

            var defer		= $.Deferred();

            $.ajax({
                type: 'get',
                url: '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_get_multiple_strategy',
                data: {
                    board_id: opt.board_id,
                    uin: opt.uin
                },
                requestType: 'jsonp',
                dataType: 'jsonp',
                cache: false,
                noNeedAutoXss : true,
                timeout: 60000,
                scriptCharset: 'UTF-8',
                qzoneCoolCbName: true,
                need_cnt : opt.need_cnt,
                jsonpCallback:"success_callback",
                success: function(data){
                    (data && data.code === 0) ? defer.resolve(data) : defer.reject(data);
                },
                error: function(data){
                    defer.reject(data || {code: -1,message: '服务器繁忙'});
                }
            });

            return defer.promise();
        }

        /**
         * QBOSS广告上报数据（曝光、点击、关闭量）
         * (曝光量在拉取广告信息cgi时已经统计，不需要额外统计)
         * 拉取cgi：http://boss.qzone.qq.com/fcg-bin/fcg_rep_strategy
         * node代理走https: '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_rep_strategy',
         * @param opt
         * {
                 from	    : 0, 请求来源 0 PC端，1 WAP端，2 手机端
                 uin		: PSY.user.getLoginUin(),  登录用户的qq号
                 qboper     : 2, 操作类型，2点击 3关闭
                 bosstrace  : ''  广告标识串，在拉取广告信息cgi里吐出
             }
         * @returns {*}
         */
        this.report = function(opt){
            setTimeout(function() {
                var report_url = urls.make_url(constants.HTTP_PROTOCOL + '//' + window.location.hostname + '/proxy/domain/boss.qzone.qq.com/fcg-bin/fcg_rep_strategy', {
                    from: opt.from,
                    uin: opt.uin,
                    bosstrace: opt.bosstrace,
                    qboper: opt.qboper
                });
                //上报
                var img = new Image();

                img.onload = img.onerror = img.onabort = function () {
                    this.onload = this.onerror = this.onabort = null;
                };
                img.src = report_url;
            },5000)
        }
    };
});
