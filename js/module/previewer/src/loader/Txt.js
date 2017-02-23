/**
 * 文本预览，分段加载器
 * @author cluezhang
 * @date 2013-12-11
 */
define(function(require, exports, module){
    var inherit = require('./inherit'),
        Continuous_loader = require('./loader.Continuous'),
        $ = require('$');
    var Module = inherit(Continuous_loader, {
        loaded_size : 0,
        page_size : 20*1024,
        get_options : function(){
            return {
                host : 'http://docview.weiyun.com',
                path : '/txtview_np.fcg',
                params : $.extend({
                    cmd: 'txtview',
                    fo : this.loaded_size,
                    ps : this.page_size
                }, this.get_params())
            };
        },
        on_load : function(response){
            var next_pos = response.next_pos;
            if(next_pos < 0){
                this.complete = true;
            }else{
                this.loaded_size = next_pos;
            }
        }
    });
    return Module;
});