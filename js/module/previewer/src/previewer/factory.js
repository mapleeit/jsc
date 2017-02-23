/**
 * 
 * @author cluezhang
 * @date 2013-12-13
 */
define(function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        $ = require('$');
    var types = {
        txt : require('./previewer.Txt'),
        pdf : require('./previewer.Pdf'),
        ppt : require('./previewer.Ppt'),
        pptx : require('./previewer.Ppt'),
        xls : require('./previewer.Xls'),
        xlsx : require('./previewer.Xls'),
        doc : require('./previewer.Doc'),
        docx : require('./previewer.Doc'),
        wps : require('./previewer.Doc'),
        rtf : require('./previewer.Doc')
    };
    var appbox_types = {
        // appbox下PPT文档维持原样
        ppt : require('./previewer.Ppt_list'),
        pptx : require('./previewer.Ppt_list')
    };
    var default_type = require('./previewer.Base');
    var Module = {
        get_previewer : function(document_type, types){
            var Previewer;
            document_type = (document_type || '').toLowerCase();
            if(types.hasOwnProperty(document_type)){
                Previewer = types[document_type];
            }
            return Previewer;
        },
        create : function(document_type, configs){
            var Previewer = this.get_previewer(document_type, types) || default_type;
            return new Previewer(configs);
        },
        appbox_create : function(document_type, configs){
            var Previewer = this.get_previewer(document_type, appbox_types) || this.get_previewer(document_type, types) || default_type;
            return new Previewer(configs);
        }
    };
    return Module;
});