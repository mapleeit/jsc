/**
 * 
 * @author cluezhang
 * @date 2013-9-16
 */
define(function(require, exports, module){
    var lib = require('lib'),
        tmpl = require('./tmpl'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$'),

        main_ui = require('main').get('./ui');

    var Header = inherit(Object, {
        searching : false,
        keyword : '',
        count : 0,
        constructor : function(cfg){
            $.extend(this, cfg);
            this.searcher.on('busy', this.update_state, this);
            this.searcher.on('idle', this.update_info, this);
            // 删除后数量有变化，要更新，此metachange是非标准事件，在Mgr中由外界帮它发的。
            // 未来再考虑标准化
            this.store.on('metachange', this.update_info, this);
        },
        update_info : function(keyword, store){
            this.set_state(this.searcher.busy || this.loader.is_requesting(), keyword || this.searcher.str, this.store.get_total_length());
        },
        update_state : function(keyword){
            this.set_state(this.searcher.busy ||this.loader.is_requesting(), keyword, this.count);
        },
        render : function($el){
            if(!this.rendered){
                this.$el = $('<div></div>').appendTo($el);
                this.rendered = true;
            }
        },
        show : function(){
            this.$el.show();
        },
        hide : function(){
            this.$el.hide();
        },
        set_state : function(searching, keyword, count){
            this.searching = searching;
            this.keyword = keyword;
            this.count = count;
            var $el = $(tmpl.header({
                searching : searching,
                keyword : keyword,
                count : count
            }));
            this.$el.replaceWith($el);
            this.$el = $el;

            main_ui.sync_size();
        }
    });
    return Header;
});