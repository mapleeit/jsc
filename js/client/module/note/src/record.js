/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-9-3
 * Time: 上午11:12
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        inherit = lib.get('./inherit'),
        Record = lib.get('./data.Record'),

        common = require('common'),
        https_tool = common.get('./util.https_tool'),

        date_time = lib.get('./date_time'),
        today = date_time.today().getTime(),
        yesterday = date_time.yesterday().getTime(),
        last7day = date_time.add_days(-7).getTime();

    var record = inherit(Record, {

        get_id: function () {
            return (this.get('note_basic_info') && this.get('note_basic_info').note_id ) || "";
        },

        get_name: function () {
            return this.get('note_basic_info').note_title;
        },

        get_notetype: function () {
            return this.get('note_basic_info').note_type;
        },
        get_htmlcontent: function () {
            return this.get('item_htmltext').note_html_content;
        },

        get_mtime: function() {
            return this.get('note_basic_info').note_mtime;
        },

        get_version: function () {
            return this.get('note_basic_info').diff_version;
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
            return this.get('item_article') && this.get('item_article').note_comment.note_html_content;
        },

        set_article_comment: function (comment) {
            this.get('item_article').note_comment.note_html_content = comment;
        },

        get_note_raw_url: function () {
            return this.get('item_article') && this.get('item_article').note_raw_url;
        },
        get_thumb_url: function () {
            return this.get('note_basic_info').thumb_url;
        },
        set_thumb_url: function (thumb_url) {
             this.get('note_basic_info').thumb_url = https_tool.translate_notepic_url(thumb_url);
        },

        get_day_bar:function(){
            return compute_day(this.get_version());
        },

        get_auto_save_status:function(){
            return this.get('auto_save_status') || "";
        },

        //自动保存的状态保存，例如24402(笔记已删除)
        set_auto_save_status: function(auto_save_status, flag) {
            this.set('auto_save_status', auto_save_status, flag);
        },

        get_save_status:function(){
            return this.get('save_status') || "";
        },

        set_save_status:function(save_status,flag){
           this.set('save_status',save_status,flag);
        }
    });

    var compute_day=function(version){
        if(version>=today){
            return 1;
        }else if(version>=yesterday){
            return 2;
        }else if(version >=last7day){
            return 3;
        }else{
            return 4
        }
    }

    return record;
});