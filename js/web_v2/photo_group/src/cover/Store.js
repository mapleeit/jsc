/**
 * 图片封面模块
 * @author xixinhuang
 * @date 2016-08-31
 */
define(function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        Store = lib.get('./data.Store'),

        common = require('common'),
        mini_tip = common.get('./ui.mini_tip_v2'),
        widgets = common.get('./ui.widgets'),
        Loader = require('./Loader');

    var coverStore = inherit(Store, {
        page_size : 100,
        group_id : 0,
        constructor : function(){
            coverStore.superclass.constructor.apply(this, arguments);
            this.set_group(this.group_record);
        },
        set_group : function(group_record){
            this.group_record = group_record;
            this.group_id = group_record ? group_record.get('id') : 0;
            if(this.loaded){
                this.loaded = false;
                this.clear();
                this.reload();
            }
            this.trigger('groupchanged', group_record);
        },
        get_group : function(){
            return this.group_record;
        },
        reload : function(initial_size){
            var me = this;
            if(me.loading){
                return me.loading;
            }
            widgets.loading.show();
            // 首屏加载2.5倍屏幕
            me.loading = this.loader.load_photos(this.group_id, 0, initial_size || Math.round(this.page_size*2.5)).done(function(records, end){
                me.load(records, end ? null : Number.MAX_VALUE);
            }).fail(function(msg){
                mini_tip.error(msg);
            }).always(function(){
                me.loading = false;
                widgets.loading.hide();
            });
            return me.loading;
        },

        set_group_cover: function(record) {
            var def = $.Deferred();
            this.loader.set_group_album(this.group_id, record).done(function(){
                def.resolve();
            }).fail(function(msg){
                def.reject(msg);
            });
            return def;
        },

        load_more : function(){
            if(this.loading || this.is_complete()){
                return this.loading;
            }
            var me = this;
            widgets.loading.show();
            me.loading = this.loader.load_photos(this.group_id, this.size(), this.page_size).done(function(records, end){
                me.add(records);
                if(end){
                    me.total_length = me.size();
                    me.trigger('metachanged');
                }
            }).fail(function(msg){
                mini_tip.error(msg);
            }).always(function(){
                me.loading = false;
                widgets.loading.hide();
            });
            return me.loading;
        }
    });
    return coverStore;
});