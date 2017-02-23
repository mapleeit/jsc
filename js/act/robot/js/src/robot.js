define(function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        browser = common.get('./util.browser'),
        ui = require('./ui'),
        mgr = require('./mgr'),
        wx_jsapi = require('./wx_jsapi'),
        qq_jsapi = require('./qq_jsapi'),
        qzone_jsapi = require('./qzone_jsapi'),
        upload = require('./upload'),
        msg = require('./msg'),

        undefined;

    var app_id = '10005328',
        Authorization = '7cDP+2szm6LHHRIteulymyI1b9dhPTEwMDA1MzI4Jms9QUtJRG5uOXVwSGhucmg4MFdRZWdndVlhSG1XMU5ZdzdtZXVhJmU9MTQ1ODk4MzU3MCZ0PTE0NTYzOTE1NzAmcj01NTUyMTczODImdT05MTU0MDEyNTgmZj0=';

    var robot = new Module('robot', {

        render: function(data) {
            //bind events
            ui.init(data);
            mgr.init({
                ui: ui,
                upload: upload,
                robot: robot
            });

            var _data = {
                desc: (data && data.tag)? msg.get(decodeURIComponent(data.tag)) : '',
                icon_url: (data && data.pic)? data.pic : '',
                share_url: location.href
            }

            if(browser.QQ) {
                qq_jsapi.init(_data);
            } else if(browser.WEIXIN) {
                wx_jsapi.init(_data);
            } else if(browser.QZONE) {
                qzone_jsapi.init(_data);
            }
        },

        get_porn: function(image) {
            var data = {};
            data.image = image;
            data.app_id = app_id;
            this.data = data;

            $.ajax({
                type: 'POST',
                url: 'http://h5.weiyun.com/act/robot?porn',
                headers: {
                    "Authorization": Authorization
                },
                data: data,
                success:function(result){
                    ui.show_porn(result);
                },
                error: function (message) {
                    ui.show_tips();
                }
            });
        },

        get_tags: function() {
            $.ajax({
                type: 'POST',
                url: 'http://h5.weiyun.com/act/robot?tags',
                headers: {
                    "Authorization": Authorization
                },
                data: this.data || {},
                success:function(result){
                    ui.show_tags(result);
                },
                error: function (message) {
                    ui.show_tips();
                }
            });
        },

        set_share_url: function(obj) {
            var tag = obj.tag_name? '&tag=' + encodeURIComponent(obj.tag_name) : '';
            var data = {
                desc: obj.desc? obj.desc : '',
                icon_url: obj.pic? obj.pic : '',
                share_url: (obj.fid && obj.pid)? 'http://h5.weiyun.com/act/robot?fid=' + obj.fid + '&pid=' + obj.pid + tag : location.href
            }

            if(browser.QQ) {
                qq_jsapi.show_qq_webview(data);
            } else if(browser.WEIXIN) {
                wx_jsapi.set_share_url(data);
            } else if(browser.QZONE) {
                qzone_jsapi.init(data);
            }
        }
    });

    return robot;
});