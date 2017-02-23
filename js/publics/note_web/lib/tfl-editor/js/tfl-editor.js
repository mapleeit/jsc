TFL.widget("editor", {//editor方法原型
    defaults: {
        id: "",
        value: "",
        width: "",
        height: "",
        minWidth: 600,
        minHeight: 150,
        mode: "0",
        lang: "cn",
        needFocus: false,
        afterCreate: null,
        docToHtmlPath: TFL.getTblPath() + 'apis/doc2html.php?1=1' + (TFL.isDomainSetted() ? ('&domain=' + TFL.getDomain()) : ''),
        imageUploadPath: TFL.getTblPath() + 'apis/qmeditor_upload.php?1=1' + (TFL.isDomainSetted() ? ('&domain=' + TFL.getDomain()) : ''),
//        imageUploadPath: 'http://www.weiyun.com' + (TFL.isDomainSetted() ? ('&domain='+ TFL.getDomain()) : ''),
        showRelativePath: true, //图片是否返回相对路径
        relativeBasePath: '/tfl/', //图片相对路径的前缀
        //ie下使用message传递来跨域(当上传图片和word后台地址跨域时使用)
        useMsgCrossDomain: false,
        imagePrefix: '',
        pasteBase64: true,
        autoStretch: false,
        buttons: [
            'bold', 'italic', 'underline', '|',
            'font', 'size', 'color', '|',
            'insertorderedlist', 'insertunorderedlist', 'justify', '|',
            'link', 'table', 'emoticons', 'uploadimage|uploadimage,netimage', 'screenshot', 'word', '|',
            'source'
        ],
        buttonsRight: ['fullscreen'],
        hasBtnText: ['fullscreen'],
        hasBtnArrow: ['font', 'size', 'color', 'justify'],

        fontname: ['宋体', '微软雅黑', '黑体', '楷体_GB2312', '幼圆', 'Arial', 'Arial Black', 'Comic Sans MS', 'Tahoma'],
        fontsize: ['1', '2', '3', '4', '5', '6'],
        justify: ['justifyleft', 'justifycenter', 'justifyright', 'indent', 'outdent'],
        colors: ['#000000', '#444444', '#666666', '#999999', '#cccccc', '#eeeeee', '#f3f3f3', '#ffffff', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7', '#a64d79', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75', '#741b47', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#073763', '#20124d', '#4c1130'],
        iframeStyle: "body{color:#000000;word-wrap:break-word;font-size:14px;cursor:text;font-family:微软雅黑;padding:6px 8px;margin:2px;background-color:#ffffff;}" +
            "body,p,font,span,div,li{line-height:1.5;}" +
            "ul li{list-style:disc;}" +
            "pre{white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;font-family:tahoma;}" +
            "table{border-collapse:collapse} img {border:none;} p{margin:1em 0;} table p{margin:0;} ol,ul{padding:0; margin:0 0 1em 2em; text-indent:0;} blockquote{margin:0 0 0 40px}" +
            "::-webkit-scrollbar{width:8px;height:10px;border-radius:0;background-color:#f5f6f9;border:solid 1px #eff1f5}::-webkit-scrollbar:hover{background:#DCE1E4}::-webkit-scrollbar-thumb{background-color:#d8dce5}::-webkit-scrollbar-thumb:hover{background-color:#9198a6;border-color:#9198a6}::-webkit-scrollbar-arrow{color:red;background:#0F0}::-webkit-scrollbar-button{width:8px;height:10px;border:1px solid #B5BBBF;display:none}::-webkit-scrollbar-button:hover{border-color:#5F6366}::-webkit-scrollbar-button:vertical:end:decrement,::-webkit-scrollbar-button:vertical:start:increment{display:none}" +
//                     ".webkit-scrollbar::-webkit-scrollbar-track{border-radius:8px; background-color:rgba(0,0,0,0); }" +
//                     ".webkit-scrollbar::-webkit-scrollbar-track:hover{background-color:rgba(0,0,0,0.06); -webkit-box-shadow:-2px 0 0 rgba(255,255,255,1) inset, 1px 0 0 rgba(255,255,255,.9) inset, 0 -1px 0 rgba(255,255,255,.9) inset, 0 1px 0 rgba(255,255,255,.9) inset;}" +
//                     ".webkit-scrollbar::-webkit-scrollbar-track:active{background-color:rgba(0,0,0,0.1)}" +
//                     ".webkit-scrollbar::-webkit-scrollbar-thumb{border-radius:8px; background-color:rgba(0,0,0,.1); -webkit-box-shadow:-2px 0 0 rgba(255,255,255,1) inset, 1px 0 0 rgba(255,255,255,1) inset, 0 -1px 0 rgba(255,255,255,.9) inset, 0 1px 0 rgba(255,255,255,.9) inset;}" +
//                     ".webkit-scrollbar::-webkit-scrollbar-thumb:hover{background-color:rgba(0,0,0,0.4)}" +
//                     ".webkit-scrollbar::-webkit-scrollbar-thumb:active{background:rgba(0,0,0,0.6)}" +
            "img.checkbox_check{content:url(img/transparent.png);background-image:url(img/check_on.png);width:14px;height:14px;cursor:pointer;background-position:-5px -5px}img.checkbox_uncheck{content:url(img/transparent.png);background-image:url(img/check_off.png);width:14px;height:14px;cursor:pointer;background-position:-5px -5px}img.checkbox_uncheck:hover{background-image:url(img/check_off_hover.png)} " +
            "body img{max-width:100%;}",
        max_content: 20000
    },
    _init: function () {
        var self = this, options = self.options;
        if (!options.id) {
            return
        }

	    //ie11+兼容
	    if(!$.browser.msie && (!!window.ActiveXObject || "ActiveXObject" in window)) {
		    $.browser.msie = true;
		    $.browser.mozilla = false;
	    }

        var _beforeCreate = function () {
            if (options.showRelativePath) {
                self.options.imageUploadPath += '&show_relative_path=1&relative_base_path=' + encodeURIComponent(options.relativeBasePath);
                //如果图片使用相对地址,被认为是tapd使用场景,ie下默认开启message跨域
                if ($.browser.msie) {
                    self.options.useMsgCrossDomain = true;
                }
            }
            if (options.imagePrefix) {
                self.options.imageUploadPath += '&image_prefix=' + options.imagePrefix;
            }
            (!TFL.tips && TFL.use('tips'));
            if (options.mode == '1') {
                var obj = $('#' + options.id);
                if (obj.length && !obj.attr('init')) {
                    obj.focus(function () {
                        self._drawEditor();
                    });
                }
            } else {
                self._drawEditor();
            }
        };

        if (options.lang !== 'cn') {//使用其他语言
            var langSrc = (options.lang.indexOf('.js') != -1) ? options.lang :
                TFL.path + 'js/tfl-editor-lang-' + options.lang + '.js';
            TFL.use(langSrc, function () {
                _beforeCreate();
            })
        } else {
            _beforeCreate();
        }
    },
    _drawEditor: function () {
        var self = this, options = self.options, obj = $('#' + options.id);
        if (obj.attr('init') || obj[0].tagName.toLowerCase() != 'textarea') {
            return
        }
        self.isSetDomain = TFL.isDomainSetted();
        TFL.editor.instances[options.id] = self;
        self.obj = obj;
        self.val = options.value || self.obj.val();
        self.obj.hide().addClass('webkit-scrollbar editor-source-obj').attr('init', true);

        var minWidth = options.minWidth, minHeight = options.minHeight,
            editorWidth = options.width ? options.width : self.obj.innerWidth(),
            editorHeight = options.height ? options.height : self.obj.innerHeight();
        editorWidth = (editorWidth < minWidth) ? minWidth : editorWidth;
        editorHeight = (editorHeight < minHeight) ? minHeight : editorHeight;
        if (self.obj.css('width') == 'auto' || options.width == 'auto') {
            editorWidth = 'auto';
        }
        self.editorWidth = editorWidth;
        self.editorHeight = "100%";
        self.editor = $("<div/>").addClass('tfl-editor-wrapper')
            .attr('id', 'editor-' + options.id)
            .css('width', editorWidth);
        self.editArea = $("<div/>").addClass('editor-area').css('height', editorHeight).attr('data-editor-ogheight', editorHeight);
        self.toolbar = self._createToolBar();
        self.iframe = self._createIframe();

        function iframeReady() {
            self.doc = self._iframeDoc();
            self.win = self.iframe.contentWindow;
            self.cmd = TFL.cmd({
                iframe: self.iframe,
                win: self.win,
                doc: self.doc,
                toolbar: self.toolbar
            });
            setTimeout(function () { // 等待append到body里
                self._afterCreate();
            }, 0);
        }

        $(self.iframe).bind('load', function () {
            $(this).unbind('load');
            iframeReady();
        });

        self.editArea.append(self.iframe);
        self.editor.append(self.toolbar).append(self.editArea);
        self.editor.insertBefore(self.obj);
        self.obj.appendTo(self.editArea);

    },
    _createIframe: function () {
        var iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.frameBorder = 0;
        iframe.className = 'editor-iframe';
        if ($.browser.msie) {
            iframe.hideFocus = 'hidefocus';
            if (this.isSetDomain) {
                iframe.src = 'javascript:void(function(){document.open();' +
                    'document.domain = "' + document.domain + '";document.close();}());';
            }
        }
        return iframe;
    },
    _createToolBar: function () {
        var self = this, buttons = self.options.buttons, buttonsRight = self.options.buttonsRight,
            toolbar = $('<div/>').addClass('editor-toolbar');

        $.each(buttons, function (i) {
            var name = buttons[i];

            // 兼容老的调用方式
            if (name === 'image') {
                name = "uploadimage|uploadimage,netimage";
            }
            if (name === 'image|+') {
                name = "uploadimage|uploadimage,netimage,phoneimage"
            }

            if (name == '|') {
                toolbar.append($('<i/>').addClass('editor-separator'));
            } else if (name.split('|').length === 2) {
                // 参数中最后带 '|' 即为按钮组
                var _arrName = name.split('|'), name = _arrName[0], moreName = _arrName[1];
                var btn = $("<span/>").addClass('editor-btn editor-ico editor-ico-' + name).attr({
                    'data-name': name,
                    'unselectable': 'on',
                    'title': editorLang(name)
                });
                var btnMore = $("<span/>").addClass('editor-btn editor-btn-more editor-ico editor-ico-' + name + '_more').attr({
                    'data-name': name + '_more',
                    'unselectable': 'on'
                }).append($('<i/>').addClass('editor-btn-arr'));
                var btnGroup = $('<span/>').addClass('editor-btn-group').append(btn, btnMore);
                toolbar.append(btnGroup);
                if (moreName === '+') {
                    // image|+
                    // 该情况下需要加载一个开发者写的 TFL.editor.add('image_more', ...) 的模块

                    self._loadPlugin(name + '_more');
                } else {
                    // upload|webimage,phoneimage
                    // 该情况下自动加载 webimage, phoneimage 的合并模块

                    var _arrMoreName = moreName.split(',');
                    $.each(_arrMoreName, function (i, value) {
                        self._loadPlugin(value);
                    });
                    TFL.editor.add(name + '_more', function (ui) {
                        var self = this;
                        self.updatePopup(ui, function () {
                            var options = [];
                            $.each(_arrMoreName, function (i, value) {
                                options.push({
                                    name: value,
                                    title: editorLang(value)
                                });
                            })
                            self.menuPicker(options, ui);
                        });
                    });
                }


            } else {
                var btn = $("<span/>").addClass('editor-btn').attr({
                    'data-name': name,
                    'unselectable': 'on',
                    'title': editorLang(name)
                });
                if ($.inArray(name, self.options.hasBtnText) != -1) {
                    btn.append($('<b/>').text(editorLang(name)).addClass('editor-btn-text'))
                        .append($('<i/>').addClass('editor-ico editor-ico-' + name));
                } else {
                    btn.addClass('editor-ico editor-ico-' + name)
                }
                if ($.inArray(name, self.options.hasBtnArrow) != -1) {
                    btn.append($('<i/>').addClass('editor-btn-arr'));
                }
//                if(name == 'screenshot'){
//                    if(DetectActiveX && DetectActiveX()){
//                        btn.attr('title', editorLang('captureScreen'));
//                    }else{
//                        btn.removeClass('editor-ico-screenshot').addClass('editor-ico-screenshot-gray');
//                        btn.attr('title', editorLang('installActive'))
//                    }
//                }
                toolbar.append(btn);
                self._loadPlugin(name);
            }
            if (TFL.editor.buttonOnCreat[name]) {
                TFL.editor.buttonOnCreat[name].call(self, btn);
            }
        });
        $.each(buttonsRight, function (i) {
            var name = buttonsRight[i];
            var btn = $("<span/>").addClass('editor-btn editor-btn-right').attr({
                'data-name': name,
                'unselectable': 'on',
                'title': editorLang(name)
            });
            if ($.inArray(name, self.options.hasBtnText) != -1) {
                btn.append($('<b/>').text(editorLang(name)).addClass('editor-btn-text'))
                    .append($('<i/>').addClass('editor-ico editor-ico-' + name));
            } else {
                btn.addClass('editor-ico editor-ico-' + name)
            }
            toolbar.append(btn);
            self._loadPlugin(name);
            if (TFL.editor.buttonOnCreat[name]) {
                TFL.editor.buttonOnCreat[name].call(self, btn);
            }
        });
        return toolbar;
    },
    _loadPlugin: function (name) {
        if (TFL.editor.modules[name]) {
            return false;
        }
        var isLoad = true,
            url = TFL.path + 'js/tfl-editor-plugin-';
        switch (name) {
            case 'phoneimage':
            case 'image_more':
                url += 'imagemore';
                break;
            default:
                isLoad = false;
        }
        url += '.js?tag=' + TFL.tag;
        isLoad && TFL.use(url);
    },
    _afterCreate: function () {
        var self = this, doc = self.doc, toolbar = self.toolbar,
            editorHtml = self._getDefaultTag(self.val);

        doc.open();
        if (self.isSetDomain) {
            doc.domain = document.domain;
        }
        doc.write('<!DOCTYPE html><html class="webkit-scrollbar"><head><style>' + self.options.iframeStyle + '</style>' +
            '</head><body>' + editorHtml + '</body></html>');
        doc.close();

        if ($.browser.msie) {
            doc.body.disabled = true;
            doc.body.contentEditable = true;
            doc.body.removeAttribute('disabled');
            //fix ie某些异步场景不聚焦
            var focusFix = $('<input style="border:none;width:0;height:0"/>').appendTo(self.toolbar);
            focusFix.focus().remove();
        } else {
            // doc.designMode = "on";

            doc.body.disabled = true;
            doc.body.contentEditable = true;
            doc.designMode = "on";
            doc.execCommand("useCSS", false);
            doc.body.removeAttribute('disabled');
            //fix ie某些异步场景不聚焦
            var focusFix = $('<input style="border:none;width:0;height:0"/>').appendTo(self.toolbar);
            focusFix.focus().remove();
        }


        self.options.autoStretch && self.autoStretchEditor();

        toolbar.delegate('.editor-btn', 'click', function (e) {
            self.focus();
            if (!$(e.target).hasClass('editor-btn-popup')) {
                self.hidePopup();
            } // 如果所点击的按钮没有或没打开浮层，都先关闭浮层
            hideEditorContextMenu();
            var _this = $(this),
                name = _this.attr("data-name");
            if (name && TFL.editor.modules[name]) {
                TFL.editor.modules[name].call(self, _this);
            }
            e.stopPropagation();
        });

        var $doc = $(doc), $win = $(self.win);


        $doc.click(function (e) {
            self.cmd.updateState();
            self.hidePopup();
            hideEditorContextMenu();

            (TFL.userchooser && TFL.userchooser.hideRecentUserPanel());

            if (e.target.tagName.toLowerCase() === 'html' && $.browser.msie) {
                self.cmd.setCaret(this.body, 0);
            }
            this.body.focus();
        }).keydown(function (e) {
                if ($.browser.msie && e.which == 8) {
                    try { //ie下聚焦在图片时，回格会删除全部
                        var node = self.cmd.getNode();
                        if (node.tagName.toLowerCase() == 'img') {
                            e.preventDefault();
                            $(node).remove();
                        }
                    } catch (e) {
                    }
                }

            }).keyup(function (e) {
                if (self.editor.hasClass('borderRed')) {
                    self.editor.removeClass('borderRed');
                }
                if (e.which === 8) {  // Backspace
                    self.cmd.updateState();
                }

                /*	if (self.isEmpty()) { // 会导致多次调用 formatHTML，暂时屏蔽
                 self.toolbar.find('.editor-toolbar-shadow').hide();
                 }*/
                if ($.browser.msie) {
                    //ie下清空内容时,还原div换行
                    var htmlText = $.trim(self.doc.body.innerHTML);
                    if (htmlText == '' || htmlText == '<P>&nbsp;</P>' || htmlText == '<p>&nbsp;</p>') {
                        self.doc.body.innerHTML = '<div>&nbsp;</div>';
                        self._fixIEBreakLineFocus();
                    }
                }

                $(doc.body).trigger('contentchange');
            }).bind('contentchange', function () {
                self.options.autoStretch && self.autoStretchEditor();
            });

        $('html').unbind('click', self.hidePopup).click(self.hidePopup);

        $('form').submit(function () {
            self.setValue();
        });

        if ($.browser.msie) {//ie下保存鼠标位置
            var bookmark, $iframe = $(self.iframe);
            $iframe.bind('beforedeactivate', function () {
                try {
                    var range = doc.selection.createRange();
                    bookmark = range.getBookmark();
                } catch (e) {
                }
            });
            $iframe.bind('activate', function () {
                if (bookmark) {
                    var range = doc.body.createTextRange();
                    range.moveToBookmark(bookmark);
                    range.select();
                    bookmark = null
                }
            })
        }
        ;

//        if (DetectActiveX && DetectActiveX()) {
//            //截屏控件粘贴
//            if ($.browser.msie) {
//                $doc.bind('keydown', function(e){
//                    if(e.ctrlKey && e.keyCode == 86){
//                        return self._ifUploadImg();
//                    }
//                });
//            } else {
//                $win.bind('paste', function(){
//                    return self._ifUploadImg();
//                });
//            }
//        } else {
//            //粘贴base64
        self.options.pasteBase64 && self._pasteBase64();
//        };

        $win.focus(function () {
            self._trigger('focus', self.obj);
        }).blur(function () {
                self._trigger('blur', self.obj);
            });

        $win.add(self.obj).scroll(function () {
            var sd = self.toolbar.find('.editor-toolbar-shadow');
            if ($(this).scrollTop() > 0) {
                if (!sd.length) {
                    self.toolbar.append('<div class="editor-toolbar-shadow"></div>');
                } else {
                    sd.show();
                }
            } else {
                sd.hide();
            }
        });

        if ($.browser.msie) {//fix ie后退bug
            $win.unload(function () {
                history.go(-1);
            });
        }

        if ($doc.find('table').length) {
            //初始化表格右键
            TFL.editor.modules['table'].call(self, self.toolbar.find('.editor-ico-table'), true);
        }
        ;

        if (self.options.mode == '1' || self.options.needFocus) {
            setTimeout(function () {
                self.focus();
                //chrome下容易触发文字选中
                if ($.browser.webkit) {
                    try {
                        window.getSelection().removeAllRanges();
                    } catch (e) {
                    }
                }
            }, 0);
        }
        ;


        // $(doc.body).bind('paste', function(){
        //  // ie 的 paste 绑定在 window 和 document 上无效
        //  setTimeout(function() {
        //      self.doc.body.innerHTML = formatHTML(self.doc.body.innerHTML);
        //  }, 100);
        // });


        self._trigger('afterCreate', self.obj);

    },
    _ifUploadImg: function () {
        var self = this;
        if (uploadCustomImg.call(self, false)) {
            return false;
        }
        return true;
    },
    _iframeDoc: function () {
        var iframe = this.iframe;
        return iframe.contentDocument || iframe.contentWindow.document;
    },
    _createPopup: function () {
        var self = this, popup = $('<div/>').addClass('editor-popup');
        self.toolbar.append(popup);
        self.popup = popup;
        return popup;
    },
    //如果为空则给出默认标签，方便统一换行样式
    _getDefaultTag: function (value) {
        var browser = $.browser,
            isEmpty = (value == '' || value == '<br/>');
        if (browser.msie && isEmpty) {
            value = '<div></div>';
        } else if (browser.opera && isEmpty) {
            value = '<div>&nbsp;</div>';
        }
        return value;
    },
    _fixIEBreakLineFocus: function () {
        var r = this.doc.body.createTextRange();
        r.collapse(true);
        r.select();
    },
    _pasteBase64: function () {
        if ($.browser.msie || TFL.browser.is('safari')) { // safari下无法截图
            return
        }
        var self = this, clipboardData, items, item;
        $(self.win).bind('paste', function (e) {
            //支持clipboardData浏览器
            if (e && (clipboardData = e.originalEvent.clipboardData)
                && (items = clipboardData.items ) && ( item = items[0] )
                ) {
                if (item.kind == 'file' && item.type.match(/^image\//i)) {
                    var blob = item.getAsFile(), reader = new FileReader();
                    reader.onload = function () {
                        self._replaceRemoteImg(event.target.result);
                    }
                    reader.readAsDataURL(blob);
                    return false;
                } else {
                    return true;
                }
            }
            setTimeout(function () {
                //其他浏览器在粘贴后插入指定dom来判断
                var pasteHelperStr = '<span id="tfl-paste"></span>';
                self.insertHtml(pasteHelperStr);
                var targetImg = self._getPrevImgFromHelper('#tfl-paste');
                if (targetImg.length) {
                    var src = targetImg.attr('src');
                    if (src.indexOf('data:image') == 0) {
                        targetImg.remove();
                        self._replaceRemoteImg(src);
                    }
                }

            }, 0);

        })
    },
    _replaceRemoteImg: function (base64) {
        var self = this, targetImg = self.getImgUploadLoading();
        $.post(
            self.options.imageUploadPath,
            {
                from: "snapscreen",
                base64: true,
                content: base64
            },
            function (ret) {
                ret = self.trimScripTag(ret);
                targetImg.attr('src', ret);
                $(this.doc.body).trigger('contentchange')
            }
        );
    },
    _getPrevImgFromHelper: function (id) {
        var pasteHelper = $(this.doc).find(id),
            targetImg = pasteHelper.prev('img').length ? pasteHelper.prev('img') : pasteHelper.prev().find('img:last');
        pasteHelper.remove();
        return targetImg;
    },
    getImgUploadLoading: function () {
        var self = this, loadingSrc = TFL.path + 'img/loading.gif',
            loadingHelperStr = '<img src="' + loadingSrc + '" /><span id="tfl-paste-loading">111</span>';
        self.insertHtml(loadingHelperStr);
        return self._getPrevImgFromHelper('#tfl-paste-loading');
    },
    html: function () {
        var self = this,
            html = self.obj.is(':visible') ? self.obj.val() : self.doc.body.innerHTML; // 代码模式为textarea, 实时模式为html
        return formatHTML(html, false);
    },
    isEmpty: function () {
        return $.trim(this.html().replace(/<(?!img|embed).*?>/ig, '').replace(/&nbsp;/ig, ' ').replace(/\r\n|\n|\r/, '')) === '';
    },
    hidePopup: function (real) {
        if (real) {
            $('.editor-popup').html('');
        }
        $('.editor-popup').hide();
        $('.editor-btn-popup').removeClass('editor-btn-popup').removeClass('editor-btn-active')
            .parent('.editor-btn-active').removeClass('editor-btn-active');  // 适用 group button 的情况
        if ($.browser.msie) {
            $('.editor-toolbar-z-top').removeClass('editor-toolbar-z-top');
        }
    },
    focus: function () {
        this.cmd.focus();
    },
    getSelectionHtml: function () {
        return this.cmd.getSelectionHtml();
    },
    setValue: function () {
        if (this.isEmpty()) {
            this.obj.val('');
        } else {
            this.obj.val(this.html());
        }
    },
    setHtml: function (html) {
        if (typeof html === 'undefined') {
            html = this.html();
        }
        this.cmd.setHtml(html);
    },
    exec: function (cmd, val) {
        this.cmd.exec(cmd, val);
    },
    insertHtml: function (html) {
        this.cmd.insertHtml(html);
    },
    appendHtml: function (html) {
        this.cmd.appendHtml(html);
    },
    clear: function (html) {
        this.cmd.clear();
    },
    //打开公共Popup,渲染UI
    updatePopup: function (o, fun, options) {
        var self = this, isActive = o.hasClass('editor-btn-active');
        if (isActive) {
            return;
        }

        self.hidePopup(true);
        o.addClass('editor-btn-popup').addClass("editor-btn-active").parent('.editor-btn-group').addClass("editor-btn-active")
        popup = self.popup || self._createPopup();
        if ($.browser.msie) {
            self.toolbar.addClass('editor-toolbar-z-top')
        }

        fun && fun();

        var offset = $(o).position(),
            defaults = {
                left: offset.left,
                top: self.toolbar.outerHeight() - 1,
                width: 'auto',
                height: 'auto'
            };
        options = $.extend({}, defaults, options);

        popup.show().css({
            'left': options.left == 'center' ? defaults.left - popup.outerWidth() / 2 : options.left,
            'top': options.top,
            'width': options.width,
            'height': options.height
        })
    },
    stopPropagation: function (obj) {
        $(obj).click(function (e) {
            e.stopPropagation();
        });
    },
    fontPicker: function (type) {
        var self = this, popup = self.popup, html = self.createFontHtml(type);
        popup.html(html);
        var removeFontSize = function (selection) {
            var s1 = selection.replace(/[\r\n]+/ig, '');
            return s1.replace(/(<.*?style.*?)(font-size.*?)([;"'].*?>)/ig, function ($0, $1, $2, $3) {
                return $1 + $3;
            });
        };
        var execFont = function () {
            self.cmd.exec(type, $(this).attr('data-val'));
            if ($.browser.msie && type === 'fontsize') {
                var selection = self.cmd.getSelectionHtml();
                var s = removeFontSize(selection);
                self.cmd.insertHtml(s);
            }
            if (self.eventMgr) {
                self.eventMgr.emit('onchange');
            }
        };
        popup.undelegate('.editor-font-menu')
            .delegate('.editor-font-menu', 'click', execFont);
    },
    colorPicker: function () {
        var self = this, popup = self.popup,
            backcolor = $.browser.mozilla || $.browser.opera ? 'hilitecolor' : 'backcolor',
            textColorBox = $("<div/>").addClass("editor-color-box editor-text-color"),
            bgColorBox = $("<div/>").addClass("editor-color-box editor-bg-color"),
            colorBoxWrap = $("<div/>").addClass('editor-color-box-wrap');
        colorBoxWrap.append(textColorBox.html('<h3>' + editorLang('textColor') + '</h3>' + self.createColorHtml('forecolor')))
            .append(bgColorBox.html('<h3>' + editorLang('textBgColor') + '</h3>' + self.createColorHtml(backcolor)));
        popup.append(colorBoxWrap);

        colorBoxWrap.delegate('.editor-color-item', 'click', function () {
            var type = $(this).closest('.editor-color-box').hasClass('editor-text-color') ?
                'forecolor' : backcolor;
            ($.browser.mozilla && self.cmd.exec('styleWithCSS', true));
            self.cmd.exec(type, $(this).attr('data-val'));
            if (self.eventMgr) {
                self.eventMgr.emit('onchange');
            }
        });
    },
    justifyPicker: function () {
        var self = this, popup = self.popup;
        popup.html(self.createJustifyHtml());
    },
    createFontHtml: function (type) {
        var self = this, options = self.options , items = options[type],
            html = [], selectedItem = self.cmd.getVal(type);
        selectedItem = (typeof(selectedItem) == 'string') ? selectedItem.toLowerCase() : selectedItem;
        if (typeof selectedItem === 'string' && selectedItem.slice(0, 1) === "'" && selectedItem.slice(-1) === "'") {
            // 如果前后有单引号，就去除，因为各浏览器计算结果不一样
            selectedItem = selectedItem.slice(1, -1);
        }
        $.each(items, function (i, n) {
            var selectedClass = (selectedItem == n.toLowerCase()) ? ' editor-menu-item-selected' : '';
            if (type == 'fontname') {
                html.push('<span class="editor-menu-item editor-font-menu' + selectedClass + '" unselectable="on" data-val="' + n + '" style="font-family:' +
                    n + '"><i></i>' + n + '</span>');
            }
            if (type == 'fontsize') {
                html.push('<span class="editor-menu-item editor-font-menu' + selectedClass + '" unselectable="on" data-val="' + n + '"><i></i><font size="' + n + '">' + editorLang(n) + '</font></span>');
            }
        })
        return html.join('');
    },
    createColorHtml: function (type) {
        var self = this, options = self.options , items = options.colors,
            html = [], selectedItem = self.cmd.getVal(type), hex = self.cmd.toHex(selectedItem);
        selectedItem = (typeof(hex) == 'string') ?
            hex.toLowerCase() : '';

        $.each(items, function (i, n) {
            var selectedClass = (selectedItem == n.toLowerCase()) ? ' editor-color-item-selected' : '';
            html.push('<span class="editor-color-item' + selectedClass + '" unselectable="on" data-val="' + n + '" style="background-color:' + n + '"><i></i></span>');
        })
        return html.join('');
    },
    createJustifyHtml: function () {
        var self = this, options = self.options , items = options.justify, html = [];
        $.each(items, function (i, n) {
            html.push('<span class="editor-btn editor-ico editor-ico-' + n + '" unselectable="on" title="' + editorLang(n) + '"data-name="' + n + '"></span>');
        })
        return html.join('') + '<i style="clear:both"></i>';
    },
    menuPicker: function (items, opener) {
        var html = [],
            self = this,
            menu = $('<div/>');
        $.each(items, function (index, item) {
            html.push('<span class="editor-menu-item" data-name="' + item.name + '" unselectable="on">' + item.title + '</span>');
        });
        menu.html(html.join(''));

        self.popup.append(menu);

        menu.find('.editor-menu-item').each(function (index, item) {
            var name = $(item).attr('data-name');
            if (TFL.editor.buttonOnCreat[name]) {
                TFL.editor.buttonOnCreat[name].call(self, $(item));
            }
        });
        menu.delegate('.editor-menu-item', 'click', function (e) {
            self.focus();
            self.hidePopup();
            // if(!$(e.target).hasClass('editor-btn-popup')){self.hidePopup();}
            hideEditorContextMenu();
            var _this = $(this),
                name = _this.attr("data-name");
            // btn = self.toolbar.find('.editor-btn[data-name='+name+']');
            if (name && TFL.editor.modules[name]) {
                TFL.editor.modules[name].call(self, _this, opener);
            }
            e.stopPropagation();
        });
    },
    trimScripTag: function (str) {
        return str.replace(/(<(?:script|script\s[^>]*)>)([\s\S]*?)(<\/script>)/ig, '');
    },
    autoStretchEditor: function () {
        var self = this,
            inner = $(self.doc.body),
            outer = self.editor.find('.editor-area'),
            innerHeight = inner.outerHeight(),
            outerHeight = outer.outerHeight(),
            lineHeight = 20,
            ogHeight = parseInt(outer.attr('data-editor-ogheight')),
            value = 0;

        if (innerHeight + lineHeight > 500) {
            value = 500;
            inner.css('overflow-y', 'auto');
        } else if (innerHeight + lineHeight < ogHeight) {
            value = ogHeight;
            inner.css('overflow-y', 'hidden');
        } else {
            value = innerHeight + lineHeight;
            inner.css('overflow-y', 'hidden');
        }
        outer.height('100%');
        //outer.height(value);

    }
}, true, true);

TFL.editor.init = function (obj) {
    var _init = function () {
        var _this = $(this),
            attrClass = _this.attr('class').replace(/\r\n|\n|\r|\s/g, ''),
            id = _this.attr('id'),
            mode = _this.attr('mode') == '1' ? '1' : '0',
            options = {
                id: id,
                mode: mode
            },
            tOptions = /({.*})/.exec(attrClass);
        if (tOptions) {
            try {
                tOptions = eval('(' + tOptions[1] + ')');
            } catch (e) {
            }
            ;
            options = $.extend({}, tOptions, options);
        }
        TFL.editor(options);
    };
    if (obj) {
        _init.call($(obj))
    } else {
        $('.tfl-editor').each(function () {
            _init.call(this)
        })
    }
};


/*
 * 上传图片和导入word与后台通信时,由于使用了iframe来实现异步上传
 * 当后台地址跨域时，高级浏览器统一设置domain即可, 但IE下不行
 * 以下信息传递的方式为替代方案, 后台响应会直接调用以下方法
 */
(function () {
    navigator.editorPostMessage = function (msg) {
        parseEditorMessage(msg);
    };
    $(window).bind('message', function (e) {
        var msg = e.originalEvent.data;
        parseEditorMessage(msg);
    });
    var parseEditorMessage = function (msg) {
        var msgArr = msg.split('#tfl_spliter#'),
            msgType = msgArr[0], msgId = msgArr[1], msgValue = msgArr[2];
        if (msgType == 'image' || msgType == 'word') {
            var editor = TFL.editor.getInstance(msgId);
            //上传图片回调
            if (msgType == 'image') {
                editor.exec('insertImage', msgValue);
                editor.cmd.skipControlFocus();
            }
            //导入word回调
            if (msgType == 'word') {
                TFL.tips.hidePreload();
                msgValue = formatHTML(msgValue, false);
                editor.insertHtml(msgValue);
            }
            editor.hidePopup();
        }
    };
})();


//富文本命令类
TFL.widget("cmd", {
    _init: function () {
        var options = this.options;
        this.iframe = options.iframe;
        this.toolbar = options.toolbar;
        this.win = options.win;
        this.doc = options.doc;
    },
    exec: function (cmd, val) {
        try {
            this.focus();
            this.doc.execCommand(cmd, false, val);
        } catch (e) {
        }
    },
    getVal: function (name) {
        try {
            return this.doc.queryCommandValue(name);
        } catch (e) {
            return '';
        }
    },
    focus: function () {
        this.win.focus();
    },
    insertHtml: function (html) {
        var self = this, doc = self.doc, selection, r, elm;
        try {
	        self.focus();
	        if($.browser.msie) {
		        selection = doc.getSelection ? doc.getSelection() : doc.selection;
		        r = selection.createRange ? selection.createRange() : selection.getRangeAt ? selection.getRangeAt(0) : null;
		        if (r && r.pasteHTML) {
			        r.pasteHTML(html);
		        } else {
			        elm = doc.createElement('span');
			        r.surroundContents(elm);
			        elm.innerHTML = html;
		        }
	        } else {
		        doc.execCommand('insertHTML', false, html);
	        }
        } catch (e) {
	        alert("粘贴失败，把光标定位到文本编辑器里再试试");
        }
    },
    appendHtml: function (html) {
        var self = this, $body = $(self.doc.body);
        $body.append(html);
        self.focus();
    },
    setHtml: function (html) {
        var self = this, $body = $(self.doc.body);
        $body.html(html);
//        self.focus();
    },
    clear: function (html) {
        var self = this, $body = $(self.doc.body);
        $body.html('');
        self.focus();
    },
    state: function (key) {
        var bool = false;
        try {
            bool = this.doc.queryCommandState(key);
        } catch (e) {
        }
        return bool;
    },
    updateState: function () {
        var self = this,
            cmd = ['bold', 'italic', 'underline', 'insertorderedlist', 'insertunorderedlist'];
        $.each(cmd, function (i) {
            self.state(cmd[i]) ? self.select(cmd[i]) : self.unselect(cmd[i]);
        });
    },
    select: function (name) {
        this.toolbar.find('.editor-ico-' + name).addClass('editor-btn-active').parent('.editor-btn-group').addClass('editor-btn-active');
    },
    unselect: function (name) {
        this.toolbar.find('.editor-ico-' + name).removeClass('editor-btn-active').parent('.editor-btn-group').removeClass('editor-btn-active');
    },
    //insertImage后不要focus在图片上
    skipControlFocus: function () {
        if ($.browser.msie) {
            var selection = this.doc.selection;
            if (selection && selection.type == "Control") {
                var range = this.doc.body.createTextRange();
                range.moveToElementText(this.doc.selection.createRange().item(0));
                if (TFL.ie.mode(9)) {
                    range.moveEnd('character', 1);
                }
                range.collapse(false);
                range.select();
            }
        }
    },
    //当前光标所在是否被某节点包含
    getContaining: function (tagName) {
        var elem = this.getNode();
        while (elem && elem.tagName && elem.tagName.toLowerCase() != "body") {
            eTagName = elem.tagName.toLowerCase();
            if (typeof(tagName) == 'string') {
                if (eTagName == tagName.toLowerCase()) return elem;
            } else {
                if ($.inArray(eTagName, tagName) != -1) return elem;
            }
            elem = elem.parentNode;
        }
        return null;
    },
    //当前光标所在祖先节点
    getAncestor: function () {
        var elem = this.getNode();
        while (elem.parentNode.tagName && elem.parentNode.tagName.toLowerCase() != "body"
            && elem.parentNode.tagName.toLowerCase() != "html") {
            elem = elem.parentNode;
        }
        return elem;
    },
    //当前光标所在节点
    getNode: function () {
        var win = this.win;
        try {
            if (window.getSelection) {
                var range = win.getSelection().getRangeAt(0);
                var container = range.commonAncestorContainer;
                return container.parentNode;
            } else {
                var selection = win.document.selection;
                if (selection.type == "Control") {
                    var range = selection.createRange();
                    if (range.length == 1) {
                        var elem = range.item(0);
                    } else {
                        return null;
                    }
                } else {
                    var range = selection.createRange();
                    var elem = range.parentElement();
                }
                return elem;
            }
        } catch (e) {
            return null;
        }
    },
    //获取选中html字符串
    getSelectionHtml: function () {
        var range, html;
        if (window.getSelection) {
            range = this.win.getSelection().getRangeAt(0);
            var fragment = range.cloneContents();
            html = $("<div />").append($(fragment)).html();
        } else {
            range = this.doc.selection.createRange();
            html = range.htmlText;
        }
        return html;
    },
    setCaret: function (obj, l) {
        if (obj.setSelectionRange) {
            obj.setSelectionRange(l, l);
        } else if (obj.createTextRange) {
            m = obj.createTextRange();
            m.moveStart('character', l);
            m.collapse();
            m.select();
        }
    },
    toHex: function (color) {
        if (!/^(rgb|RGB)/.test(color)) {
            var toRgbColor = function (cl) {
                if (typeof cl != "number") {
                    return cl;
                }
                return "rgb(" + (cl & 0xFF) + ", " +
                    ((cl & 0xFF00) >> 8) + ", " +
                    ((cl & 0xFF0000) >> 16 ) + ")";
            }
            color = toRgbColor(color);
        }
        if ((typeof color == 'string') && color.indexOf('rgb') != -1) {
            var aColor = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            var strHex = "#";
            for (var i = 0; i < aColor.length; i++) {
                var onColor = aColor[i];
                if (isNaN(onColor)) {
                    onColor = 0;
                }
                var n = new Number(onColor).toString(16);
                strHex += (n.length == 1) ? '0' + n : n;
            }
            if (strHex.length !== 7) {
                strHex = color;
            }
            return strHex;
        } else {
            return color;
        }
    }
}, false, true);


TFL.editor.instances = {};
TFL.editor.getInstance = function (id) {
    return TFL.editor.instances[id];
};

TFL.editor.language = {};
var editorLang = TFL.editor.lang = function (mixed) {
    if (typeof(mixed) == 'string') {
        if (!TFL.editor.language[mixed]) {
            return '';
        }
        return TFL.editor.language[mixed];
    } else {
        $.extend(TFL.editor.language, mixed);
    }
};
TFL.editor.lang({
    'bold': '粗体',
    'italic': '斜体',
    'underline': '下划线',
    'font': '字体',
    'size': '文字大小',
    'color': '文字颜色&背景',
    'textColor': '文本颜色',
    'textBgColor': '背景颜色',
    'insertorderedlist': '有序列表',
    'insertunorderedlist': '无序列表',
    'justify': '对齐&缩进',
    'justifyleft': '左对齐',
    'justifycenter': '居中',
    'justifyright': '右对齐',
    'indent': '增加缩进',
    'outdent': '减少缩进',
    'link': '链接',
    'table': '表格',
    'emoticons': '表情',
    'image': '插入图片',
    'screenshot': '截屏',
    'word': '导入word',
    'fullscreen': '全屏编辑',
    'fullscreenrestore': '退出全屏编辑',
    'source': 'HTML代码',
    '1': '特小',
    '2': '小',
    '3': '中',
    '4': '大',
    '5': '较大',
    '6': '最大',
    'wyswyg': '返回可视化编辑',
    'captureScreen': '捕获屏幕',
    'installActive': '请点击安装截屏控件',
    'submit': '确定',
    'cancel': '取消',
    'linkUrl': '链接地址',
    'linkText': '链接文字',
    'linkPlaceholder': '默认使用链接名字',
    'cellCount': '单元格数',
    'tableRows': '行数',
    'tableColumns': '列数',
    'tableSize': '大小',
    'tableWidth': '宽度',
    'tableHeight': '高度',
    'tablePadding': '边距',
    'tableAlign': '对齐方式',
    'alignDefault': '默认',
    'alignLeft': '左对齐',
    'alignCenter': '居中',
    'alignRight': '右对齐',
    'tableBorder': '边框',
    'tablePx': '像素',
    'tableColor': '颜色',
    'tableBgColor': '背景颜色',
    'urlNotSupportTip': '暂不支持此链接',
    'tableProperty': '表格属性',
    'cellProperty': '单元格属性',
    'insertColLeft': '左侧插入列',
    'insertColRight': '右侧插入列',
    'insertRowAbove': '上方插入行',
    'insertRowBelow': '下方插入行',
    'mergeRow': '向下合并单元格',
    'mergeCol': '向右合并单元格',
    'delRow': '删除行',
    'delCol': '删除列',
    'delTable': '删除表格',
    'uploadImage': '上传图片',
    'uploadimage': '上传图片',
    'netImage': '网络图片',
    'netimage': '网络图片',
    'selectImage': '选择图片',
    'imagePath': '图片路径',
    'imagePathTip': '注：无访问权限的网络图片有可能导致无法显示.',
    'imageNoFileTip': '请先选择图片文件',
    'imageNoTypeTip': '暂不支持此格式的图片',
    'uploadImageFailTip': '上传图片出错, 请联系RTX: TAPD热线',
    'uploadNow': '立即上传',
    'insertNow': '立即插入',
    'selectDoc': '选择文档',
    'docTip': '注：word文档格式复杂, 可能无法保持完全一致.',
    'docNoFileTip': '请先选择word文件',
    'importNow': '立即导入',
    'importWordFailTip': '导入出错, 请联系RTX: TAPD热线',
    'docLoading': '请稍等, 正在导入word...'
});

TFL.editor.modules = {};
TFL.editor.buttonOnCreat = {};
TFL.editor.add = function (name, fun, oncreat) {
    var items = name.split(',');
    $.each(items, function (i) {
        TFL.editor.modules[items[i]] = fun;
        if (typeof oncreat !== 'undefined') {
            TFL.editor.buttonOnCreat[items[i]] = oncreat;
        }
    })
};

//html源代码过滤、格式化
(function () {
    function _toMap(val) {
        var map = {}, arr = val.split(',');
        $.each(arr, function (key, val) {
            map[val] = true;
        });
        return map;
    }

    function _getAttrList(tag) {
        var list = {},
            reg = /\s+(?:([\w\-:]+)|(?:([\w\-:]+)=([^\s"'<>]+))|(?:([\w\-:"]+)="([^"]*)")|(?:([\w\-:"]+)='([^']*)'))(?=(?:\s|\/|>)+)/g,
            match;
        while ((match = reg.exec(tag))) {
            var key = (match[1] || match[2] || match[4] || match[6]).toLowerCase(),
                val = (match[2] ? match[3] : (match[4] ? match[5] : match[7])) || '';
            list[key] = val;
        }
        return list;
    }

    function _filterStyle(val) {
        return val.replace(/([\w\-]+)\s*:(.*?);/ig, function ($0, $1, $2) {
            var styleAttr = $1,
                styleValue = $2;
            if (styleAttr === 'layout-grid'  // office 表格导致UI变形
                || styleAttr.indexOf('mso-') > -1
                || (styleAttr === 'text-indent' && parseInt(styleValue) < 0 )   // word使用负数造成字符丢失
                || (styleAttr === 'margin-left' && parseInt(styleValue) < 0 )   // word使用负数造成字符丢失
                ) {
                return "";
            }
            styleValue = styleValue.replace(/([\d]*\.[\d]+)pt/ig, function (w, num) {
                num = num - 0;
                num = (num > 0 && num < 0.75) ? '0.75' : num;
                return num + 'pt';
            });

            return styleAttr + ':' + styleValue + ';';
        });

    }

    function _filterSource(html) {
        if ($.browser.msie) {
            html = html.replace(/<td><\/td>/ig, '<td>&nbsp;</td>');
        }
        return html = html.replace(/(<!--\[if.*\]-->)/ig, ""); // @bug#48853143
    }

    var _INLINE_TAG_MAP = _toMap('a,abbr,acronym,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,img,input,ins,kbd,label,map,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'),
        _BLOCK_TAG_MAP = _toMap('address,applet,blockquote,body,center,dd,dir,div,dl,dt,fieldset,form,frameset,h1,h2,h3,h4,h5,h6,head,hr,html,iframe,ins,isindex,li,map,menu,meta,noframes,noscript,object,ol,p,pre,script,style,table,tbody,td,tfoot,th,thead,title,tr,ul'),
        _SINGLE_TAG_MAP = _toMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed'),
        _PRE_TAG_MAP = _toMap('pre,style,script'),
        _FILL_ATTR_MAP = _toMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');
    window.formatHTML = function (html, wellFormatted) {
        wellFormatted = (wellFormatted === undefined) ? true : wellFormatted;  // 换行缩进
        var indentChar = '\t',
            fontSizeList = 'x-small,small,medium,large,x-large,xx-large'.split(',');
        html = html.replace(/(<(?:script|script\s[^>]*)>)([\s\S]*?)(<\/script>)/ig, '');
        html = html.replace(/(<(?:style|style\s[^>]*)>)([\s\S]*?)(<\/style>)/ig, '');
        var re = /([ \t\n\r]*)<(\/)?([\w\-:]+)((?:\s+|(?:\s+[\w\-:]+)|(?:\s+[\w\-:]+=[^\s"'<>]+)|(?:\s+[\w\-:"]+="[^"]*")|(?:\s+[\w\-:"]+='[^']*'))*)(\/)?>([ \t\n\r]*)/g;
        var tagStack = [];
        html = html.replace(re, function ($0, $1, $2, $3, $4, $5, $6) {
            var full = $0,
                startNewline = $1 || '',
                startSlash = $2 || '',
                tagName = $3.toLowerCase(),
                attr = $4 || '',
                endSlash = $5 ? ' ' + $5 : '',
                endNewline = $6 || '';

            if (endSlash === '' && _SINGLE_TAG_MAP[tagName]) {
                endSlash = ' /';
            }
            if (_INLINE_TAG_MAP[tagName]) {
                if (startNewline) {
                    startNewline = ' ';
                }
                if (endNewline) {
                    endNewline = ' ';
                }
            }
            if (_PRE_TAG_MAP[tagName]) {
                if (startSlash) {
                    endNewline = '\n';
                } else {
                    startNewline = '\n';
                }
            }
            if (wellFormatted && tagName == 'br') {
                endNewline = '\n';
            }
            if (_BLOCK_TAG_MAP[tagName] && !_PRE_TAG_MAP[tagName]) {
                if (wellFormatted) {
                    if (startSlash && tagStack.length > 0 && tagStack[tagStack.length - 1] === tagName) {
                        tagStack.pop();
                    } else {
                        tagStack.push(tagName);
                    }
                    startNewline = '\n';
                    endNewline = '\n';
                    for (var i = 0, len = startSlash ? tagStack.length : tagStack.length - 1; i < len; i++) {
                        startNewline += indentChar;
                        if (!startSlash) {
                            endNewline += indentChar;
                        }
                    }
                    if (endSlash) {
                        tagStack.pop();
                    } else if (!startSlash) {
                        endNewline += indentChar;
                    }
                } else {
                    startNewline = endNewline = '';
                }
            }
            if (attr !== '') {

                var attrMap = _getAttrList(full);

                if (tagName === 'font') {

                    var fontStyleMap = {}, fontStyle = '';
                    $.each(attrMap, function (key, val) {
                        if (key === 'color') {
                            fontStyleMap.color = val;
                            delete attrMap[key];
                        }
                        if (key === 'size') {
                            fontStyleMap['font-size'] = fontSizeList[parseInt(val, 10) - 1] || '';
                            delete attrMap[key];
                        }
                        if (key === 'face') {
                            fontStyleMap['font-family'] = val;
                            delete attrMap[key];
                        }
                        if (key === 'style') {
                            fontStyle = val;
                        }
                    });
                    if (fontStyle && !/;$/.test(fontStyle)) {
                        fontStyle += ';';
                    }
                    $.each(fontStyleMap, function (key, val) {
                        if (val === '') {
                            return;
                        }
                        if (/\s/.test(val)) {
                            val = "'" + val + "'";
                        }
                        fontStyle += key + ':' + val + ';';
                    });
                    attrMap.style = fontStyle;
                }

                attr = '';
                $.each(attrMap, function (key, val) {
                    if (_FILL_ATTR_MAP[key]) {
                        attrMap[key] = key;
                    }
                    if (key === 'style') {
                        if (val === '') {
                            return;
                        } else {
                            if (val.substr(-1) !== ';') {
                                val += ';'; // 避免最后漏掉分号
                            }
                            if ($.browser.msie) {//ie下样式转换为小写
                                var lowerVal = '', lowerValArr = val.split(';');
                                $.each(lowerValArr, function (i, sval) {
                                    if (sval) {
                                        var svalArr = sval.split(':');
                                        if (svalArr[1]) {
                                            lowerVal += svalArr[0].toLowerCase() + ':' + svalArr[1] + ';';
                                        }
                                    }
                                })
                                val = lowerVal;
                            }
                            // 过滤不规范的样式代码
                            val = _filterStyle(val);
                        }
                    }
                    val = val.replace(/"/g, '&quot;');
                    attr += ' ' + key + '="' + val + '"';
                });
            }
            if (tagName === 'font') {
                tagName = 'span';
            }
            return startNewline + '<' + startSlash + tagName + attr + endSlash + '>' + endNewline;
        });

        html = html.replace(/\n\s*\n/g, '\n');
        /* 过滤不规范的代码 */
        html = _filterSource(html);

        return $.trim(html);
    }

})(window);

//右键菜单
(function ($) {
    var menu, shadow, cursorX = 0, cursorY = 0;
    var defaults = {
        eventPosX: 'clientX',
        eventPosY: 'clientY',
        onContextMenu: null,
        onShowMenu: null
    };

    $.fn.contextMenu = function (options) {
        if (!menu) {
            menu = $('<div id="editorContextMenu" class="editor-context-menu"></div>')
                .appendTo('body')
                .hide()
                .bind('click', function (e) {
                    e.stopPropagation();
                });
        }
        if (!shadow) {
            shadow = $('<div id="editorContextMenuShadow" class="editor-context-shadow"></div>')
                .appendTo('body')
                .hide();
        }
        var collapseOptions = {
            bindings: options.bindings || {},
            html: options.html || '',
            onContextMenu: options.onContextMenu || defaults.onContextMenu,
            onShowMenu: options.onShowMenu || defaults.onShowMenu,
            offsetObj: options.offsetObj || null,
            eventPosX: options.eventPosX || defaults.eventPosX,
            eventPosY: options.eventPosY || defaults.eventPosY
        };

        if (TFL.ie.mode(9)) {//ie9右键获取不到鼠标位置
            $(this).unbind('mouseover').bind('mouseover', function (e) {
                cursorX = e[collapseOptions.eventPosX];
                cursorY = e[collapseOptions.eventPosY];
            })
        }

        $(this).unbind('contextmenu').bind('contextmenu', function (e) {
            var bShowContext = (collapseOptions.onContextMenu) ? collapseOptions.onContextMenu(e) : true;
            if (bShowContext) display(this, e, collapseOptions);
            return false;
        });
        return this;
    };

    function display(trigger, e, options) {

        menu.html(options.html);
        if (options.onShowMenu) menu = options.onShowMenu(e, menu);
        var target = e.target;
        if (target.tagName != 'TD') {
            target = $(target).closest('td');
        }
        $.each(options.bindings, function (id, func) {
            $('#' + id, menu).bind('click', function (e) {
                hide();
                func($(trigger), $(target));
            });
        });

        var offsetX = 0, offsetY = 0;
        if (options.offsetObj) {
            var offset = options.offsetObj.offset();
            offsetX = offset.left;
            offsetY = offset.top;
        }
        var x = e[options.eventPosX] + offsetX, y = e[options.eventPosY] + offsetY;
        if (!e[options.eventPosX]) {
            x = cursorX + offsetX;
            y = cursorY + offsetY;
        }
        menu.css({'left': x, 'top': y}).show();
        shadow.css({
            width: menu.width(),
            height: menu.height(),
            left: x + 2,
            top: y + 2
        }).show();

        $(document).one('click', hide);
    }

    window.hideEditorContextMenu = hide = function () {
        if (menu && shadow) {
            menu.hide();
            shadow.hide();
        }
    }

})(jQuery);


/*具体功能实现***************************************************************************/


//文字格式
// TFL.editor.add('bold', function(ui){
//  var self = this;
//  // console.log('before');
//  // console.log('sate:', self.cmd.state('bold'))
//  // console.log('getSelectionHtml:', self.cmd.getSelectionHtml());
//  // self.cmd.exec(ui.attr('data-name'));
//  // self.cmd.updateState();
//  // console.log('after');
//  // console.log('getSelectionHtml:', self.cmd.getSelectionHtml());
//  // console.log('sate:', self.cmd.state('bold'));
//  function toNormal(html) {
//      var after = html.replace('font-weight:bold', '').replace(/(strong>)|(b>)/ig, 'span>');
//      return '<span style="font-weight:normal">' + after + '</span>';
//  }
//  function toBold(html) {
//      var after = html.replace('font-weight:normal', '');
//      return '<strong>' + after + '</strong>';
//  }
//  var selection = self.cmd.getSelectionHtml();
//  console.log('selection==', selection);
//  if (self.cmd.state('bold')) {
//      var after = toNormal(selection);
//      self.cmd.insertHtml(after);
//      console.log('after click',self.cmd.state('bold'), after);
//  } else {
//      var after = toBold(selection);
//      self.cmd.insertHtml(after);
//      console.log('after click',self.cmd.state('bold'), after);
//  }
//  self.cmd.updateState();
// });

TFL.editor.add('bold,italic,underline,insertorderedlist,insertunorderedlist,' +
    'justifyleft,justifycenter,justifyright,indent,outdent', function (ui) {
    var self = this;
    self.cmd.exec(ui.attr('data-name'));
    self.cmd.updateState();
    if (self.eventMgr) {
        self.eventMgr.emit('onchange');
    }
});

//字体
TFL.editor.add('font', function (ui) {
    var self = this;
    self.updatePopup(ui, function () {
        self.fontPicker('fontname');
    });
});

//文字大小
TFL.editor.add('size', function (ui) {
    var self = this;
    self.updatePopup(ui, function () {
        self.fontPicker('fontsize');
    });
});

//选择颜色
TFL.editor.add('color', function (ui) {
    var self = this;
    self.updatePopup(ui, function () {
        self.colorPicker();
    });
});

//对齐
TFL.editor.add('justify', function (ui) {
    var self = this;
    self.updatePopup(ui, function () {
        self.justifyPicker();
    });
});

//全屏
TFL.editor.add('fullscreen', function (ui) {
    var self = this, editor = self.editor, htmlNode = $('html');
    if (editor.hasClass('editor-maximize')) {
        editor.removeClass('editor-maximize');
        $('body').removeClass('body-editor-maximize');
        editor.find('.editor-area').height(self.editorHeight);
        ui.removeClass('editor-ico-fullscreen-restore editor-btn-active')
            .addClass('editor-ico-fullscreen')
            .attr('title', editorLang('fullscreen'))
            .find('.editor-btn-text').text(editorLang('fullscreen'));
        htmlNode.removeClass('html-overflow-hidden');

    } else {
        editor.addClass('editor-maximize');
        $('body').addClass('body-editor-maximize');
        editor.find('.editor-area').height(editor.height() - self.toolbar.outerHeight() - 1);
        ui.removeClass('editor-ico-fullscreen')
            .addClass('editor-ico-fullscreen-restore editor-btn-active')
            .attr('title', editorLang('fullscreenrestore'))
            .find('.editor-btn-text').text(editorLang('fullscreenrestore'));
        htmlNode.addClass('html-overflow-hidden');
    }
});

//切换html
TFL.editor.add('source', function (ui) {
    var self = this, backToRich = $('<a href="javascript:;" class="back-to-rich"><<' + editorLang('wyswyg') + '</a>'),
        toolbarElement = self.toolbar.find('.editor-btn,.editor-separator');
    if (self.obj.is(':visible')) {
        // 切换到所见即所得模式
        var textAreaVal = self.obj.val();
        self.obj.hide();
        self.iframe.style.display = 'block';
        self.doc.body.innerHTML = formatHTML(textAreaVal);
        //fix ie下图片自动变为绝对路径
        if ($.browser.msie) {
            $(self.doc.body).find('img').each(function () {
                var _this = $(this), _src = _this.attr('src');
                if (_src && _src.indexOf('/tfl/') != -1 && _src.indexOf('.com/') != -1) {
                    _this.attr('src', _src.split('.com')[1]);
                }
            })
        }
        self.focus();
        toolbarElement.show();
        self.toolbar.find('.back-to-rich').remove();
        $(self.iframe).trigger('initContextMenu');
        if ($(self.win).scrollTop() == 0) {
            self.toolbar.find('.editor-toolbar-shadow').hide();
        }
    } else {
        // 切换到源码模式
        self.iframe.style.display = 'none';
        var editorAreaWidth = self.editor.width() - 2,
            editorAreaHeight = self.editor.height() - self.toolbar.outerHeight() - 1;
        self.obj.css({"width": editorAreaWidth, "height": editorAreaHeight}).show().focus();
        self.obj.val(formatHTML(self.doc.body.innerHTML));//格式化html
        toolbarElement.hide();
        backToRich.appendTo(self.toolbar);
        var fun = arguments.callee;
        backToRich.click(function (e) {
            e.preventDefault();
            fun.call(self)
        });
    }
});


//链接
TFL.editor.add('link', function (ui) {
    var self = this, link = self.cmd.getContaining('a'),
        selection = self.cmd.getSelectionHtml();
    self.updatePopup(ui, function () {
        var linkPopup = $('<div/>').addClass('editor-popup-link'),
            html = '<div class="form-item">' +
                '<label class="control-label">' + editorLang('linkUrl') + '：</label>' +
                '<div class="controls">' +
                '<input type="text" value="http://" class="ed-link-href"> ' +
                '</div>' +
                '</div>' +
                '<div class="form-item error-tips" id="not-support-url"><label class="control-label"></label><div class="controls tips">' + editorLang('urlNotSupportTip') + '</div></div>' +
                '<div class="form-item">' +
                '<label class="control-label">' + editorLang('linkText') + '：</label>' +
                '<div class="controls">' +
                '<input type="text" class="ed-link-text" placeholder="' + editorLang('linkPlaceholder') + '"> ' +
                '</div>' +
                '</div>' +
                '<div class="form-action">' +
                '<a class="btn ed-link-save">' +
                '<span>' + editorLang('submit') + '</span>' +
                '</a> ' +
                '<a class="btn ed-link-cancel">' +
                '<span>' + editorLang('cancel') + '</span>' +
                '</a>' +
                ' </div>';
        linkPopup.html(html);
        self.popup.append(linkPopup);
        var linkHref = linkPopup.find('.ed-link-href'),
            linkText = linkPopup.find('.ed-link-text');

        self.stopPropagation(linkPopup);

        hasSelectedTxt = (selection && typeof(selection) == 'string') ?
            $.trim(selection.replace(/<(?!img|embed).*?>/ig, '').replace(/&nbsp;/ig, ' ').replace(/\r\n|\n|\r/, '')) : '';
        if (hasSelectedTxt) {//选中文字场景
            linkText.closest('.form-item').hide();
        }

        if (link) {//鼠标在节点范围内
            linkHref.val(link.href);
            linkText.val($(link).text());
        }

        linkPopup.find('.ed-link-save').click(function () {
            var linkHrefVal = linkHref.val(),
                linkTextVal = linkText.val(),
                htmlStr = '';
            linkTextVal = linkTextVal == "" ? linkHrefVal : linkTextVal;
            htmlStr = '<a href="' + linkHrefVal + '">' + linkTextVal + ' </a>';
            ret = linkHrefVal.match(/[http|https]:\/\//);
            if (ret == null) {
                linkPopup.find('#not-support-url').show();
            } else {
                if (hasSelectedTxt) {
                    self.cmd.exec('createLink', linkHrefVal);
                } else if (link) {
                    $(link).replaceWith(htmlStr);
                } else {
                    self.insertHtml(htmlStr);
                }
                self.hidePopup();
            }
        });
        linkPopup.find('.ed-link-cancel').click(function () {
            self.hidePopup()
        })
    })
});

//表格
TFL.editor.add('table', function (ui, initMenu, modTd) {
    var self = this,
        table = self.cmd.getContaining('table'),//节点在table上
        $table = $(table);

    function ttProperty() {
        TFL.editor.modules['table'].call(self, ui);
    };

    function tdProperty(table, target) {
        TFL.editor.modules['table'].call(self, ui, false, target);
    };

    function deleteTable(table) {
        table.remove();
        self.focus();
    };

    function ifEmptyTable(table) {
        if (table.find('td').length == 0 && table.find('th').length == 0) {
            table.remove();
        }
    };

    function deleteColumn(table, target) {
        var index = target.index();
        table.find('tr').each(function () {
            var _this = $(this), onCol = _this.find('td').eq(index),
                onColSpan = parseInt(onCol.attr('colspan'));
            if (onColSpan > 1) {
                onCol.attr('colspan', onColSpan - 1);
            } else {
                onCol.remove();
            }
            if (_this.find('td').length == 0 && _this.find('th').length == 0) {
                _this.remove();
            }
        })
        ifEmptyTable(table);
        self.focus();
    };

    function deleteRow(table, target) {
        var index = target.parent().index();
        table.find('tr').eq(index).remove();
        ifEmptyTable(table);
        self.focus();
    };

    function colInsert(mode, table, target) {
        var index = target.index(), cellInner = $.browser.msie ? '' : '<div><br/></div>',
            style = table.find('td').attr('style');
        table.find('tr').each(function () {
            var _this = $(this), td = $('<td style="' + style + '">' + cellInner + '</td>'),
                onCol = _this.find('td').eq(index);
            clearTdsStyle(td);
            if (!onCol.length) {
                onCol = _this.find('td:last');
            }
            if (mode == 0) {
                td.insertBefore(onCol)
            } else {
                td.insertAfter(onCol)
            }
        })
        self.focus();
    };

    function getCellCount(table) {
        var count = 0;
        table.find('tr:eq(0)').find('td').each(function () {
            var colspan = $(this).attr('colspan');
            if (colspan) {
                count += parseInt(colspan);
            } else {
                count += 1;
            }
        });
        return count;
    };

    function isSetSpan(tr, para) {
        var isSet = false;
        tr.find('td').each(function () {
            var paraVal = $(this).attr(para);
            if (paraVal && parseInt(paraVal) > 1) {
                isSet = true;
                return false;
            }
        });
        return isSet;
    };

    function rowInsert(mode, table, target) {
        var index = target.parent().index(), tr = '<tr>',
            cellInner = $.browser.msie ? '' : '<br/>',
            style = table.find('td').attr('style');
        for (var i = 0, len = getCellCount(table); i < len; i++) {
            tr += '<td style="' + style + '">' + cellInner + '</td>';
        }
        tr += '</tr>';
        tr = $(tr);
        clearTdsStyle(tr.find('td'));

        var curRow = table.find('tr').eq(index),
            curCellRowSpan = parseInt(target.attr('rowspan'));

        if (mode == 0) {
            //上一行是否有rowspan
            if (isSetSpan(curRow.prev(), 'rowspan')) {
                return
            }
            tr.insertBefore(curRow);
        } else {
            //当前否有rowspan
            if (isSetSpan(curRow, 'rowspan')) {
                if (curCellRowSpan > 1) {
                    tr.insertAfter(table.find('tr').eq(index + curCellRowSpan - 1));
                } else {
                    return
                }
            } else {
                tr.insertAfter(curRow)
            }
        }
        table.html(table.html()); //解决ie8插入行不显示
        self.focus();
    };

    function rowMerge(table, target) {
        var index = target.index(),
            parentIndex = target.parent('tr').index(),
            rowspan = target.attr('rowspan') ? parseInt(target.attr('rowspan')) : 1,
            nextRow = table.find('tr').eq(parentIndex + rowspan),
            nextRowCell = nextRow.find('td').eq(index);
        if (!nextRowCell.length) {
            nextRowCell = nextRow.find('td:last');
        }
        if (!nextRow.length) {//最后一行
            return
        }
        if (target.attr('colspan') != nextRowCell.attr('colspan')) {//上下colspan不一致
            return;
        }
        if (nextRowCell.attr('rowspan')) {
            target.attr('rowspan', parseInt(nextRowCell.attr('rowspan')) + rowspan);
        } else {
            target.attr('rowspan', rowspan + 1);
        }
        nextRowCell.remove();
        self.focus();
    };

    function colMerge(table, target) {
        var index = target.index(),
            nextCell = target.next('td'),
            colspan = target.attr('colspan') ? parseInt(target.attr('colspan')) : 1;
        if (!nextCell.length) {//最后一列
            return;
        }
        if (target.attr('rowspan') != nextCell.attr('rowspan')) {//左右rowspan不一致
            return;
        }
        if (nextCell.attr('colspan')) {
            target.attr('colspan', parseInt(nextCell.attr('colspan')) + colspan);
        } else {
            target.attr('colspan', colspan + 1);
        }
        nextCell.remove();
        self.focus();
    };

    function clearTdsStyle(obj) {
        obj.css({'background-color': '', 'text-align': ''});
    };

    function initContextMenu() {
        $('table', self.doc).contextMenu({
            bindings: {
                'tt-property': function () {
                    ttProperty();
                },
                'td-property': function (table, target) {
                    tdProperty(table, target);
                },
                'colinsert-left': function (table, target) {
                    colInsert(0, table, target);
                },
                'colinsert-right': function (table, target) {
                    colInsert(1, table, target);
                },
                'rowinsert-above': function (table, target) {
                    rowInsert(0, table, target);
                },
                'rowinsert-below': function (table, target) {
                    rowInsert(1, table, target);
                },
                'row-merge': function (table, target) {
                    rowMerge(table, target);
                },
                'col-merge': function (table, target) {
                    colMerge(table, target);
                },
                'del-row': function (table, target) {
                    deleteRow(table, target);
                },
                'del-column': function (table, target) {
                    deleteColumn(table, target);
                },
                'del-table': function (table, target) {
                    deleteTable(table, target);
                }
            },
            html: '<ul>' +
                '<li id="tt-property" unselectable="on">' + editorLang('tableProperty') + '</li>' +
                '<li id="td-property" unselectable="on">' + editorLang('cellProperty') + '</li>' +
                '<li id="colinsert-left" unselectable="on">' + editorLang('insertColLeft') + '</li>' +
                '<li id="colinsert-right" unselectable="on">' + editorLang('insertColRight') + '</li>' +
                '<li id="rowinsert-above" unselectable="on">' + editorLang('insertRowAbove') + '</li>' +
                '<li id="rowinsert-below" unselectable="on">' + editorLang('insertRowBelow') + '</li>' +
                '<li id="row-merge" unselectable="on">' + editorLang('mergeRow') + '</li>' +
                '<li id="col-merge" unselectable="on">' + editorLang('mergeCol') + '</li>' +
                '<li id="del-row" unselectable="on">' + editorLang('delRow') + '</li>' +
                '<li id="del-column" unselectable="on">' + editorLang('delCol') + '</li>' +
                '<li id="del-table" unselectable="on">' + editorLang('delTable') + '</li>' +
                '</ul>',
            offsetObj: $(self.iframe)
        })
    };

    $(self.iframe).unbind('initContextMenu').bind('initContextMenu', initContextMenu);

    if (initMenu) {
        //只调用右键菜单初始化,不触发popup弹出
        initContextMenu();
        return;
    }
    ;

    self.updatePopup(ui, function () {
        var popup = self.popup, html = '<div class="editor-popup-table">';
        if (modTd) {
            html += '<div class="form-item">' +
                '<label class="control-label">' + editorLang('tableAlign') + '：</label>' +
                '<div class="controls">' +
                '<select class="ed-td-align"><option value="" selected="selected">' + editorLang('alignDefault') + '</option><option value="left">' + editorLang('alignLeft') + '</option><option value="center">' + editorLang('alignCenter') + '</option><option value="right">' + editorLang('alignRight') + '</option></select>' +
                '</div>' +
                '</div>' +
                '<div class="form-item">' +
                '<label class="control-label">' + editorLang('tableBgColor') + '：</label>' +
                '<div class="controls">' +
                '<span class="table-color-block ed-td-bg-color"></span>' +
                '</div>' +
                '</div>';
        } else {
            html += '<div class="form-item">' +
                '<label class="control-label">' + editorLang('cellCount') + '：</label>' +
                '<div class="controls">' +
                editorLang('tableRows') + ' <input type="text" value="3" class="span1 ed-table-rows"> &nbsp;&nbsp;' + editorLang('tableColumns') + ' <input type="text" value="2" class="span1 ed-table-columns">' +
                '</div>' +
                '</div>' +
                '<div class="form-item">' +
                '<label class="control-label">' + editorLang('tableSize') + '：</label>' +
                '<div class="controls">' +
                editorLang('tableWidth') + ' <input type="text" value="100" class="span1 ed-table-width">&nbsp;' +
                '<select class="ed-table-width-type"><option selected="selected" value="%">%</option><option value="px">px</option></select>' +
                '&nbsp;&nbsp;' + editorLang('tableHeight') + ' <input type="text" class="span1 ed-table-height">&nbsp;' +
                '<select class="ed-table-height-type"><option selected="selected" value="%">%</option><option value="px">px</option></select>' +
                '</div>' +
                '</div>' +
                '<div class="form-item">' +
                '<label class="control-label">' + editorLang('tablePadding') + '：</label>' +
                '<div class="controls">' +
                '<input type="text" class="span1 ed-table-cellpadding" value="2">' +
                '</div>' +
                '</div>' +
                '<div class="form-item">' +
                '<label class="control-label">' + editorLang('tableAlign') + '：</label>' +
                '<div class="controls">' +
                '<select class="ed-table-align"><option value="" selected="selected">' + editorLang('alignDefault') + '</option><option value="left">' + editorLang('alignLeft') + '</option><option value="center">' + editorLang('alignCenter') + '</option><option value="right">' + editorLang('alignRight') + '</option></select>' +
                '</div>' +
                '</div>' +
                '<div class="form-item">' +
                '<label class="control-label">' + editorLang('tableBorder') + '：</label>' +
                '<div class="controls">' +
                editorLang('tablePx') + ' <input type="text" class="span1 ed-table-border" value="1">&nbsp;&nbsp;' +
                editorLang('tableColor') + ' <span class="table-color-block ed-table-border-color" style="background-color:#999;">#999999</span>' +
                '</div>' +
                '</div>';
        }
        html += '<div class="form-action">' +
            '<a class="btn ed-table-save">' +
            '<span>' + editorLang('submit') + '</span>' +
            '</a> ' +
            '<a class="btn ed-table-cancel">' +
            '<span>' + editorLang('cancel') + '</span>' +
            '</a>' +
            ' </div>' +
            '</div>';

        popup.html(html);
        var tform = popup.find('.editor-popup-table'),
            save = $(".ed-table-save", tform),
            cancel = $(".ed-table-cancel", tform);

        if (modTd) {//单元格模式
            tform.css('width', 240);
            var tdAlign = $(".ed-td-align", tform),
                tdBgColor = $(".ed-td-bg-color", tform),
                tdAlignVal = modTd.attr('align') || modTd.css('textAlign'),
                tdBgColorVal = modTd.css('backgroundColor');
            //单元格回显
            tdBgColorVal = (tdBgColorVal.indexOf('rgb') != -1) ? self.cmd.toHex(tdBgColorVal) : tdBgColorVal;
            tdAlign.val(tdAlignVal);
            if (tdBgColorVal && tdBgColorVal != 'transparent') {
                tdBgColor.text(tdBgColorVal);
                tdBgColor.css('background-color', tdBgColorVal);
            }

        } else {//表格模式
            var rows = $(".ed-table-rows", tform),
                columns = $(".ed-table-columns", tform),
                width = $(".ed-table-width", tform),
                height = $(".ed-table-height", tform),
                widthType = $(".ed-table-width-type", tform),
                heightType = $(".ed-table-height-type", tform),
                border = $(".ed-table-border", tform),
                cellPadding = $(".ed-table-cellpadding", tform),
                align = $(".ed-table-align", tform),
                borderColor = $(".ed-table-border-color", tform);
            if (table) {//表格回显
                var tstyle = $table.attr('style') ? $table.attr('style').split(';') : [];
                rows.val($table.find('tr').length);
                columns.val($table.find('tr:eq(0)').find('td').length);
                rows.attr('disabled', true);
                columns.attr('disabled', true);
                $.each(tstyle, function (i, n) {
                    if (n) {
                        n = n.split(':');
                        var tp = (n[1] && n[1].indexOf('px') != -1) ? 'px' : '%';
                        if ($.trim(n[0]).toLowerCase() == 'width') {
                            width.val(n[1].replace(tp, ''));
                            widthType.val(tp);
                            if ($.browser.msie && tp == '%' && $.trim(width.val()) == '99.9') {
                                width.val('100');
                            }
                        }
                        if ($.trim(n[0]).toLowerCase() == 'height') {
                            height.val(n[1].replace(tp, ''));
                            heightType.val(tp);
                        }
                    }
                });

                var td0 = $table.find('td').eq(0),
                    bodWidth = td0.css('borderWidth'),
                    bodColor = td0.css('borderColor'),
                    tdPadding = td0.css('padding');
                bodWidth = bodWidth.replace(/px|pt|em/, '');
                tdPadding = tdPadding.replace(/px|pt|em/, '');
                bodColor = (bodColor.indexOf('rgb') != -1) ? self.cmd.toHex(bodColor) : bodColor;
                border.val(bodWidth);
                cellPadding.val(tdPadding);
                align.val($table.attr('align'));
                if (bodColor) {
                    borderColor.text(bodColor);
                    borderColor.css('background-color', bodColor);
                }
            }
        }

        tform.click(function (e) {
            e.stopPropagation();
            $(this).find('.color-popup').remove()
        });
        cancel.click(function () {
            self.hidePopup();
        });

        var colorControl = modTd ? tdBgColor : borderColor;

        colorControl.click(function (e) {
            var _this = $(this),
                colorHtml = self.createColorHtml(),
                colorPop = $("<div class='color-popup'></div>");
            colorPop.append(colorHtml);
            tform.append(colorPop);
            var colorPopTop = _this.position().top - colorPop.outerHeight();
            colorPopTop = (colorPopTop < 0) ? _this.position().top + colorControl.outerHeight() : colorPopTop;
            colorPop.css({
                'left': _this.position().left,
                'top': colorPopTop
            });
            colorPop.find('.editor-color-item[data-val =' + _this.text() + ']').addClass('editor-color-item-selected');
            colorPop.delegate('.editor-color-item', 'click', function () {
                var color = $(this).attr('data-val');
                _this.text(color).css('background', color);
            })
            e.stopPropagation();
        });

        save.click(function () {
            if (modTd) {//修改单元格
                var tdAlignVal = tdAlign.val(),
                    tdBgColorVal = tdBgColor.text();
                modTd.css({
                    'text-align': '',
                    'background-color': tdBgColorVal
                }).attr('align', tdAlignVal);
                self.hidePopup();

            } else {
                var rowsVal = parseInt(rows.val()),
                    columnsVal = parseInt(columns.val()),
                    widthVal = width.val(),
                    heightVal = height.val(),
                    widthTypeVal = widthType.val(),
                    heightTypeVal = heightType.val(),
                    borderVal = border.val(),
                    cellPaddingVal = cellPadding.val(),
                    alignVal = align.val(),
                    borderColorVal = borderColor.text(),
                    tStyle = '',
                    tdStyle = '',
                    htmlStr = '',
                    cellInner = $.browser.msie ? '' : '<div><br/></div>';

                if ($.browser.msie && widthVal == '100' && widthTypeVal == '%') {
                    widthVal = '99.9';
                }

                if (table) {//修改表格
                    var tds = $table.find('td');
                    if (widthVal !== '') {
                        $table.css('width', widthVal + widthTypeVal);
                    } else {
                        $table.css('width', '');
                    }
                    if (heightVal !== '') {
                        $table.css('height', heightVal + heightTypeVal);
                    } else {
                        $table.css('height', '');
                    }
                    if (cellPaddingVal !== '') {
                        tds.css('padding', cellPaddingVal);
                    } else {
                        tds.css('padding', '');
                    }
                    if (alignVal !== '') {
                        $table.attr('align', alignVal);
                    } else {
                        $table.removeAttr('align');
                    }
                    if (borderVal !== '') {
                        if (isNaN(borderVal)) {
                            borderVal = '1';
                        }
                        tds.css('border', borderVal + 'px solid ' + borderColorVal);
                    } else {
                        tds.css('border', '');
                    }
                    self.hidePopup();
                    return;
                }

                if (widthVal !== '') {
                    tStyle += 'width:' + widthVal + widthTypeVal + ';';
                }
                if (heightVal !== '') {
                    tStyle += 'height:' + heightVal + heightTypeVal + ';';
                }

                htmlStr += '<table class="editor-table"' +
                    ' style = "' + tStyle + '"' +
                    (alignVal != "" ? ' align="' + alignVal + '"' : "") + ">";
                htmlStr += "<tbody>";

                tdStyle += ' style="';
                tdStyle += (borderVal != "" ? 'border:' + borderVal + 'px solid ' + borderColorVal + ';' : "");
                tdStyle += (cellPaddingVal != "" ? 'padding:' + cellPaddingVal + 'px;' : "");
                tdStyle += '"';

                for (var i = 0; i < rowsVal; i++) {
                    htmlStr += "<tr>"
                    for (var j = 0; j < columnsVal; j++) {
                        htmlStr += '<td ' + tdStyle + '>' + cellInner + '</td>';
                    }
                    htmlStr += "</tr>"
                }
                htmlStr += "</tbody></table><br/>";
                self.insertHtml(htmlStr);
                initContextMenu();
                self.hidePopup();
            }

        });
    }, {left: 'center'});
});


//表情
TFL.editor.add('emoticons', function (ui) {
    var self = this;
    self.updatePopup(ui, function () {
        var popup = self.popup, icoLength = 105,
            icoWrap = $('<div/>').addClass('editor-popup-emoticons'),
            icoHtml = '';
        for (var i = 0; i < icoLength; i++) {
            icoHtml += '<span class="editor-emoticon-item" unselectable="on" data-index="' + i + '" style="background-position:-' + (i * 24) + 'px 0px"></span>'
        }
        icoWrap.html(icoHtml)
        popup.append(icoWrap);
        icoWrap.delegate('.editor-emoticon-item', 'click', function () {
            if (self.options.showRelativePath) {
                self.exec('insertImage', '/tfl/img/emoticons/' + $(this).attr('data-index') + '.gif');
            } else {
                self.exec('insertImage', TFL.path + 'img/emoticons/' + $(this).attr('data-index') + '.gif');
            }
            self.cmd.skipControlFocus();
        })
        icoWrap.delegate('.editor-emoticon-item', 'mouseenter', function () {
            var previewGif = icoWrap.find('.previewGif');
            if (!previewGif.length) {
                previewGif = $('<div/>').addClass('previewGif').appendTo(icoWrap)
            }
            var remainder = parseInt($(this).attr('data-index')) % 15,
                css = {};
            if (remainder > 7) {
                css = {
                    'left': '5px',
                    'right': ''
                }
            } else {
                css = {
                    'right': '5px',
                    'left': ''
                }
            }
            previewGif.css(css).show().html('<img src="' + TFL.path + 'img/emoticons/' + $(this).attr('data-index') + '.gif"/>')
        })
        icoWrap.mouseleave(function () {
            $(this).find('.previewGif').hide()
        })
    }, {left: 'center'});
});


//上传图片
TFL.editor.add('image', function (ui) {
    var self = this;
    self.updatePopup(ui, function () {
        var popup = self.popup,
            imageWrap = $('<div/>').addClass('editor-popup-image'),
            imageHtml = '<ul class="tab">'
                + ' <li class="current tab-item" id="tab-upload-image" pannel="upload-image-pannel"><a>' + editorLang('uploadImage') + '</a></li>'
                + ' <li class="tab-item" id="tab-net-image" pannel="net-image-pannel"><a>' + editorLang('netImage') + '</a></li>'
                + '</ul>'
                + '<div class="pannel-item" id="upload-image-pannel">'
                + '<form method="post" enctype="multipart/form-data">'
                + '<div class="form-item">'
                + '<label class="control-label">' + editorLang('selectImage') + '：</label>'
                + '<div class="controls">'
                + '<input type="file" onkeydown="return false;" name="UploadFile" >'
                + '</div>'
                + '</div>'
                + '<div class="form-item error-tips" id="no-file-choosed"><label class="control-label"></label><div class="controls tips">' + editorLang('imageNoFileTip') + '</div></div>'
                + '<div class="form-item error-tips" id="not-image-file"><label class="control-label"></label><div class="controls tips">' + editorLang('imageNoTypeTip') + '</div></div>'
                + '<input type="hidden" value="sid" name="sid" />'
                + '<input type="hidden" value="add" name="fun" />'
                + '<input type="hidden" value="download" name="mode" />'
                + '<input type="hidden" value="0" name="widthlimit" />'
                + '<input type="hidden" value="0" name="heightlimit" />'
                + '<input type="hidden" value="0" name="sizelimit" />'
                + '<div class="form-action">'
                + '<div class="btn"><input type="submit" value="' + editorLang('uploadNow') + '" /></div> '
                + '<a class="btn image-cancel"><span>' + editorLang('cancel') + '</span></a>'
                + '</div>'
                + '</form>'
                + '</div>'
                + '<div class="pannel-item" id="net-image-pannel" style="display:none">'
                + '<div class="form-item">'
                + '<label class="control-label">' + editorLang('imagePath') + '：</label>'
                + '<div class="controls"><input type="text" value="http://" class="net-image-path"></div>'
                + '</div>'
                + '<div class="form-item"><div class="controls">( ' + editorLang('imagePathTip') + ' )</div></div>'
                + '<div class="form-action">'
                + '<a class="btn net-submit"><span>' + editorLang('insertNow') + '</span></a> '
                + '<a class="btn image-cancel"><span>' + editorLang('cancel') + '</span></a>'
                + '</div>'
                + '</div>';

        imageWrap.html(imageHtml);
        popup.append(imageWrap);
        self.stopPropagation(imageWrap);
        var tabs = imageWrap.find('li.tab-item');
        var pannels = imageWrap.find('.pannel-item');
        tabs.click(function () {
            if (!$(this).hasClass('current')) {
                tabs.removeClass('current');
                $(this).addClass('current');
                var show_pannel_id = $(this).attr('pannel');
                pannels.hide();
                imageWrap.find('#' + show_pannel_id).show();
            }
        });
        var cancel = imageWrap.find('.image-cancel');
        cancel.click(function () {
            self.hidePopup();
        });
        var net_image_submit = imageWrap.find('.net-submit');
        net_image_submit.click(function () {
            var net_image_path = imageWrap.find('.net-image-path').first().val();
            // tapd系统oa域图片特殊处理
            var patten_of_pic = /(http:\/\/){0,1}(tapd\.oa\.com|tdl\.oa\.com|rd\.tencent\.com)(\/){1,2}(tfl\/)(captures|pictures)(\/)/i;
            // tapd系统oa域压缩图片特殊处理
            var patten_of_compress_pic = /(http:\/\/){0,1}(tapd\.oa\.com|mac\.oa\.com|rd\.tencent\.com)(\/)(v3|tapd)(\/compress\/compress_img\/700\?src=)(http:\/\/){0,1}(tapd\.oa\.com|tdl\.oa\.com|mac\.oa\.com|rd\.tencent\.com){0,1}(\/){1,2}(tfl\/)(captures|pictures)(\/)/i;
            net_image_path = net_image_path.replace(patten_of_pic, "/$4$5$6");
            net_image_path = net_image_path.replace(patten_of_compress_pic, "/$9$10$11");
            var img_html = '<img src="' + net_image_path + '" />'
            self.insertHtml(img_html);
            self.hidePopup();
        });
        imageWrap.find('form').ajaxForm(options);
    }, {left: 'center'});
});


//上传word
TFL.editor.add('word', function (ui) {
    var self = this;
    self.updatePopup(ui, function () {
        var popup = self.popup,
            wordWrap = $('<div/>').addClass('editor-popup-word'),
            wordHtml = '<form method="post" enctype="multipart/form-data">'
                + '<div class="form-item">'
                + '<label class="control-label">' + editorLang('selectDoc') + '：</label>'
                + '<div class="controls">'
                + '<input type="file" onkeydown="return false;" name="file">'
                + '</div>'
                + '</div>'
                + '<div class="form-item error-tips"><label class="control-label"></label><div class="controls tips">' + editorLang('docNoFileTip') + '</div></div>'
                + '<input type="hidden" value="sid" name="sid">'
                + '<input type="hidden" value="add" name="fun">'
                + '<div class="form-item">'
                + '<div class="controls">( ' + editorLang('docTip') + ' )</div>'
                + '</div>'
                + '<div class="form-action">'
                + '<div class="btn"><input type="submit" value="' + editorLang('importNow') + '" /></div> '
                + '<a class="btn word-cancel"><span>' + editorLang('cancel') + '</span></a>'
                + '</div>'
                + '</form>';

        wordWrap.html(wordHtml);
        popup.append(wordWrap);
        self.stopPropagation(wordWrap);

        var cancel = wordWrap.find('.word-cancel');
        cancel.click(function () {
            self.hidePopup();
        });

        TFL.use(TFL.path + "lib/tfl-editor/js/jquery.form.js", function () {

            //useMsgCrossDomain(IE下是否使用信息传递来实现跨域)
            var useMsgCrossDomain = self.options.useMsgCrossDomain,
                ieDomainFix = useMsgCrossDomain ? ('&ie_domain_fix=' + self.options.id) : '',
                docToHtmlPath = ieDomainFix ? self.options.docToHtmlPath + ieDomainFix : self.options.docToHtmlPath;

            var options = {
                url: docToHtmlPath,
                beforeSubmit: function (formData, jqForm, options) {
                    var file_field_value = formData[0]['value'];
                    if (file_field_value.length == 0) {
                        wordWrap.find('.error-tips').show();
                        return false;
                    } else {
                        TFL.tips.showPreload(editorLang('docLoading'));
                    }
                },
                success: function (responseText, statusText) {
                    //没有使用信息传递跨域方式的成功回调
                    if (!useMsgCrossDomain) {
                        TFL.tips.hidePreload();
                        self.insertHtml(responseText);
                        self.hidePopup();
                    }
                },
                error: function (responseText, statusText) {
                    //没有使用信息传递跨域方式的错误回调
                    if (!useMsgCrossDomain) {
                        TFL.tips.showFlash(editorLang('importWordFailTip'));
                        self.hidePopup();
                    }
                }
            };
            wordWrap.find('form').ajaxForm(options);
        });
    }, {left: 'center'});
});

////截屏插件方法
//(function(win){
//
//    //检测是否安装插件
//    win.DetectActiveX = function() {
//        if ( $.browser.mozilla || $.browser.webkit ) {
//            //FF or Chrome
//            return _checkInstallPlugin();
//        }
//        var result = false;
//        try {
//            var o = new ActiveXObject('SCActiveX.ScreenCapture');
//            result = (o.version < '1.0.0.2') ? false : true;
//            o = null;
//        }catch(e){}
//
//        return result;
//    };
//
//    //检测FF/Chrome浏览器是否安装插件
//    function _checkInstallPlugin() {
//        var ff_plugin_name = 'QQMail Plugin';
//        var ff_plugin_type = 'application/x-tencent-qmail';
//        _oPlugins   = navigator.plugins;
//        if ( _oPlugins ) {
//            for ( var i = _oPlugins.length - 1; i >= 0; i-- )
//            {
//                for (var j = _oPlugins[i].length - 1; j >= 0; j--)
//                {
//                    if(ff_plugin_name == _oPlugins[i].name && _oPlugins[i][j].type.indexOf(ff_plugin_type) != -1 ) {
//                        try {
//                            return (_getGetVersion() < '1.0.1.34') ? false : true;
//                        } catch (e) {
//                            return false;
//                        }
//                   } else {
//                        continue;
//                   }
//                }
//            }
//        }
//        return false;
//    };
//
//    function _getGetVersion(){
//        var _oScreenCapture = _getScreenCapture();
//        return _oScreenCapture.Version;
//    };
//
//    function _getScreenCapture(){
//      return CreateActiveX();
//    };
//
//    win.CreateActiveX = function(activexId) {
//        var _oScreenCapture;
//        try {
//            if ($.browser.msie) {
//                var tmpActivexName="SCActiveX.ScreenCapture";
//                if (activexId==2) {
//                    tmpActivexName="SCActiveX.Uploader";
//                }
//                _oScreenCapture = new ActiveXObject(tmpActivexName);
//            } else if ($.browser.mozilla || $.browser.webkit) {
//                if (activexId==2) {
//                    //load uploader
//                   _oScreenCapture = _getEmbed().CreateUploader();
//                } else {
//                   _oScreenCapture = _getEmbed().CreateScreenCapture();
//                }
//            }
//        } catch (_oError) {
//            console.log(_oError);
//        }
//        return _oScreenCapture;
//    };
//
//    function _getEmbed(){
//        var _sEmbedId = "tfl-editor-embed",
//        _oEmbed = document.getElementById(_sEmbedId);
//        if (!_oEmbed) {
//            var _oEmbed = document.createElement("embed");
//            _oEmbed.id = _sEmbedId;
//            if($.browser.mozilla) {
//                _oEmbed.type = "application/x-tencent-qmail"; //FF
//            } else {
//                _oEmbed.type = "application/x-tencent-qmail-webkit"; //chrome
//            }
//            _oEmbed.hidden = "true";
//            _oEmbed.height = "1";
//            _oEmbed.width = "1";
//            _oEmbed.style.position = "absolute";
//            _oEmbed.style.left = "0px";
//            _oEmbed.style.top = "0px";
//            _oEmbed.style.display = "block";
//            document.body.appendChild(_oEmbed);
//        }
//        return _oEmbed;
//    };
//
//    //截屏上传图片
//    win.uploadCustomImg = function(_aIsWarn){
//        var self = this;
//        self.isFireUploadEvent = false;
//        if ( _saveImg( _aIsWarn ) ){
//            return _startUploadCustomImg( null );
//        }
//
//        //判断粘贴板是否有图片
//        function _saveImg( _aIsWarn ) {
//            if ( !self.screenSnapObj ) {
//                if ( !DetectActiveX() )
//                    return false;
//                self.screenSnapObj = CreateActiveX();
//            }
//
//            if ( !self.screenSnapObj.IsClipBoardImage ) {
//                if ( _aIsWarn )
//                console.log('截屏不成功！');
//                return false;
//            }
//
//            self.screenImg = self.screenSnapObj.SaveClipBoardBmpToFile(1);
//            if ( !self.screenImg ) {
//                if ( _aIsWarn )
//                console.log('保存截屏图片不成功！');
//                return false;
//            }
//            return true;
//        };
//
//        function _startUploadCustomImg( _aFileCtrl ) {
//            if ( !self.screenImg && !_aFileCtrl )
//                return false;
//
//            if ( !self.uploaderObj ) {
//                self.uploaderObj = CreateActiveX( 2 );
//            }
//
//            var _uploader    = self.uploaderObj;
//            var _isCallBack  = false;
//
//            var _fOnCallBack = function( _aIsOk, _aParam, img) {
//                if ( _isCallBack )
//                    return ;
//                _isCallBack  = true;
//                doUploadFinish.call( self, _aIsOk ? true : false, _aParam, img);
//            };
//            var img = self.getImgUploadLoading();
//            _uploader.StopUpload();
//            _uploader.ClearHeaders();
//            _uploader.ClearFormItems();
//            _uploader.URL     = self.options.imageUploadPath; //&prefix=tapd_755&show_relative_path=true&relative_base_path=/
//            _uploader.OnEvent = function( _aObj, _aEventId, _aP1, _aP2, _aP3 ) {
//                switch( _aEventId ) {
//                    case 1:
//                        //error
//                        return _fOnCallBack( false, {
//                            errCode : _aP1
//                        }, img);
//                    case 2:
//                        //process
//                        return;
//                    case 3:
//                        //finish
//                       _fOnCallBack(true, { imgUrl : self.trimScripTag(_uploader.Response)}, img);
//                    }
//            };
//
//            _uploader.AddHeader(   "Cookie", document.cookie );
//            _uploader.AddFormItem( "mode", 0, 0, /*!gIsIE || gIEVer >= 7 || location.protocol == "https:" ? */"download" );
//            _uploader.AddFormItem( "from", 0, 0, _aFileCtrl ? "" : "snapscreen" );
//
//            _uploader.AddFormItem( "widthlimit", 0, 0, 0 );
//            _uploader.AddFormItem( "heightlimit", 0, 0, 0 );
//            _uploader.AddFormItem( "sizelimit", 0, 0, 0 );
//
//            if ( _aFileCtrl ) {
//                _uploader.AddFormItemObject( _aFileCtrl );
//            }
//            else {
//                _uploader.AddFormItem( "UploadFile", 1, 4, self.screenImg );
//            }
//            _uploader.StartUpload();
//            return true;
//        };
//
//    };
//
//    win.doUploadFinish = function( _aIsOk, _aParam, img) {
//        var self = this;
//        if ( self.isFireUploadEvent )
//            return ;
//        self.isFireUploadEvent = true;
//        if ( _aIsOk ) {
//            img.attr('src', _aParam.imgUrl);
//        } else {
//            img.length && img.remove();
//            TFL.tips.showFlash(editorLang('uploadImageFailTip'));
//        }
//        window.status = 'Done';
//    };
//
//
//})(window);


//截屏插件触发
TFL.editor.add('screenshot', function (ui) {
    var self = this;
    if (!DetectActiveX()) {
        window.open(TFL.path + "components/getactivex.html");
        return;
    }
    _screenSnap(function (_aIsOk) {
        if (_aIsOk) {
            uploadCustomImg.call(self, true)
        }
    });
    function _screenSnap(_aOnCaptureFinishEvent) {
        if (!DetectActiveX())
            return;
        if (!self.screenSnapObj)
            self.screenSnapObj = CreateActiveX();

        var _fEventCreater = function (_aIsOk) {
            return function () {
                if (typeof( _aOnCaptureFinishEvent ) == "function")
                    _aOnCaptureFinishEvent(_aIsOk);
            };
        };
        self.screenSnapObj.OnCaptureFinished = _fEventCreater(true);
        self.screenSnapObj.OnCaptureCanceled = _fEventCreater(false);
        self.screenSnapObj.DoCapture();
    }
});

TFL.editor.add('clean', function (ui) {
    this.cmd.exec('removeFormat');
    var format = this.cmd.getSelectionHtml();

    var blockTag = "h1|h2|h3|h4|h5|h6|div|p|li|dd|dt|pre|tr";
    var reg = new RegExp('</(' + blockTag + ')>', 'ig');
    format = format.replace(reg, function ($0) {
        return $0 + '\r\n';
    });
    var cleanTxt = $('<div>').html(format).text();
    var html = cleanTxt.replace(/[\r\n]+(\s*[\r\n])*/ig, "</p><p>");
    this.cmd.insertHtml('<p>' + html + '</p>');
});


//上传图片
TFL.editor.add('uploadimage', function (ui) {
}, function (ui, openMenuBtn) {
    var iframename = 'weiyun_note_edit_pic_upload_iframe';
    var self = this,
        http_protocol = location.protocol;
    if (!ui || ui.length === 0) {
        btn = openMenuBtn;
    } else {
        btn = ui;
    }
    btn.css({ 'overflow': 'hidden' })
        .prepend('<form method="post" action="'+http_protocol+'//user.weiyun.com/wx/pic_uploader.fcg?appid=30012" target="weiyun_note_edit_pic_upload_iframe" enctype="multipart/form-data">'
            + '<input type="file" id="note_view_pic_upload_file" onkeydown="return false;" name="UploadFile" accept="image/*" style="font-size:50px;opacity:0;filter: alpha(opacity=0);">'
            + '</form>');

    var file = btn.find('input[type=file]');
    // console.log(file);
    if (btn.is('.editor-menu-item')) {
        btn.css({
            width: 100,
            height: 12,
            position: 'relative',
            overflow: 'hidden'
        });
        file.css({
            position: 'absolute',
            right: 0
        })
        // file.css({
        //  position: 'absolute'
        // })
    } else {
        btn.css({
            position: 'relative'
        })
        file.css({
            position: 'absolute',
            right: 0
        })
    }

    function uploadPic(){
        //添加iframe
        if (!($('#' + iframename).length > 0)) {
            var uploadiframe = $('<iframe name=' + iframename + ' id=' + iframename + ' style="display:none;width:0px;height:0px;" tabindex="-1"></iframe>').appendTo($(document.body));
        }
        var file = $('#note_view_pic_upload_file');
        var formData = file.closest('form')[0];
        var file_field_value = formData[0]['value'];
        var file_extend_name = file_field_value.substring(file_field_value.lastIndexOf('.')).toLowerCase();
        if (file_extend_name !== '.gif' && file_extend_name !== '.png' && file_extend_name !== '.jpg' && file_extend_name !== '.jpeg' && file_extend_name !== '.bmp') {
            return false;
        }
        formData.submit();
        setTimeout(function () {
            try {
                $('#note_view_pic_upload_file').remove();
                $('<input type="file" id="note_view_pic_upload_file" onkeydown="return false;" name="UploadFile" accept="image/*" style="font-size:50px;opacity:0;filter: alpha(opacity=0);">').appendTo($(formData)).change(function () {
                    uploadPic();
                })
            }
            catch (e) {
            }
            ;
        }, 100);
        if (window.parent.call_save_upload_pic) {
            window.parent.call_save_upload_pic();
        }
    }

    //图片上传yuyanghe修改
    file.change(function () {
        uploadPic();
    });



});


TFL.editor.add('netimage', function (topBtn, menuBtn) {
    var self = this;
    var popRelBtn = menuBtn || topBtn;
    self.updatePopup(popRelBtn, function () {
        var popup = self.popup,
            imageWrap = $('<div/>').addClass('editor-popup-image'),
            imageHtml = '<div class="pannel-item" id="net-image-pannel">'
                + '<div class="form-item">'
                + '<label class="control-label">' + editorLang('imagePath') + '：</label>'
                + '<div class="controls"><input type="text" value="http://" class="net-image-path"></div>'
                + '</div>'
                + '<div class="form-item"><div class="controls">( ' + editorLang('imagePathTip') + ' )</div></div>'
                + '<div class="form-action">'
                + '<a class="btn net-submit"><span>' + editorLang('insertNow') + '</span></a> '
                + '<a class="btn image-cancel"><span>' + editorLang('cancel') + '</span></a>'
                + '</div>'
                + '</div>';

        imageWrap.html(imageHtml);
        popup.append(imageWrap);
        self.stopPropagation(imageWrap);

        imageWrap.find('.image-cancel').click(function () {
            self.hidePopup();
        });
        var net_image_submit = imageWrap.find('.net-submit');
        net_image_submit.click(function () {
            var net_image_path = imageWrap.find('.net-image-path').first().val();
            // tapd系统oa域图片特殊处理
            var patten_of_pic = /(http:\/\/){0,1}(tapd\.oa\.com|tdl\.oa\.com|rd\.tencent\.com)(\/){1,2}(tfl\/)(captures|pictures)(\/)/i;
            // tapd系统oa域压缩图片特殊处理
            var patten_of_compress_pic = /(http:\/\/){0,1}(tapd\.oa\.com|mac\.oa\.com|rd\.tencent\.com)(\/)(v3|tapd)(\/compress\/compress_img\/700\?src=)(http:\/\/){0,1}(tapd\.oa\.com|tdl\.oa\.com|mac\.oa\.com|rd\.tencent\.com){0,1}(\/){1,2}(tfl\/)(captures|pictures)(\/)/i;
            net_image_path = net_image_path.replace(patten_of_pic, "/$4$5$6");
            net_image_path = net_image_path.replace(patten_of_compress_pic, "/$9$10$11");
            var img_html = '<img src="' + net_image_path + '" />'
            self.insertHtml(img_html);
            self.hidePopup();
        });
    }, {left: 'center'});
});
