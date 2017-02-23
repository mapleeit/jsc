/**
 * Txt预览
 * @author cluezhang
 * @date 2013-12-12
 */
define(function(require, exports, module){
    var inherit = require('./inherit'),
        Event = require('./Event'),
        Previewor = require('./previewer.Dynamic'),
        Txt_loader = require('./loader.Txt'),
        $ = require('$');
    // wtf IE标准模式把\r\n显示为双重换行问题
    // http://stackoverflow.com/questions/10887011/javascript-preformatted-text-with-cross-browser-line-breaks
    var eol = (function(){
        var textarea = document.createElement("textarea");
        textarea.value = "\n";
        return textarea.value.replace(/\r\n/, "\r");
    })();
    var Module = inherit(Previewor, {
        background : '#fff',
        Loader : Txt_loader,
        iframe_layout : 'none', // 没有iframe
        init_dom : function(){
            Module.superclass.init_dom.apply(this, arguments);
            this.$txt_content = $('<pre></pre>').css({
                'font-size' : '13px',
                'text-align' : 'left',
                'color' : 'black',
                'padding' : '0 5px',
                'line-height' : '18px',
                'margin' : '0px',
                'border' : '0px',
                'white-space' : 'pre-wrap',
                'word-wrap' : 'break-word'
            }).appendTo(this.$content);
        },
        do_render : function(response){
            var text = response.data || '';
            // 统一化换行符
            text = text.replace(/\r\n?|\n/g, eol);
            //$('<span/>').text(text).appendTo($content);
            this.$txt_content.append(document.createTextNode(text));
            
            this.trigger('txtloaded', text);
            
            if(!this.loaded){
                this.$loadmore.show();
                this.loaded = true;
                this.trigger('load');
            }
            // IE下会有一点奇怪的错位
            if($.browser.msie){
                this.$loadmore_ct.repaint();
            }
        },
        on_destroy : function(){
            Module.superclass.on_destroy.apply(this, arguments);
            this.$txt_content.remove();
        }
    });
    return Module;
});