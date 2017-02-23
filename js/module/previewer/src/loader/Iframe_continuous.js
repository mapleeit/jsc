/**
 * 分Iframe加载的Loader
 * @author cluezhang
 * @date 2013-12-11
 */
define(function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Loader = require('./loader.Continuous'),
        $ = require('$');
    var Module = inherit(Loader, {
        page : 0,
        page_size : 3,
        /**
         * @override
         * @return {Object} options
         */
        get_options : function(){
            return {
                host : 'http://docview.weiyun.com',
                path : '/docview_np.fcg',
                params : $.extend({
                    cmd: 'office_view',
                    sp : this.page+1,
                    pc : this.page_size
                }, this.get_params())
            };
        },
        /**
         * 当一段数据加载完成后
         */
        on_load : function(response){
            this.total_page = response.total_page;
            this.page += response.files.length;
            
            if(this.page >= this.total_page){
                this.complete = true;
            }
        }
    });
    return Module;
});