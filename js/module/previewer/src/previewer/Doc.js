/**
 * 
 * @author cluezhang
 * @date 2013-12-16
 */
define(function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Previewor = require('./previewer.Base'),
        $ = require('$');
    var Module = inherit(Previewor, {
        get_iframe_size : function($iframe){
            var size = Module.superclass.get_iframe_size.apply(this, arguments);
            // hack，DOC文档要预留8px的两侧空白，比较恶心
            size.width += 8*2;
            return size;
        }
    });
    return Module;
});