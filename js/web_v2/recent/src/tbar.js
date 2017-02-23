/**
 * 工具条
 * @author jameszuo
 * @date 13-7-25
 */
/*global RegExp,document,parseInt,undefined,setTimeout,clearTimeout,setInterval,clearInterval,eval,define,length,alert*/
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console').namespace('recent/tbar'),

        Module = common.get('./module'),
        constants = common.get('./constants'),
        Toolbar = common.get('./ui.toolbar.toolbar'),
        Button = common.get('./ui.toolbar.button'),
        user_log = common.get('./user_log'),

        toolbar,

        undef;


    return new Module('recent_tbar', {

        /**
         * 渲染工具栏
         * @param $to 工具类添加的位置
         */
        render: function ($to) {
            var me = this,
                default_handler = function (e) {   //  this -> Button / ButtonGroup
                    if (this.is_enable()) {
                        me.trigger(this.get_id(), e);
                        e.stopImmediatePropagation();
                    }
                },

                btns = [

                    //清空记录按钮
                    new Button({
                        id: 'clear_recent',
                        label: '清空记录',
                        icon: 'ico-clearrecnet',
                        filter: 'normal',
                        handler: default_handler
                    }),

                    //刷新按钮
                    new Button({
                        id: 'refresh',
                        label: '',
                        icon: 'ico-ref',
                        filter: 'normal',
                        short_key: 'ctrl+alt+r',
                        handler: default_handler
                    })
                ];


            toolbar = new Toolbar({
                btns: btns,
                cls: 'recent-toolbar',
                filter_visible: true
            });
            toolbar.render($to);
        }
    });
});