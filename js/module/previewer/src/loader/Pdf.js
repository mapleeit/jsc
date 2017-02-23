/**
 * PDF预览，分段加载器，每次返回3页html
 * @author cluezhang
 * @date 2013-12-11
 */
define(function(require, exports, module){
    var inherit = require('./inherit'),
        Continuous_loader = require('./loader.Iframe_continuous'),
        $ = require('$');
    var Module = inherit(Continuous_loader, {
        get_options : function(){
            return {
                host : 'http://pdf.cgi.weiyun.com',
                path : '/pdfview_np.fcg',
                params : $.extend({
                    cmd: 'pdf_view',
                    sp : this.page+1,
                    pc : this.page_size
                }, this.get_params())
            };
        }
    });
    return Module;
});