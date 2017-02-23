/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-11-6
 * Time: 下午7:43
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),

        store,
        get_store= function(){
           return store || (store = require('./time.store'));
        },

        $body,
        selected_cache = {
            length:0
        };

    return {
        cell_id_prefix : 'time_',
        get_dom_id : function(file_id){
            return this.cell_id_prefix + file_id;
        },
        get_file_id : function(dom_id){
            if(dom_id && dom_id.indexOf(this.cell_id_prefix) === 0){
                return dom_id.slice(this.cell_id_prefix.length);
            }
        },
        /**
         * @param $to
         */
        render: function($to){
            $body = $to;
            selected_cache = {length:0};
        },
        bind_select_box : function(sel_box){
            var old_sel_box = this.sel_box;
            if(old_sel_box){
                old_sel_box.off('select_change', this.handle_selection_change, this);
            }
            this.sel_box = sel_box;
            // 绑定后进行一次同步
            var file_id, selecteds = [];
            for(file_id in selected_cache){
                if(selected_cache.hasOwnProperty(file_id)){
                    selecteds.push(this.get_dom_id(file_id));
                }
            }
            sel_box.clear_selected();
            sel_box.set_selected_status(selecteds, true);
            
            sel_box.on('select_change', this.handle_selection_change, this);
        },
        handle_selection_change : function(sel_id_map, unsel_id_map){
            var store = get_store(), html_id;
            for (html_id in sel_id_map) {
                if (sel_id_map.hasOwnProperty(html_id)) {
                    var id = this.get_file_id(html_id),
                        node = store.get_node_by_id(id);
                    if (node) {
                        node.set_checked();
                        if(!selected_cache.hasOwnProperty(id)){
                            selected_cache[id] = id;
                            selected_cache.length +=1;
                        }
                    }
                }
            }
            for (html_id in unsel_id_map) {
                if (unsel_id_map.hasOwnProperty(html_id)) {
                    var id = this.get_file_id(html_id),
                        node = store.get_node_by_id(id);
                    if (node) {
                        node.set_unChecked();
                        if(selected_cache.hasOwnProperty(id)){
                            delete selected_cache[id];
                            selected_cache.length -=1;
                        }
                    }
                }
            }
        },
        /**
         * 选中元素
         * @param $el
         * @param file_id
         */
        select: function ($el,file_id) {
            if(selected_cache[file_id]){
                return true;
            }
            var sel_box = this.sel_box;
            if(sel_box){
                sel_box.set_selected_status([this.get_dom_id(file_id)], true);
            }else{
                $el.addClass('photo-view-list-selected');
            }
            selected_cache[file_id] = file_id;
            selected_cache.length+=1;
            return true;
        },
        /**
         * 反选元素
         * @param $el
         * @param file_id
         */
        un_select: function ($el,file_id) {
            if(!file_id){
                return true;
            }
            var sel_box = this.sel_box;
            if(sel_box){
                sel_box.set_selected_status([this.get_dom_id(file_id)], false);
            }else{
                $el.removeClass('photo-view-list-selected');
            }
            delete selected_cache[file_id];
            selected_cache.length-=1;
            return true;
        },
        clear : function(){
            selected_cache = {
                length : 0
            };
        },
        /**
         * 是否被选中
         * @param file_id
         * @returns {boolean}
         */
        is_selected: function(file_id){
            return !!selected_cache[file_id];
        },
        /**
         * 反选其他，但选中自己
         * @param file_id
         */
        unselected_but: function(file_id){
            for(var key in selected_cache){
                if(selected_cache.hasOwnProperty(key)){
                    var node = get_store().get_node_by_id(key);
                    if( node && key !== file_id ){
                        node.toggle_check();//退出选中状态
                        this.un_select($body.find('[data-file-id='+key+']'),key);
                    }
                }
            }
            this.select($body.find('[data-file-id='+file_id+']'),file_id);
        },
        /**
         * 返回选中的个数
         * @returns {number}
         */
        get_selected_length: function(){
            return selected_cache.length;
        },
        /**
         * 获取选中的节点
         * @return {Array<Poto_Node>}
         */
        get_selected_nodes: function(){
            var ret = [];
            if(selected_cache.length){
                for(var key in selected_cache){
                    if(selected_cache.hasOwnProperty(key)){
                        var node = get_store().get_node_by_id(key);
                        if( node ){
                            ret.push(node);
                        }
                    }
                }
            }
            return ret;
        }
    };
});
