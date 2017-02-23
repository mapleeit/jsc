/**
 * mgr
 * @author xixinhuang
 * @date 2016-03-04
 */
define(function(require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),
        common = require('common'),

        Mgr = lib.get('./Mgr'),
        util = require('./util'),

        undefined;

    var mgr = new Mgr('mgr', {

        init: function(cfg) {
            $.extend(this, cfg);
            this.observe(this.ui);
            this.observe(this.upload);
        },

        on_change: function(file) {
            var me = this;
            this.upload.url = '';
            util.read_file(file, function(data) {
                var _data = data;
                me.upload.init(file, data);

                setTimeout(function() {
                    me.ui.update(file, _data);
                },500);
            });
        },

        on_get_porn: function(data) {
            var _data = data.replace(/^data:image\/\w+;base64,/,'');
            this.robot.get_porn(_data);
        },

        on_refresh: function(data) {
            data = data || {};
            if(this.upload.fid && this.upload.pid) {
                data['fid'] = this.upload.fid;
                data['pid'] = this.upload.pid;
                data['pic'] = this.upload.pic_url;
            }
            this.robot.set_share_url(data);
        },

        on_get_tags: function() {
            this.robot.get_tags();
        }
    });

    return mgr;
});