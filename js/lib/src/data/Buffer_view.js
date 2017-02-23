/**
 * 滚动条拖到最底部时才显示更多的View
 * @author cluezhang
 * @date 2013-9-11
 */
define(function(require, exports, module){
    var $ = require('$'), 
        inherit = require('./inherit'),
        Event = require('./Event'),
        View = require('./data.View'),
        Store=  require('./data.Store');
        
//    var console = require('./console');
    
    var Buffer_view = inherit(View, {
        /**
         * 获取当前列表显示区大小
         * @return {Number} visible_count
         */
        get_visible_count : function(){
            return this.visible_count;
        },
        /**
         * 设置列表显示区大小，如果有更多的数据，将会自动渲染出来。
         * @param {Number} count
         */
        set_visible_count : function(count){
            var old_count = this.visible_count,
                store = this.store,
                size = store.size(),
                records;
            this.visible_count = count;
//            console.log('visible_count: '+old_count+'->'+count);
            if(count > old_count){
                if(old_count < size){
                    this.on_add(store, store.slice(old_count, count), old_count);
                }
            }else{
                if(count < size){
                    this.on_remove(store, store.slice(count, old_count), count);
                }
            }
        },
        /**
         * 过滤指定的记录区间，返回处于可视区域内的那些记录
         * @private
         */
        get_visible_records : function(records, index){
            var size = records.length;
            if(size + index > this.visible_count){
                records = records.slice(0, Math.max(0, this.visible_count - index));
            }
            return records;
        },
        // 插入记录
        // 插入后，有些记录会被移出可视区
        on_add : function(store, records, index){
            var visible_records = this.get_visible_records(records, index);
            if(visible_records.length>0){
//                console.log('on_add: '+index+' : '+visible_records.length);
                Buffer_view.superclass.on_add.call(this, store, visible_records, index);
                
                /*
                 * 当插入记录后，有些记录会被挤出可视区，要触发它们的remove动作以维护html节点在可视区内。
                 */
                var exceed_records = store.slice(this.visible_count);
                exceed_records = this.get_visible_records(exceed_records, this.visible_count);
                if(exceed_records.length>0){
//                    console.log('on_remove: '+this.visible_count+' : '+exceed_records.length);
                    Buffer_view.superclass.on_remove.call(this, store, exceed_records, this.visible_count);
                }
            }
        },
        // 删除记录
        // 删除后，可能有后面的记录前移
        on_remove : function(store, records, index){
            var visible_records = this.get_visible_records(records, index);
            if(visible_records.length>0){
//                console.log('on_remove: '+index+' : '+visible_records.length);
                Buffer_view.superclass.on_remove.call(this, store, visible_records, index);
                /*
                 * 当移除一些记录后，有些本不在可视区内的记录可能会显示出来，要添加它们
                 */
                var sliced_start = this.visible_count - visible_records.length;
                var sliced_records = store.slice(sliced_start);
                sliced_records = this.get_visible_records(sliced_records, sliced_start);
                if(sliced_records.length>0){
//                    console.log('on_add: '+sliced_start+' : '+sliced_records.length);
                    Buffer_view.superclass.on_add.call(this, store, sliced_records, sliced_start);
                }
            }
        },
        on_update : function(store, record, olds){
            var index = store.indexOf(record);
            if(index >= this.visible_count){
                return;
            }
            Buffer_view.superclass.on_update.apply(this, arguments);
        },
        refresh : function(){
            if(!this.rendered){
                return;
            }
            this.refresh_empty_text();
            var records = this.store.data;
            records = this.get_visible_records(records, 0);
            this.$list.html(this.get_html(records, 0));
        }
    });
    return Buffer_view;
});