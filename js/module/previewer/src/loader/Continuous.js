/**
 * 分段加载的Loader
 * @author cluezhang
 * @date 2013-12-11
 */
define(function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Loader = require('./loader.Base'),
        $ = require('$');
    var Module = inherit(Loader, {
        complete : false,
        get : function(){
            var def = Module.superclass.get.apply(this, arguments),
                me = this;
            if(!def){
                return;
            }
            def.done(function(response){
                me.on_load(response);
            });
            return def;
        },
        /**
         * 当一段数据加载完成后
         */
        on_load : function(response){
        },
        is_complete : function(){
            return this.complete;
        }
    });
    return Module;
});