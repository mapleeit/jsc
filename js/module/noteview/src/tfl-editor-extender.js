define(function(require, exports, module) {
    var EventEmitter = require("./EventEmitter").EventEmitter2;
    var $ = require('$');


    /*
     * 这里添加了保存按钮的处理逻辑
     */
    var AddSaveButton = function() {
        TFL.editor.add('save',function(ui){
            var self = this;
            self.eventMgr.emit('button_save');
        });
    };

    /*
     * 这里覆盖了原来editor的图片按钮逻辑
     */
    var AddImageButton = function() {
        //上传图片
        //TFL.editor.add('uploadimage', function(ui){
        //    var self = this;
        //    self.eventMgr.emit('button_insert');
        //});
    };

    /*
     * 添加checkbox点击事件
     */
    var AddCheckboxButton = function() {
        TFL.editor.add('checkbox', function(ui){
            var self = this;
            self.eventMgr.emit('button_checkbox');
        });
        TFL.editor.lang({'checkbox': '插入复选框'});
    };

    var InstallOnChangeEvent = function(obj) {
        var ON_CHANGE_NOTIFY_TIME = 500;
        var timer = null;
        var bHasPendingNotify = false;
        var ignoreKeys = {
            16:1, 17:1, 18:1,   //shift, ctrl, alt
            37:1, 38:1, 39:1, 40:1  //方向键
        };

        var fireChange = function(obj, e) {
            if (obj.doc.body.innerHTML.length >= obj.options.max_content) {
                if (e && e.keyCode != 8 && e.keyCode != 46) {
                    e.preventDefault();
                }
                obj.eventMgr.emit('onchange', false);
                obj.lastChangeTime = new Date().getTime();
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                return;
            }

            var timeStamp = new Date().getTime();
            if (timeStamp - obj.lastChangeTime > ON_CHANGE_NOTIFY_TIME) {
	            if(e.type === 'paste') {
		            obj.eventMgr.emit('onPaste');
	            }
	            obj.eventMgr.emit('onchange');
                obj.lastChangeTime = timeStamp;
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
            } else if (timer == null) {
                timer = setTimeout(function(){
	                if(e.type === 'paste') {
		                obj.eventMgr.emit('onPaste');
	                }
                    obj.eventMgr.emit('onchange');
                    obj.lastChangeTime = timeStamp;
                    timer = null;
                }, ON_CHANGE_NOTIFY_TIME);
            }
        };

        $(obj.doc.body).on('change keyup paste', function(e) {
            if (e.type==="keyup") {
                if (!ignoreKeys[e.keyCode] && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    fireChange(obj, e);
                }
            } else if (e.type==="change") {
                fireChange(obj);
            } else if (e.type==="paste") {
	            setTimeout(function() {
		            fireChange(obj, e);
	            }, 0);
            }
        });
    };

    var InstallMaxContentLimit = function(obj) {
        var passthroughKeys = {
            37:1, 38:1, 39:1, 40:1,  //方向键
            46:1, 8: 1 // 删除键
        };
        $(obj.win).bind('keydown', function(e) {
           if (obj.doc.body.innerHTML.length >= obj.options.max_content && obj.isSelectRangeEmpty()) {
               if (!e.ctrlKey && !e.metaKey && !e.altKey && !passthroughKeys[e.keyCode]) {
                   e.preventDefault();
               }
           }
        });
    };

    var InstallOnWindowResize = function(obj) {
        $(obj.win).resize(function(e){
            obj.eventMgr.emit('resize', e);
        });
    };

    var InstallOnSaveShortcut = function(obj) {
        $(obj.win).bind('keydown', function(event) {
            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        obj.eventMgr.emit('button_save');
                        break;
                }
            }
        });
        $(obj.doc).bind('keydown', function(event) {
            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        obj.eventMgr.emit('button_save');
                        break;
                }
            }
        });
    };

    var func = function(obj) {
        var lang = {};
        $.extend(TFL.editor.lang, lang);

        // 继续
        var oldAfterCreate = TFL.editor.handler.prototype._afterCreate;
        var oldHtml = TFL.editor.handler.prototype.html;
        $.extend(TFL.editor.handler.prototype,
            {
                oldHtml: oldHtml,
                setHtml: function(html) {
                    // 设置笔记内容的方法, 追加事件通知
                    // event: setHtml
                    // argument: [html]
                    if (typeof html === 'undefined') {
                        html = this.html();
                    }
                    if (this.filter.setHtml != undefined) {
                        this.filter.setHtml.trigger();
                    }
                    if (this.eventMgr) {
                        var data = [html];
                        this.eventMgr.emit('setHtml', data);
                        html = data[0];
                    }
                    this.cmd.setHtml(html);
                    this.lastChangeTime = 0;
                },
                html: function() {
                    // 获取笔记内容的方法, 追加事件通知
                    // event: html
                    // argument: []
                    html = oldHtml.call(this);
                    if (this.eventMgr) {
                        var data = [html];
                        this.eventMgr.emit('html', data);
                        html = data[0];
                    }
                    return html;
                },
                //获取选中html字符串
                isSelectRangeEmpty: function(){
                    var selection = this.win.getSelection();
                    return selection.type == "Caret";
                },
                _afterCreate: function() {
                    // 在现有编辑器中, 追加一个EventMgr
                    this.filter = {};
                    this.eventMgr = new EventEmitter();
                    oldAfterCreate.call(this);

                    InstallOnChangeEvent(this);
                    InstallOnWindowResize(this);
                    InstallOnSaveShortcut(this);
                    InstallMaxContentLimit(this);
                },
                getJsonContent: function() {
                    // 扩展获取笔记内容的方法
                    var self = this;

                    var htmlHelper = require("./html-to-text");
                    var htmlContent = self.html();

                    var textContent = htmlHelper.HtmlToContent(htmlContent);
	                var textNote = htmlHelper.HtmlToText(htmlContent);
                    var texts = textNote.split('\n');
                    var title;
                    var i = 0;
                    for (i = 0; i < texts.length; ++i) {
                        title = texts[i].trim();
                        if (title.length > 0)
                            break;
                    }
                    var summary = "";
                    for (i = i+1; i < texts.length; ++i) {
                        summary += texts[i].trim();
                        if (summary.length > 50) {
                            summary = summary.substr(0, 50);
                            break;
                        }
                    }
                    var pics = [];
                    var $parent = $("<div>");
                    $parent.html(htmlContent).find('img').each(function(index, obj){
                        var src = $(obj).attr('src');
//                        if (pics.indexOf(src) < 0) {   ie8不兼容
//                            pics.push(src);
//                        }
                        var _exist=false;
                        for(var i=0;i<pics.length;i++){
                             if(pics[i] == src){
                                 _exist=true;
                                 break;
                             }
                        }
                        if(!_exist){
                            pics.push(src);
                        }
                    });
                    return {"content": $parent.html(), "text": textContent, "title": title, "summary":summary, "pics":pics};
                },
                _pasteBase64: function(){
                    var self = this, clipboardData, items, item;
                    $(self.win).bind('paste', function(e){
                        //支持clipboardData浏览器
                        if(e && (clipboardData = e.originalEvent.clipboardData)
                             && (items = clipboardData.items) && (item = items[0])) {
                            for (var i in items) {
                                var item = items[i];
                                if( item.kind =='file' && item.type.match(/^image\//i) ) {
                                    var blob = item.getAsFile();
                                    var xhr2_http = {
                                        _xhr: null,
                                        _get: function () {
                                            var me = this;
                                            if (!me._xhr) {
                                                me._xhr = new XMLHttpRequest();
                                            }
                                            return me._xhr;
                                        },
                                        get: function () {
                                            var me = this;
                                            me.abort();
                                            me._get().open('post', 'https://user.weiyun.com/wx/pic_uploader.fcg?appid=30012', true);
                                            return me._xhr;
                                        },
                                        abort: function () {
                                            this._get().abort();
                                        }
                                    };
                                    var xhr = xhr2_http.get(),
                                        formData = new FormData();
                                    formData.append('UploadFile', blob);
                                    xhr.withCredentials=true;
                                    xhr.send(formData);
                                    xhr.onreadystatechange = function () {
                                        var me = this;//xhr对象
                                        if (me.readyState == 4) {
                                            var reg_exp = /\d+/,
                                                ret = me.responseText.match(reg_exp);
                                            if(!ret){
                                                return;
                                            }
                                            ret = ret[0];
                                            if (ret == 0) {
                                                var length=me.responseText.length;
                                                //直接复用了上传图片的CGI
                                                var src_url =  me.responseText.substring(92,length-24);
                                                window.CallJS_WeiYunInsertImage(src_url);
                                            }
                                        }
                                    };
                                    return false;
                                }
                            }


                            return true;
                        }
                    })
                }
            });
        AddSaveButton();
        //AddImageButton();
        AddCheckboxButton();
    };
    return func;
});