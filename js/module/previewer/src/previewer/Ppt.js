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
        background : '#ffffff',
        iframe_layout : 'fit'
    });
    return Module;
});