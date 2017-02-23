/**
 * 仿ExtJs中的Ext.data.Record，以便数据与视图的分离
 * @author cluezhang
 * @date 2013-8-13
 */
define(function(require, exports, module){
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        events = lib.get('./events'),

        undefined;

    var id_seed = 0;
    var Record = function(data, id){
        this.data = data || {};
        // 生成唯一ID
        this.id = id || 'wy-record-'+(++id_seed);
    };
    Record.prototype = {
        /**
         * 更新属性，如果它有关联store，会触发store的update事件，也可以当作batch_set的别名使用（只会产生一次事件）：
         * Record.set('a', 1);
         * Record.set({a:1,b:2});
         * @param {String} name
         * @param {Mixed} value
         * @param {Boolean} prevent_events (optional) 是否不产生事件静默修改，默认为false
         */
        set : function(name, value, prevent_events){
            if(name && typeof name === 'object'){
                return this.batch_set(name, prevent_events);
            }
            var data = this.data,
                old = data[name], olds;
            if(old !== value){
                data[name] = value;
                if(prevent_events !== true){
                    olds = {};
                    olds[name] = old;
                    this.notify_update(olds);
                }
            }
        },
        /**
         * 以数据对象形式批量更新属性，注意无视原型中的值
         * @param {Object} values
         * @param {Boolean} prevent_events (optional) 是否不产生事件静默修改，默认为false
         */
        batch_set : function(values, prevent_events){
            var name, value, old,
                olds = {},
                modified = false,
                data = this.data;
            for(name in values){
                if(values.hasOwnProperty(name)){
                    value = values[name];
                    old = data[name];
                    if(old !== value){
                        data[name] = value;
                        olds[name] = old;
                        modified = true;
                    }
                }
            }
            if(prevent_events !== true && modified){
                this.notify_update(olds);
            }
        },
        /**
         * 获取属性值
         * @param {String} name
         * @return {Mixed} value
         */
        get : function(name){
            return this.data[name];
        },
        /**
         * 通知关联的store值有更新
         * @private
         */
        notify_update : function(olds){
            if (this.store && typeof this.store.update === "function") {
                this.store.update(this, olds);
            }
        },

        get_id: function () {
            return (this.get('note_basic_info') && this.get('note_basic_info').note_id ) || "";
        },

        get_name: function () {
            return this.get('note_basic_info').note_title;
        },

        get_mtime: function() {
            return this.get('note_basic_info').note_mtime;
        },

        get_notetype: function () {
            return this.get('note_basic_info').note_type;
        },
        get_htmlcontent: function () {
            return this.get('item_htmltext').note_html_content;
        },

        get_version: function () {
            return this.get('note_basic_info').diff_version;
        },

        get_offset_day: function() {
            return this.get('note_basic_info').offset_day;
        },

        set_offset_day: function(offset_day) {
            this.get('note_basic_info').offset_day = offset_day;
        },

        set_id: function (note_id) {
            this.get('note_basic_info').note_id = note_id;
        },

        set_version: function (diff_version) {
            this.get('note_basic_info').diff_version = diff_version;
        },

        set_htmlcontent: function (content) {
            this.get('item_htmltext').note_html_content = content;
        },

        set_name: function (title) {
            var olds = {};
            olds['name'] = this.get('note_basic_info').note_title;
            this.get('note_basic_info').note_title = title;
        },

        is_note: function () {
            return true;
        },
        //兼容分享文件
        is_dir: function () {
            return false;
        },
        get_pid: function () {
            return "";
        },

        get_loaded: function () {
            return this.get('item_htmltext') != null;
        },

        get_articleurl: function () {
            return this.get('item_article') && this.get('item_article').note_artcile_url + "&trminal_type=30012&v=2";
        },

        get_article_comment: function () {
            //return this.get('item_article') && this.get('item_article').note_comment.note_html_content;
        },

        set_article_comment: function (comment) {
            //this.get('item_article').note_comment.note_html_content = comment;
        },

        get_note_raw_url: function () {
            //return this.get('item_article') && this.get('item_article').note_raw_url;
        },
        get_thumb_url: function () {
            return this.get('note_basic_info').thumb_url;
        },
        set_thumb_url: function (thumb_url) {
            //this.get('note_basic_info').thumb_url= https_tool.translate_cgi(thumb_url);
        },

        get_day_bar:function(){
            //return compute_day(this.get_version());
        },

        get_save_status:function(){
            return this.get('save_status') || "";
        },

        set_save_status:function(save_status,flag){
            this.set('save_status',save_status,flag);
        }
    };

    $.extend(Record.prototype, events);

    return Record;
});