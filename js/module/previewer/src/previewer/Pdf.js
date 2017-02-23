/**
 * 
 * @author cluezhang
 * @date 2013-12-11
 */
define(function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Previewor = require('./previewer.Dynamic'),
        Pdf_loader = require('./loader.Pdf'),
        $ = require('$');
    var Module = inherit(Previewor, {
        Loader : Pdf_loader
    });
    return Module;
});