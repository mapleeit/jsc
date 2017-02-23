/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 14-9-3
 * Time: 上午11:13
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        inherit = lib.get('./inherit'),
        console = lib.get('./console'),
        Event = lib.get('./Event'),
        request = common.get('./request'),
        ret_msgs = common.get('./ret_msgs'),
        query_user = common.get('./query_user'),
        https_tool = common.get('./util.https_tool'),
        update_cookie = common.get('./update_cookie'),
        Record = require('./record'),
        $ = require('$'),
        REQUEST_CGI = 'http://web2.cgi.weiyun.com/weiyun_note.fcg',
        undefined;

    var Loader = inherit(Event, {
        load_cfg: {
            count: 20,
            order_type: 0
        },
        constructor: function (cfg) {
            $.extend(this, cfg);
        },
        load_list: function (is_refresh) {
            var me = this;
            if (me._last_load_req) {//有请求未完成，则要先清除
                me._last_load_req.destroy();
            }
            me._loading = true;
            me.load_cfg.offset= !!is_refresh ? 0:me.store.size();
            if(me.store.size()>0 && !is_refresh){
                me.trigger('show_load_more');
            }
            me._last_load_req = request
                .xhr_get({
                    url: REQUEST_CGI,
                    cmd: "NotePageListGet",
                    re_try: 3,
                    pb_v2: true,
                    cavil: true,
                    body: me.load_cfg
                })
                .ok(function (msg, body) {
                    var records = [];
                    if (body.items && body.items.length > 0) {
                        records = me.generateRecords(body.items);
                    }else{
                        //本次拉取的个数为0时,代表没有后续的文档了
                        me._load_done=true;
                    }
                    me.trigger('load_list', records, is_refresh);
                })
                .fail(function (msg, ret) {
                    if(ret_msgs.is_sess_timeout(ret)) {
                        update_cookie.update(function() {
                            me.load_list(is_refresh);
                        });
                    } else {
                        me.trigger('error', msg, ret);
                    }
                }).done(function (msg, ret) {
                    if(ret_msgs.is_sess_timeout(ret)) {
                        return;
                    }
                    me._loading=false;
                    me.trigger('hide_load_more');
                });
        },

        generateRecords: function (items) {
            if (!$.isArray(items)) {
                console.error('Loader.js->generateRecords: cgi返回的数据格式不对');
                return;
            }
            var records = [];
            $.each(items, function (i, item) {
                var record;
                if(item.note_basic_info.thumb_url) {
                    item.note_basic_info.thumb_url = https_tool.translate_notepic_url(item.note_basic_info.thumb_url);
                }
                record = new Record(item);
                records.push(record);
            });

            return records;
        },

        load_detail: function (noteitem) {
            var me = this;
            if (me._last_load_detail_req) {//有请求未完成，则要先清除
                me._last_load_detail_req.destroy();
            }
            me._last_load_detail_req = request
                .xhr_get({
                    url: REQUEST_CGI,
                    cmd: "NoteDetail",
                    re_try: 3,
                    pb_v2: true,
                    body: {
                        note_id: noteitem.get_id()
                    }
                })
                .ok(function (msg, body) {
                    noteitem.set('item_htmltext', body.item.item_htmltext, true);
                    noteitem.set('item_article', body.item.item_article, true);
                    me.trigger('show_note', noteitem);
                })
                .fail(function (msg, ret) {
                    if(ret_msgs.is_sess_timeout(ret)) {
                        update_cookie.update(function() {
                            me.load_detail(noteitem);
                        });
                    } else {
                        me.trigger('error', msg, ret);
                    }
                });
        },

        is_loading: function () {
            return this._loading;
        },

        is_all_load_done: function () {
            return this._load_done;
        }

    });

    return Loader;

});


