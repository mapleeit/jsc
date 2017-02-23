/**
 * 
 * @author cluezhang
 * @date 2013-12-16
 */
define(function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Previewor = require('./previewer.Dynamic'),
        Loader = require('./loader.Ppt_list'),
        $ = require('$');
    var Module = inherit(Previewor, {
        Loader : Loader,
        adjust_iframe : function($iframe){
            Module.superclass.adjust_iframe.apply(this, arguments);
            try{
                $iframe.contents().find('body').css({
                    padding : '8px 0 0 0',
                    margin : '0',
                    backgroundColor : '#808080'
                });
            }catch(e){
                // 跨域
            }
        },
        get_iframe_size : function(){
            return {
                width : 740,
                height : 558
            };
        }
    });
    return Module;
});