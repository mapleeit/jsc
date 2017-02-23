/**
 * 工具条的状态
 * @author jameszuo
 * @date 13-7-25
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),

        undef;

    var Status = function (o) {
        this._is_vir_dir = !!o.is_vir_dir;
        this._has_broken = !!o.has_broken;
        this._has_no_del = !!o.has_no_del;
        this._has_no_move = !!o.has_no_move;
        this._has_no_rename = !!o.has_no_rename;
        this._has_no_down = !!o.has_no_down;
        this._has_multi = !!o.has_multi;
        this._has_dir = !!o.has_dir;
        this._has_qq_disk = !!o.has_qq_disk;
        this._has_net_fav = !!o.has_net_fav;
        this._has_empty_file = !!o.has_empty_file;
        this._only_1_file = !!o.only_1_file;
        this._count = o.count || 0;
    };
    Status.prototype = {
        /**
         * 判断是否是虚拟目录
         * @returns {Boolean}
         */
        is_vir_dir: function () {
            return this._is_vir_dir;
        },
        /**
         * 包含破损文件
         * @returns {Boolean}
         */
        has_broken: function () {
            return this._has_broken;
        },
        /**
         * 有不允许删除的文件
         * @returns {Boolean}
         */
        has_no_del: function () {
            return this._has_no_del;
        },
        /**
         * 有不允许移动的文件
         * @returns {Boolean}
         */
        has_no_move: function () {
            return this._has_no_move;
        },
        /**
         * 包含不允许重命名的文件
         * @returns {Boolean}
         */
        has_no_rename: function () {
            return this._has_no_rename;
        },
        /**
         * 包含不允许下载的文件
         * @returns {Boolean}
         */
        has_no_down: function () {
            return this._has_no_down;
        },
        /**
         * 多个文件、目录
         * @returns {Boolean}
         */
        has_multi: function () {
            return this._has_multi;
        },
        /**
         * 有目录
         * @returns {Boolean}
         */
        has_dir: function () {
            return this._has_dir;
        },
        /**
         * 有QQ硬盘目录
         * @returns {Boolean}
         */
        has_qq_disk: function () {
            return this._has_qq_disk;
        },
        /**
         * 有网络收藏夹目录
         * @returns {Boolean}
         */
        has_net_fav: function () {
            return this._has_net_fav;
        },
        /**
         * 包含空文件
         * @returns {Boolean}
         */
        has_empty_file: function () {
            return this._has_empty_file;
        },
        /**
         * 只有一个『文件』
         * @returns {Boolean}
         */
        only_1_file: function () {
            return this._only_1_file;
        },
        /**
         * 获取选中文件的个数
         * @return Number
         */
        get_count: function () {
            return this._count;
        }
    };

    return Status;
});