/**
 * 笔记对象类
 * @date 2015-07-29
 * @author hibincheng
 */
define(function(require, exports, module) {

    function NoteNode(opt) {
        this._id = opt.note_id;
        this._name = opt.note_title;
        this._create_time = opt.note_ctime;
        this._modify_time = opt.note_mtime;
    }

    NoteNode.prototype = {

        is_dir: function() {
            return false;
        },

        is_image: function() {
            return false;
        },

        is_note: function() {
            return true;
        },

        get_id: function() {
            return this._id;
        },

        get_pid: function() {
            if(this.get_parent()) {
                return this.get_parent().get_id();
            }

        },

        get_pdir_key: function() {
            return this.get_pid();
        },

        get_name: function() {
            return this._name;
        },

        get_create_time: function() {
            return this._create_time;
        },

        get_modify_time: function() {
            return this._modify_time;
        },

        get_type: function() {
            return 'note';
        },

        //===========================

        set_parent: function(parent) {
            this._parent = parent;
        },

        get_parent: function() {
            return this._parent;
        }
    }

    return NoteNode;
});