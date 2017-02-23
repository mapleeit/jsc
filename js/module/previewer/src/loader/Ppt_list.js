/**
 * PPT预览，原appbox的预览方式，一页页加载
 * @author cluezhang
 * @date 2013-12-17
 */
define(function(require, exports, module){
    var inherit = require('./inherit'),
        Continuous_loader = require('./loader.Iframe_continuous'),
        $ = require('$');
    var Module = inherit(Continuous_loader, {
        get_options : function(){
            var options = Module.superclass.get_options.apply(this, arguments);
            options.params.gps = 1; // lucifahuang: 参数名是gps，传1表示获取子页面，不传或传其他值表示获取主页面。
            return options;
        }
    });
    return Module;
});