/**
 * 图片分组store
 * @author cluezhang
 * @date 2013-11-8
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        Store = lib.get('./data.Store'),
        
        common = require('common'),
        mini_tip = common.get('./ui.mini_tip'),
        widgets = common.get('./ui.widgets'),
        
        Requestor = require('./Requestor'),
        
        $ = require('$');
    var requestor = new Requestor();
    var Module = inherit(Store, {
        reload : function(){
            var me = this;
            widgets.loading.show();
            return requestor.load_groups().done(function(records, total){
                me.load(records, total);
            }).fail(function(msg){
                if(msg !== requestor.canceled){
                    mini_tip.error(msg);
                }
            }).always(function(){
                widgets.loading.hide();
            });
        }
    });
    return Module;
});