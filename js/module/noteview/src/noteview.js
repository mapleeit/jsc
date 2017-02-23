define(function (require, exports, module) {
    exports.name = 'hello';
    var CheckBoxFeature = require("./tfl-extend.checkbox");
    var SecurityFilter = require("./tfl-extend.security_filter");
    //var photo_upload = require('./photo_upload');
	var htmlHelper = require("./html-to-text");
    var C = {};
    var DefineConstValue = function () {
        // 按钮状态
        this.STATE_NORMAL = 0;
        this.STATE_IS_SAVING = 1;
        this.STATE_SAVE_COMPLETE = 2;
        this.STATE_SAVE_FAILD = 3;

        // 笔记类型
        this.NOTE_TYPE_ARTICLE = 1;
        this.NOTE_TYPE_HTMLTEXT = 2;

        // 最大分段文本长度
        this.MAX_STEP_ARGUMENT_LENGTH = 10 * 1024;

        // 最大笔记长度200kb
        this.MAX_CONTENTLENGTH = 200 * 1024;
    };
    DefineConstValue.call(C);

    var $ = exports.jQuery = require('$');
    var tfl_editor_extender = require('./tfl-editor-extender');
    var editor = null;
    var current_session_id = "0";
    var is_editor_ready = false;
    var save_state = C.STATE_NORMAL;
    var savestate_timer = null;

    var GetNoteContent = function () {
        var result = editor.getJsonContent();
        $.extend(result, {"session_id": current_session_id});
        return result;
    };

    /*
     * 更新笔记内容的回调
     */
    var UpdateWeiyunClientContent = function (session_id, cache_id) {
        // 调用微云客户端接口, 通知微云客户端更新笔记数据. 使用推的模式+拆分参数.
        var strContent = JSON.stringify(GetNoteContent());
        if (window.external && window.external.CallWeiyunClient_UpdateContent_Begin) {
            var strUpdateCache = "false";
            if (cache_id != undefined) {
                session_id = cache_id;
                strUpdateCache = "true";
            }
            window.external.CallWeiyunClient_UpdateContent_Begin(session_id, strUpdateCache);
            var index = 0;
            var length = strContent.length;
            var step = C.MAX_STEP_ARGUMENT_LENGTH;
            while (index < length) {
                window.external.CallWeiyunClient_UpdateContent_Step(session_id, strContent.substr(index, step));
                index += step;
            }
            window.external.CallWeiyunClient_UpdateContent_End(session_id);
        } else {
            //alert('保存');
        }
    };

    var ChangeSaveButtonStyle = function () {
        $(".editor-ico-save").append($('<p class="editor-ico-save-p">').text("保存"));
        SetSaveButtonState(C.STATE_NORMAL);
    };

    var SetSaveButtonState = function (state) {
        var $btn = $(".editor-ico-save");
        if (state == C.STATE_NORMAL) {
            $btn.children("p").text("保存");
            $btn.removeClass("disable");
        }
        else if (state == C.STATE_IS_SAVING) {
            $btn_text = $btn.children("p");
            $btn.children("p").html("<img src='./img/loading_btn.gif'>");
            $btn_text.children("img").css("margin", "5px");
            $btn.addClass("disable");
        }
        else if (state == C.STATE_SAVE_COMPLETE) {
            $btn.children("p").text("已保存");
            $btn.addClass("disable");
        }
        else if (state == C.STATE_SAVE_FAILD) {
            $btn.children("p").text("未保存");
            $btn.addClass("disable");
        }
        save_state = state;
    };

    var OnNoteViewReady = function () {
        if (!Function.prototype.bind) {       //ie8 以下兼容
            Function.prototype.bind = function (oThis) {
                if (typeof this !== "function") {
                    // closest thing possible to the ECMAScript 5 internal IsCallable function
                    throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
                }
                var aArgs = Array.prototype.slice.call(arguments, 1),
                    fToBind = this,
                    fNOP = function () {},
                    fBound = function () {
                        return fToBind.apply(this instanceof fNOP && oThis
                            ? this
                            : oThis,
                            aArgs.concat(Array.prototype.slice.call(arguments)));
                    };
                fNOP.prototype = this.prototype;
                fBound.prototype = new fNOP();
                return fBound;
            };
        }
        if(!String.prototype.trim){
            String.prototype.trim=function(){
                return this.replace(/(^\s*)|(\s*$)/g, "");
            }
        }

        editor = TFL.editor.instances["tflEditor"];
        editor.eventMgr.on('button_save', OnSaveButtonClick);
        editor.eventMgr.on('button_insert', OnInsertImage);
        editor.eventMgr.on('onchange', OnNoteContentChange);
        editor.eventMgr.on('paste_base64', OnPasteBase64);
        CheckBoxFeature.InstallToEditor(editor);
        SecurityFilter.InstallToEditor(editor);
        editor.eventMgr.on('onAfterPaste', OnAfterPaste.bind(editor));
        ChangeSaveButtonStyle();

        //绑定上传图片的事件
        //photo_upload._bind_events();
    };

    var CheckNeedSave = (function () {
        var last_save_session_id = null;
        var last_save_time = null;

        /**
         * @returns {boolean}
         */
        function FuncCheckNeedSave(session_id) {
            if (last_save_session_id == session_id) {
                // 1s的延迟
                var timeStamp = new Date().getTime();
                if (timeStamp - last_save_time > 1000) {
                    last_save_time = timeStamp;
                    return true;
                }
                return false;
            } else {
                last_save_session_id = session_id;
                last_save_time = new Date().getTime();
                return true;
            }
        }

        return FuncCheckNeedSave;
    })();

    var OnSaveButtonClick = function (autosave) {
        var me = this;
        if (!CheckNeedSave(current_session_id) || editor.doc.body.innerHTML.length == 0) {
            return;
        }

        if (window.external && window.external.CallWeiyunClient_SaveNote) {
            UpdateWeiyunClientContent(current_session_id, undefined);
            window.external.CallWeiyunClient_SaveNote(current_session_id, "", "false");
        } else {
            if (window.parent && window.parent.call_save_note) {
                window.parent.call_save_note(current_session_id, GetNoteContent(),autosave);
            }
        }
    };
    var OnInsertImage = function () {
        if (window.external &&  window.external.CallWeiyunClient_InsertImage) {
            window.external.CallWeiyunClient_InsertImage(JSON.stringify(GetNoteContent()));
        } else {
            var inputObj = document.createElement('input')
            inputObj.setAttribute('id', '_ef');
            inputObj.setAttribute('type', 'file');
            inputObj.setAttribute("style", 'visibility:hidden');
            document.body.appendChild(inputObj);
            inputObj.click();
            //    inputObj.value ;
        }
    };
    var OnNoteContentChange = function (changeSuccess) {
        var $btn = $(".editor-ico-save");
        if (save_state == C.STATE_NORMAL && $btn.hasClass('disable')) {
            SetSaveButtonState(C.STATE_NORMAL);
        }
        if (window.external && window.external.CallWeiyunClient_OnDocumentChange) {
            window.external.CallWeiyunClient_OnDocumentChange(current_session_id, 'NO_IME');
        }else{
           // alert('test');
            if(changeSuccess === false) {
                window.parent && window.parent.call_note_show_tip && window.parent.call_note_show_tip('warn', '笔记内容字数超限，请另新建笔记');
            }
        }
    };
    var OnPasteBase64 = function (result) {
        UpdateWeiyunClientContent(current_session_id, undefined);
        if (window.external && window.external.CallWeiyunClient_OnPasteImageBuffer_Begin) {
            var base64 = result.split(',')[1];
            var index = 0;
            var length = base64.length;
            var step = C.MAX_STEP_ARGUMENT_LENGTH;
            window.external.CallWeiyunClient_OnPasteImageBuffer_Begin(current_session_id);
            while (index < length) {
                window.external.CallWeiyunClient_OnPasteImageBuffer_Step(current_session_id, base64.substr(index, step));
                index += step;
            }
            window.external.CallWeiyunClient_OnPasteImageBuffer_End(current_session_id);
        } else {
            _console.error('CallWeiyunClient_OnPasteImageBuffer_Begin Not exist!');
        }
    };
    var OnAfterPaste = function () {
        var editor = this;

        var MAX_CONTENT = editor.options.max_content;
        if (editor.doc.body.innerHTML.length > MAX_CONTENT) {
            editor.doc.body.innerHTML = editor.doc.body.innerHTML.substr(0, MAX_CONTENT);
        }
    };

    exports.InitNoteView = function (id) {
        // 这里对tfl控件做微云自己的扩展
        tfl_editor_extender();
        // 这里初始化editor控件
        // 创建之前, 修改一下对齐的tips
        TFL.editor.lang({'justify': '对齐调整'});
        TFL.editor({
            id: "tflEditor",
            needFocus: false,
            buttonsRight: [],
            hasBtnText: [],
            afterCreate: function () {
                editor = TFL.editor.instances["tflEditor"];
                var $toolbar = editor.toolbar;
                var $editor = editor.editor;
                var $htmlNode = $('html');
                if(!$.browser.msie  || $.browser.version > 8){
                    $editor.addClass('editor-maximize');
                }else{
                    $editor.width('100%');
                }
                $('body').addClass('body-editor-maximize');
                $editor.find('.editor-area').height($editor.height() - $toolbar.outerHeight() - 1);
                $htmlNode.addClass('html-overflow-hidden');
                is_editor_ready = true;
                OnNoteViewReady();
            },
            buttons: [
                'bold', 'italic', 'underline',
                'font', 'size', 'color',
                'insertunorderedlist', 'insertorderedlist', 'justify',
                'indent', 'outdent', 'checkbox', 'uploadimage'
            ],
            justify: ['justifyleft', 'justifycenter', 'justifyright'],
            buttonsRight: ['save'],
            max_content: C.MAX_CONTENTLENGTH
        });
    };

    exports.CallJS_ResizeExitorArea=function(height,width){
        var $editor = TFL.editor.instances["tflEditor"].editor;
        if($.browser.msie && $.browser.version <= 8){
            if(width && width>0){
                $editor.width(width);
            }
            $editor.find('.editor-area').height(height - 50);
        }else{
            $editor.find('.editor-area').height(height-45);
        }

    }

    exports.CallJS_ShowNote = (function () {
        var time_out = null;

        function ShowNote(session_note_id, note_type, html_context, url) {
            // 如果编辑器没有准备好, 那么延迟显示内容
            var $arguments = arguments;
            var self = this;
            if (time_out != null) {
                clearTimeout(time_out);
                time_out = null;
            }
            if (is_editor_ready == false) {
                // _console.log('try show note next 1 second!');
                time_out = setTimeout(function () {
                    ShowNote.apply(self, $arguments);
                }, 1000);
                return "delay";
            }
            current_session_id = session_note_id;

            if (note_type != C.NOTE_TYPE_ARTICLE) {
                var focus = false;
                var $tflEditor=$('#tflEditor');
                $('#note_viewer').show();

                SetSaveButtonState(C.STATE_NORMAL);

	            //过滤xss
	            html_context = htmlHelper.HtmlToSafe(html_context);

                if(session_note_id =="" && (html_context=='<br>' || html_context=='')){
                    editor.setHtml('<div/>');   // ie兼容 新建笔记逻辑. 否则会导致编辑器换行的间隙出现问题
                }else{
                    editor.setHtml(html_context);
                }
                if (html_context.length == 0) {
                    var $btn = $(".editor-ico-save");
                    $btn.addClass('disable');
                }
            }
            return "done!";
        }

        return ShowNote;
    })();

    exports.CallJS_ChangeSaveState = function (session_note_id, state) {
//        if (current_session_id != session_note_id) {
//            return;
//        }

        SetSaveButtonState(state);

        /**
         * 在{timeout}时间内, 从{{old_state}}恢复成原来的{{new_state}}状态
         * 使用统一的{{timer}}对象
         * @returns {Object}
         */
        var ResumeSaveState = function (session_id, old_state, new_state, timer, timeout) {
            if (timer != null) {
                clearTimeout(timer);
            }
            return setTimeout(function () {
                if (current_session_id != session_id)
                    return;
                if (old_state != save_state)
                    return;
                SetSaveButtonState(new_state);
            }, timeout);
        };

        if (state == C.STATE_SAVE_COMPLETE || state == C.STATE_SAVE_FAILD) {
            savestate_timer = ResumeSaveState(session_note_id, state, C.STATE_NORMAL, savestate_timer, 2000);
        }
    };

    exports.CallJS_WeiYunInsertImage = function (src, border, margin, width, height) {
        var html = '<img src="' + src + '" class="wyimage" ' + 'alt="img" style="' +
            (border ? 'border:' + border + 'px solid black;' : '') +
            (margin ? 'margin:' + margin + 'px;' : '') + '" ' +
            (width ? 'width="' + width + '" ' : '') +
            (height ? 'height="' + height + '" ' : '') + '/>';
        editor.insertHtml(html);
        editor.eventMgr.emit('onchange');
    };

    exports.CallJS_WebWeiYunInsertImage = function (config) {
        var src=config.url;
        window.current_upload_img_src=src;
        //var border, margin,width,height;

        var img = new Image();
        img.className = 'wyimage';
        img.style = 'display: none';
        //var html = '<img src="' + src + '" ' + ' onload="console.log(1);" ' + ' class="wyimage" alt="img" style="' +
        //    (border ? 'border:' + border + 'px solid black;' : '') +
        //    (margin ? 'margin:' + margin + 'px;' : '') + '" ' +
        //    (width ? 'width="' + width + '" ' : '') +
        //    (height ? 'height="' + height + '" ' : '') + '/>';
        //editor.insertHtml(html);
        img.onload = function() {
            window.parent.parent.call_close_note_pic_upload_mask();
            window.current_upload_img_src = null;
            window.CallJS_WeiYunInsertImage(this.src);
            //this.remove();
        };
	    img.src = src;  //window.parent.parent.call_close_note_pic_upload_mask();window.current_upload_img_src=null;window.CallJS_WeiYunInsertImage(this.src);
        editor.eventMgr.emit('onchange');
    };

    exports.CallJS_UpdateImageUrl = function (src_url, replace_url) {
        if(src_url == null){
            src_url=window.current_upload_img_src;
            window.current_upload_img_src=null;
        }
        if(src_url == null){
            return;
        }
        $(editor.doc.body).find('img').each(function (index, obj) {
            if (obj.src == src_url) {
                if (replace_url == null) {
                    obj.remove();
                } else {
                    obj.src = replace_url;
                }
            }
        });
    };

    /*
     * 心跳函数
     */
    exports.CallJS_NoteEcho = function (seq) {
        if (window.external &&  window.external.CallWeiyunClient_EchoFromJS) {
            window.external.CallWeiyunClient_EchoFromJS(seq);
        }
    };

    /*
     * 客户端发起保存缓存的异步调用
     */
    exports.CallJS_SaveCacheFromWeiyun = function (session_id, cache_id) {
        if (session_id != current_session_id) {
            window.external.CallWeiyunClient_SaveCacheFail(cache_id);
            return;
        }
        UpdateWeiyunClientContent(session_id, cache_id); // 更新缓存
    };

    /*
     * 从客户端发过来的save
     */
    exports.CallJS_SaveFromWeiyun = function (session_id, autosave) {
        if (session_id != current_session_id)
            return;
        if(window.external && window.external.CallWeiyunClient_SaveNote){
            UpdateWeiyunClientContent(session_id, undefined);
            window.external.CallWeiyunClient_SaveNote(current_session_id, "", autosave);
        }else{
            //web 逻辑
            OnSaveButtonClick(autosave);
        }
    };
    /*
     *取消图片上传
     */
    exports.CallJS_CancelUploadPic=function(){
        $('#weiyun_note_edit_pic_upload_iframe').remove();
    };
    //获取笔记内容
    exports.CallJS_GetNoteContent=GetNoteContent;
});