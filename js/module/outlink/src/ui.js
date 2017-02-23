/**
 * http://tapd.oa.com/QQdisk/prong/stories/view/1010030581056463249
 */

define(function(require, exports, module) {

    var lib = require('lib'),
        cookie = lib.get('./cookie'),
        common = require('common'),
        $ = require('$'),
        console = lib.get('./console'),
        collections = lib.get('./collections'),
        text = lib.get('./text'),
        date_time = lib.get('./date_time'),
        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        File = common.get('./file.file_object'),
	    huatuo_speed = common.get('./huatuo_speed'),
        request = common.get('./request'),
        constants = common.get('./constants'),
        ui_center = common.get('./ui.center'),
        mini_tip = common.get('./ui.mini_tip'),
        tmpl = require('./tmpl'),
        util = require('./util'),
        main_ui = require('main').get('./ui'),
        widgets = common.get('./ui.widgets'),
        outlink,
        sel_box,
        should_pwd,
        speed_flags_pic = '7830-4-7-1',
        speed_flags_nopic = '7830-4-7-2',
        shareImageList = [], //分享的目录下的图片集合，预览图片时需要
        shareFileInfo = {}, //分享的文件
        allFileInfo = {},
        isAllPic = false, //分享的是否全部是图片
        isSingleFile = false,//单文件时下载栏直接就是enabled状态
        notShowDownload = false, //不展示下载，笔记无法下载
        notSaveToWy = false,//不展示保存到微云
        noBoxSelection = false,
        preview_dispatcher = common.get('./util.preview_dispatcher'),
        File = common.get('./file.file_object'),
        undefined;

    var ui = new Module('outlink_ui', {

        render: function() {
            outlink = require('./outlink');
            this._init_ui();
        },

        _init_ui: function() {},

        get_$outlink_body: function() {
            return $('.module-share-new');
        },

        get_$outlink_login: function() {
            return $('#_main_header_banner');
        },
        // 显示用户信息
        _render_user_info: function() {
            require('./user_info').render();
        },
        //显示面包屑
        _render_breadcrumb: function(share_info) {
            var me = this;
            me.get_$outlink_body().append(tmpl['outlink_breadcrumb'](share_info));
        },

        /**
         * 显示外链页面内容    outlink中调用
         * @param share_info
         */
        render_outlink_content: function(share_info) {
            var me = this;
            share_info = share_info;
            me.get_$outlink_body().append(tmpl['outlink_header']());
            if (share_info) {
                //判断是否是私密外链
                if (share_info.need_pwd && share_info.need_pwd == 1) {
                    should_pwd = true;
                    me._render_outlink_login();
                } else {
                    me._render_outlink_content_ok(share_info);
                }
            }
        },
        /**
         * 真正显示外链页面内容的函数
         * @param share_info
         * @private
         */
        _render_outlink_content_ok: function(share_info) {
            var me = this;
            var is_render_pic,
                fileObj,
                fileInfo,
                count,
                word,
                flag = 'allPic',
                $container = me.get_$outlink_body();
            $('#outlink_login').show();

            var dir_list = share_info.dir_list || [],
                file_list = share_info.file_list || [],
                share_flag = share_info.share_flag;
                count = file_list.length + dir_list.length;
            if(dir_list.length > 0 && file_list.length > 0) {
                word = '文件(夹)';
            } else if (dir_list.length > 0 && 0 == file_list.length) {
                word = '文件夹';
            } else {
                for(var k = 0, len = file_list.length; k < len; k++) {
                    if(!util.is_image(file_list[k].file_name)) {
                        word = '文件';
                        flag = 'notAllPic';
                        break;
                    }
                }
                if('allPic' == flag) {
                    word = '图片';
                }
            }
            if (share_flag == 2 || share_flag == 4) { //笔记外链
                isSingleFile = true;
                notShowDownload = true;
                word = '笔记';
                noBoxSelection = true;
                me._render_outlink_note(share_info);
            } else if (share_flag == 5 || share_flag == 6 || share_flag == 7 || share_flag == 8) { //文章外链
                isSingleFile = true;
                notShowDownload = true;
                notSaveToWy = true;
                word = '文章';
                noBoxSelection = true;
                me._render_outlink_article(share_info);
            } else {
                if (1 == dir_list.length && 0 == file_list.length && ((dir_list[0].total_dir_count + dir_list[0].total_file_count) <= 100) && ((dir_list[0].total_dir_count + dir_list[0].total_file_count) > 0)) { //产品逻辑：当分享的只有一个文件夹且文件内文件总数<=100时，展示文件夹内文件，否则展示该文件夹
                    share_info.file_list = dir_list[0]['file_list'] || [];
                    share_info.dir_name = dir_list[0]['dir_name'];
                    share_info.dir_list = dir_list[0]['dir_list'] || [];
                    share_info.pdir_key = dir_list[0]['dir_key'];
                    file_list = dir_list[0]['file_list'] || [];
                    dir_list = dir_list[0]['dir_list'] || [];
                }
                if(0 == dir_list.length && 1 == file_list.length && util.is_image(share_info.share_name)) {
                    isSingleFile = true;
                }
                for (var i = 0, len = (share_info.file_list || []).length; i < len; i++) {
                    fileInfo = share_info.file_list[i];
                    if(util.is_image(fileInfo.file_name)) {
                        fileObj = new File({
                            id: fileInfo.file_id, //String   文件ID
                            pid: fileInfo.pdir_key, //String   父目录ID
                            name: fileInfo.file_name, //String   文件名
                            size: fileInfo.file_size, //Number   字节数，默认0
                            cur_size: fileInfo.file_size
                        });
                        shareImageList.push(fileObj);
                    }
                }
                if (dir_list.length > 0) { //有文件夹的
                    me._render_breadcrumb(share_info);
                    me._render_outlink_multifile(share_info);
                } else {
                    if (1 == file_list.length && util.is_image(share_info.share_name)) { //单图片
                        isSingleFile = true;
                        me._render_outlink_singlepic(share_info);
                    } else {
                        me._render_breadcrumb(share_info);
                        isAllPic = util.isAllPic(file_list);
                        if (isAllPic) { //全图片
                            me._render_outlink_allpic(share_info);
                        } else {
                            me._render_outlink_multifile(share_info);
                        }
                    }
                }
            }
            $container.find('#_outlink_header').after(tmpl['outlink_download']({
                share_type: share_info.share_type,
                headIconUrl: share_info.share_head_image_url,
                nickname: share_info.share_nick_name,
                isSingleFile: isSingleFile,
                count: count,
                notShowDownload: notShowDownload,
                notSaveToWy: notSaveToWy,
                word: word
            }));
            if(!noBoxSelection) {
                me._enable_box_selection();
            }
            me._formatShareInfo(share_info);
            me._init_qr_code(share_info);
            me._initDownloadEvent(share_info);
            me._initSelectEvent();
            me._initPreviewEvent(share_info);
            me._render_user_info();

            //设置下载的cookie
            var dlskey = share_info.dlskey;
            if (dlskey) {
                outlink.set_download_cookie(dlskey);
            }

            this.speed_time_report();
        },
        _formatShareInfo: function(share_info) {
            var obj;
            if (share_info && share_info.file_list) {
                for (var i = 0, len = share_info.file_list.length; i < len; i++) {
                    obj = share_info.file_list[i];
                    allFileInfo[obj['file_id']] = {
                        flag: 'file',
                        file_id: obj['file_id'],
                        name: obj['file_name'],
                        size: obj['file_size'],
                        pdir_key: obj['pdir_key'],
                        thumb_url: obj['thumb_url']
                    }
                }
            }
            if (share_info && share_info.dir_list) {
                for (var j = 0, len = share_info.dir_list.length; j < len; j++) {
                    obj = share_info.dir_list[j];
                    allFileInfo[obj['dir_key']] = {
                        flag: 'dir',
                        dir_key: obj['dir_key'],
                        name: obj['dir_name']
                    }
                }
            }
        },
        _initPreviewEvent: function(share_info) {
            var $container = $('div.share-file-list'),
                me = this;
            $container.on('click', '.share-file', function() {
                var $self = $(this),
                    record = {},
                    id = $self.attr('data-record-id'),
                    fileInfo = allFileInfo[id];
                var data = {
                    share_key: share_info.share_key,
                    pdir_key: share_info.pdir_key,
                    pwd: share_info.pwd,
                    pack_name: fileInfo.name,
                    file_list: [],
                    dir_list: []
                };
                if ('file' == fileInfo.flag) {
                    record = new File({
                        id: fileInfo.file_id, //String   文件ID
                        pid: fileInfo.pdir_key, //String   父目录ID
                        name: fileInfo.name, //String   文件名
                        size: fileInfo.size, //Number   字节数，默认0
                        cur_size: fileInfo.size
                    });
                    for (var i = 0, len = shareImageList.length; i < len; i++) {
                        if (fileInfo.file_id == shareImageList[i].get_id()) {
                            record = shareImageList[i];
                            break;
                        }
                    }
                    // 文档预览
                    // 如果是可预览的文档，则执行预览操作
                    if (preview_dispatcher.is_preview_doc(record)) { //文件，txt，doc，pdf等
                        if(record.get_size() > 50 * 1024 * 1024) {
                            widgets.confirm('温馨提示', '您访问的文件大于50MB，暂时无法在线预览，请下载后在电脑中打开。', '', function(e) {
                                if(query_user.check_cookie()) {
                                    data.file_list.push({
                                        file_id: fileInfo['file_id'],
                                        pdir_key: fileInfo['pdir_key']
                                    });
                                    request.xhr_post({
                                        url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                                        cmd: 'WeiyunSharePartDownload',
                                        use_proxy: true,
                                        pb_v2: true,
                                        body: data
                                    }).ok(function(msg, body) {
                                        me.get_$down_iframe().attr('src', body.download_url);
                                    }).fail(function(msg) {
                                        mini_tip.error(msg || '下载失败');
                                    });
                                } else {
                                    $('#outlink_login').click();
                                }
                            }, $.noop, ['下载', '取消']);
                        } else {
                            record._share_key = share_info.share_key; //分享的文件预览时需求带上_share_key参数
                            record._share_pwd = share_info.pwd;
                            data.file_list.push({
                                file_id: fileInfo['file_id'],
                                pdir_key: fileInfo['pdir_key']
                            });
                            record.down_file = function() {//点击 预览中的下载 的回调函数
                                if(query_user.check_cookie() ) {
                                    request.xhr_post({
                                        url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                                        cmd: 'WeiyunSharePartDownload',
                                        use_proxy: true,
                                        pb_v2: true,
                                        body: data
                                    }).ok(function(msg, body) {
                                        me.get_$down_iframe().attr('src', body.download_url);
                                    }).fail(function(msg) {
                                        mini_tip.error(msg || '下载失败');
                                    });
                                } else {
                                    $('#outlink_login').click();
                                }
                            };
                            preview_dispatcher.preview(record);
                        }
                    } else if (util.is_image(fileInfo.name)) { //图片
                        me.preview_image(record);
                    } else { //不是可预览文件，像音乐，视频等
                        if(query_user.check_cookie()) {
                            data.file_list.push({
                                file_id: fileInfo['file_id'],
                                pdir_key: fileInfo['pdir_key']
                            });
                            request.xhr_post({
                                url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                                cmd: 'WeiyunSharePartDownload',
                                use_proxy: true,
                                pb_v2: true,
                                body: data
                            }).ok(function(msg, body) {
                                me.get_$down_iframe().attr('src', body.download_url);
                            }).fail(function(msg) {
                                mini_tip.error(msg || '下载失败');
                            });
                        } else {
                            $('#outlink_login').click();
                        }
                    }
                } else { //文件夹
                    return; //文件夹先不给下载
                    if(query_user.check_cookie()) {
                        data.dir_list.push({
                            dir_key: fileInfo['dir_key']
                        });
                        request.xhr_post({
                            url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                            cmd: 'WeiyunSharePartDownload',
                            use_proxy: true,
                            pb_v2: true,
                            body: data
                        }).ok(function(msg, body) {
                            me.get_$down_iframe().attr('src', body.download_url);
                        }).fail(function(msg) {
                            mini_tip.error(msg || '保存失败');
                        });
                    } else {
                        $('#outlink_login').click();
                    }
                }
            });
            return false;
        },
        _initSelectEvent: function() {
            var $container = $('div.share-file-list'),
                $shareFiles = $container.find('div.share-file');
            var me = this,
                recordIdArr = [];
            $('#checkall').on('click', function() { //全选
                recordIdArr = [];
                var $self = $(this);
                if ($self.hasClass('checkalled')) {
                    $self.removeClass('checkalled');
                    $shareFiles.removeClass('ui-selected'); //普通文件
                    $('.download').addClass('g-btn-disabled');
                    $('.save-to-weiyun').addClass('g-btn-disabled');
                    me._get_sel_box().set_selected_status([], true);
                } else {
                    $self.addClass('checkalled');
                    $shareFiles.removeClass('ui-selected').addClass('ui-selected');
                    $.each($shareFiles, function(index, div) {
                        recordIdArr.push($(div).attr('data-record-id'));
                    }); 
                    $('.download').removeClass('g-btn-disabled');
                    $('.save-to-weiyun').removeClass('g-btn-disabled');
                    me._get_sel_box().set_selected_status(recordIdArr, true);
                }
                return false;
            });
            $container.on('click', '.checkbox', function() {
                recordIdArr = [];
                var $self = $(this),
                    $fileDiv = $self.closest('.share-file');
                if ($fileDiv.hasClass('ui-selected')) {
                    $fileDiv.removeClass('ui-selected');
                } else {
                    $fileDiv.addClass('ui-selected');
                }
                $container.find('div.ui-selected').each(function(index, div) {
                    recordIdArr.push($(div).attr('data-record-id'));
                });
                me._get_sel_box().set_selected_status(recordIdArr, true);
                if (0 == $container.find('div.ui-selected').length) {
                    $('.download').addClass('g-btn-disabled');
                    $('.save-to-weiyun').addClass('g-btn-disabled');
                } else {
                    $('.download').removeClass('g-btn-disabled');
                    $('.save-to-weiyun').removeClass('g-btn-disabled');
                }
                if ($container.find('.ui-selected').length == $container.attr('data-count')) {
                    $('#checkall').removeClass('checkalled').addClass('checkalled');
                } else {
                    $('#checkall').removeClass('checkalled');
                }
                return false;
            });
        },
        _get_share_enter: function(callback) {
            require.async('share_enter', function(mod) {
                var share_enter = mod.get('./share_enter');
                callback.call(this, share_enter);
            });
        },
        //图片预览
        preview_image: function(file) {
            var me = this;

            require.async(['image_preview', 'downloader', 'file_qrcode'], function(image_preview_mod, downloader_mod, file_qrcode_mod) {
                var file_qrcode = file_qrcode_mod.get('./file_qrcode'),
                    image_preview = image_preview_mod.get('./image_preview'),
                    downloader = downloader_mod.get('./downloader'),
                    thumb_url_loader = downloader_mod.get('./thumb_url_loader');
                // 当前图片所在的索引位置
                var index = $.inArray(file, shareImageList);
                image_preview.start({
                    total: shareImageList.length,
                    index: index,
                    //images: shareImageList,
                    get_thumb_url: function(index) {//返回预览时的图片地址
                        return allFileInfo[shareImageList[index].get_id()]['thumb_url'] + '&size=64*64';
                    },
                    get_url: function(index) {//返回预览时的图片地址
                        return allFileInfo[shareImageList[index].get_id()]['thumb_url'] + '&size=1024*1024';
                    },
                    download: function(index, e) {
                        if(query_user.check_cookie() ) {
                            var file = shareImageList[index];
                            downloader.down(file, e);
                        } else {
                            $('#outlink_login').click();
                        }
                    }
                });
            });
        },
        //框选
        _get_sel_box: function() {
            if (!sel_box) {
                var SelectBox = common.get('./ui.SelectBox');
                var $list = $('#lay-main-con .dirs');
                sel_box = new SelectBox({
                    ns: 'share',
                    $el: $list,
                    $scroller: $('#lay-main-con'),
                    all_same_size: true,
                    keep_on: function($tar) {
                        return $tar.is('label');
                    },
                    clear_on: function($tar) {
                        return $tar.closest('[data-record-id]').length === 0;
                    },
                    container_width: function() {
                        return $list.width();
                    }
                });
            }
            return sel_box;
        },
        //启用框选
        _enable_box_selection: function() {
            var me = this,
                sel_box = me._get_sel_box();
            sel_box.enable();
            this.listenTo(sel_box, 'select_change', function(sel_id_map, unsel_id_map) {
                var selectedSomeone = false;
                for (var i in (sel_id_map || {})) {
                    selectedSomeone = true; //能进来说明sel_id_map不为{}
                    break;
                }
                if (selectedSomeone) {
                    $('.download').removeClass('g-btn-disabled');
                    $('.save-to-weiyun').removeClass('g-btn-disabled');
                } else {
                    $('.download').removeClass('g-btn-disabled').addClass('g-btn-disabled');
                    $('.save-to-weiyun').removeClass('g-btn-disabled').addClass('g-btn-disabled');
                }
                if ($('div.ui-selected').length == $('div.share-file-list').attr('data-count')) {
                    $('#checkall').removeClass('checkalled').addClass('checkalled');
                } else {
                    $('#checkall').removeClass('checkalled');
                }
            });
        },
        _render_outlink_content_fail: function(msg, ret) {
            var $body = this.get_$outlink_body();
            $('body').addClass('link-out');
            $(tmpl['outlink_fail']({
                "msg": msg,
                "ret": ret
            })).appendTo($body);
            this.set_fail_msg(msg, ret);
        },

        /**
         * 密码正确后显示外链内容
         * @param share_info
         */
        render_outlink_pwd_ok: function(share_info) {
            var me = this;
            $('#outlink_login').show();
            $('#outlink_login_pass_access').hide();
            me._render_outlink_content_ok(share_info);
            me._render_user_info();
        },

        /**
         * 显示风险详细信息
         * @param share_info
         */
        render_outlink_risk: function(share_info) {
            var me = this;
            me.render();
            var $body = this.get_$outlink_body();
            $(tmpl['outlink_risk']()).appendTo($body);
            me._set_file_name(share_info.share_name);
            var html = '';
            switch (share_info.safe_type) {
                case 1:
                    html += '安全';
                    break;
                case 2:
                    html += '高风险';
                    break;
                case 3:
                    html += '中风险';
                    break;
                case 4:
                    html += '低风险';
                    break;
            }
            $('#risk_level').text(html);
            $('#virus').text(share_info.virus_name);
            $('#virus_detail').text(share_info.virus_desc);
            $('#file-icon').addClass('icon-' + util.get_file_icon_class(share_info.share_name));
            $('#outlink_login').show();
            me._initDownloadEvent();
            me._render_user_info();
        },

        /**
         * 私密外链登录框显示
         */
        _render_outlink_login: function() {
            var me = this,
                $body = me.get_$outlink_body();

            $(tmpl['outlink_login']()).appendTo($body);
            $('#outlink_pwd').focus();

            me._initLoginEvent();
        },
        /**
         * 私密外链登录框显示
         */
        _initLoginEvent: function() {
            var me = this;
            //点击确认
            $('#outlink_pwd_ok').click(function(e) {
                me._login();
                return false;
            });
            //监听回车
            $('#outlink_pwd, #outlink_code').keydown(function(event) {
                if (event.keyCode == 13) {
                    me._login();
                }
            });

            $('#_verify_code_img, #_change_verify_code').on('click', function(e) {
                    e.preventDefault();
                    me.change_verify_code();
                })
                //默认聚焦到文本框
            $('#outlink_pwd').focus();
        },

        change_verify_code: function() {
            var $img = $('#_verify_code_img');
            $img[0].src = constants.BASE_VERIFY_CODE_URL + Math.random();
        },

        show_verify_code: function() {
            $('#outlink_login_pass_access').addClass('code-module').css('marginTop', '-140px');
            this.set_need_verify_code(true);
            this.change_verify_code();
        },
        /**
         * 外链密码验证
         * @private
         */
        _login: function() {
            var me = this,
                pwd = '',
                verify_code;
            pwd = $('#outlink_pwd').val();
            if (pwd.length == 0) {
                me.set_pwd_err_text('请输入密码');
            } else {
                if (me.is_need_verify_code()) {
                    verify_code = $.trim($('#outlink_code').val());
                    if (!me.check_verify_code(verify_code)) {
                        me.set_verify_err_text('请输入正确的验证码');
                        return;
                    }
                }
                me.set_pwd_err_text('');
                me.set_verify_err_text('');
                outlink.pwd_login(pwd, verify_code);
            }
            return false;
        },

        check_verify_code: function(verify_code) {
            if (verify_code.length < 4) { //小于4位时提示
                return false;
            }
            return true;

        },

        is_need_verify_code: function() {
            return this._need_verify_code;
        },

        set_need_verify_code: function(need) {
            this._need_verify_code = !!need;
        },

        /**
         * 单文件外链分享界面
         * @param share_info
         * @private
         */
        _render_outlink_singlefile: function(share_info) {
            var me = this,
                $body = me.get_$outlink_body();
            $(tmpl['outlink_singlefile']()).appendTo($body);

            me._set_file_name(share_info.share_name);
            if (share_info.file_list[0] && share_info.file_list[0].file_size) {
                $("#show_file_size").text('文件大小:' + File.get_readability_size(share_info.file_list[0].file_size,
                    false, 1));
            }
            $('#file-icon').addClass('icon-' + util.get_file_icon_class(share_info.share_name));
            if (share_info.safe_type > 0) {
                me._render_outlink_risk(share_info)
            }
        },
        getShareList: function(dirList, fileList) {
            var fileLen,
                dirLen,
                shareList = [];
            fileList = fileList || [],
            fileLen = fileList.length,
            dirList = dirList || [],
            dirLen = dirList.length;
            for (var j = 0; j < dirLen; j++) {
                obj = dirList[j];
                shareList.push({
                    id: obj['dir_key'],
                    name: obj['dir_name'],
                    text: obj.hasOwnProperty('total_file_count') || obj.hasOwnProperty('total_dir_count') ? (obj['total_file_count'] || 0) + (obj['total_dir_count'] || 0) + '个文件' : '',
                    icon: 'folder'
                });
            }
            for (var i = 0; i < fileLen; i++) {
                obj = fileList[i];
                shareList.push({
                    id: obj['file_id'],
                    name: obj['file_name'],
                    text: util.switchSize(obj['file_size']),
                    icon: util.get_file_icon_class(obj['file_name']),
                    isImg: util.is_image(obj['file_name']),
                    thumb_url: obj['thumb_url']
                });
                shareFileInfo[obj['file_id']] = {
                    id: obj['file_id'],
                    name: obj['file_name'],
                    size: obj['file_size'],
                    pid: obj['pdir_key']
                };
            }
            return shareList;
        },
        _render_outlink_singlepic: function(share_info) {
            var me = this,
                $container = me.get_$outlink_body(),
                picObj = share_info && share_info.file_list && share_info.file_list[0];
            $container.append(tmpl['outlink_singlepic'](picObj));
        },
        _render_outlink_allpic: function(share_info) {
            var me = this,
                fileObj,
                $container = me.get_$outlink_body(),
                fileList = (share_info && share_info.file_list) || [];
            for (var i = 0, len = fileList.length; i < len; i++) {
                fileObj = fileList[i];
                shareFileInfo[fileObj['file_id']] = {
                    id: fileObj['file_id'],
                    name: fileObj['file_name'],
                    size: fileObj['file_size'],
                    pid: fileObj['pdir_key']
                };
            }
            $container.append(tmpl['outlink_allpic'](fileList));
        },
        /**
         * 多文件外链分享界面
         * @param share_info
         * @private
         */
        _render_outlink_multifile: function(share_info) {
            var me = this,
                $body = me.get_$outlink_body(),
                icon_cls,
                obj = null,
                shareList = [],
                fileList = (share_info && share_info.file_list) || [],
                fileLen = fileList.length,
                dirList = (share_info && share_info.dir_list) || [],
                dirLen = dirList.length;
            shareList = me.getShareList(dirList, fileList);
            $(tmpl['outlink_multifile']({
                shareList: shareList
            })).appendTo($body);
        },

        /**
         * 笔记外链分享界面
         * @param share_info
         * @private
         */
        _render_outlink_note: function(share_info) {
            var me = this,
                $body = me.get_$outlink_body();

            var note_info = share_info.item && share_info.item.item_htmltext,
                note_base_info = share_info.item && share_info.item.note_basic_info;
            var $share_body = $(tmpl['outlink_note']({
                    noteId: (note_base_info && note_base_info.note_id) || ''
                }));
            $share_body.appendTo($body);
            $share_body.find('h1.headline').text(text.smart_cut(share_info.share_name, 40));
            $share_body_cnt = $share_body.find('div.content');
            //包含网址的笔记
            if (note_base_info.note_type == 1) {
                var artitle_info = share_info.item && share_info.item.item_article,
                    html_content = artitle_info.note_comment && artitle_info.note_comment.note_html_content || '';
                $share_site_body = $(tmpl['outlink_note_site']());
                $share_site_body.appendTo($share_body_cnt);
                if (!html_content) {
                    $share_body.find('[data-id=outlink_share_bookmark]').hide();
                } else {
                    $share_site_body.find('[data-id=outlink_share_site_note]').text(html_content);
                }
                //$share_site_body.find('[data-id=outlink_share_site_title]').text(note_info.title);
                $share_body.find('[data-id=outlink_share_site_url]').attr('href', artitle_info.note_raw_url).text(artitle_info.note_raw_url).show();

                $share_body.find('[data-id=outlink_share_site_cnt]').html('<iframe src="' + artitle_info.note_artcile_url + '" frameborder="0" scrolling="auto" width="100%" height="500px"/>');
            } else {
                $share_body_cnt.html(note_info.note_html_content);
                //需要对里面的图片宽度和高度做处理,内容定宽960，所以超过的需重置为960
                var $imgs = $share_body_cnt.find('img');
                if ($imgs.length > 0) {
                    $.each($imgs, function(i, img) {
                        img.onload = function() {
                            if(this.width > 960) {
                                img.width = 960;
                            }
                        };
                    });
                }
            }
        },

        /**
         * 文章外链分享界面
         * @param share_info
         * @private
         */
        _render_outlink_article: function(share_info) {
            var me = this,
                $body = me.get_$outlink_body(),
                $share_body = $(tmpl['outlink_note']({
                    noteId: share_info && share_info.file_list && share_info.file_list.length > 0 && share_info.file_list[0].file_id
                }));

            $share_body.appendTo($body);

            var article_info = share_info.collection;

            $share_body.find('h1.headline').text(text.smart_cut(share_info.share_name, 40));
            var time_src_author = article_info.modify_time;

            //time_src_author += ' 作者:'+article_info.author.num_id;

            if (article_info.bid) {
                var src_arr = {
                    "1": "QQ",
                    "2": "Qzone"
                };
                time_src_author += ' 来源:' + src_arr[article_info.bid];
            }
            $share_body.find('[data-id=outlink_share_time]').text(time_src_author);

            $share_body_cnt = $share_body.find('div.content');

            $share_body_cnt.html(share_info.html_content);

            //保存和二维码
            //$(tmpl['head_tool_bar']()).insertBefore($('#_main_face_menu'));
            $('#ui-btn-down').hide();

            //需要对里面的图片宽度和高度做处理
            var $img = $share_body_cnt.find('img');
            if ($img[0]) {
                $.each($img, function(i, v) {
                    $(v)[0].onload = function() {
                        var new_size = util.fix_size($(v), {
                            "width": 580,
                            "height": 20000,
                            "padding": 10
                        });
                        $(v).attr('width', new_size['width']);
                        $(v).attr('height', new_size['height']);
                    };
                });
            }
        },

        /**
         * 图片外链正文内容初始化
         * @param share_info
         * @private
         */
        _render_outlink_pic: function(share_info) {
            var me = this,
                $body = me.get_$outlink_body();
            $body.removeClass('wrapper');

            $(tmpl['outlink_pic']()).appendTo($body);

            $(tmpl['head_tool_bar']()).insertBefore($('#_main_face_menu'));

            me._set_share_name(share_info.share_name);
            outlink.getPreviewImg();
        },

        /**
         * 危险信息显示
         * @param share_info
         * @private
         */
        _render_outlink_risk: function(share_info) {
            var html = '安全性:';
            switch (share_info.safe_type) {
                case 1:
                    html += '安全';
                    break;
                case 2:
                    html += '高风险';
                    break;
                case 3:
                    html += '中风险';
                    break;
                case 4:
                    html += '低风险';
                    break;
            }
            html += '<a href=\"web/detail_risk_web.html?' + share_info.data + '&' + outlink.share_pwd + '\" target=\"_blank\">了解详情</a>';
            $('#show_safe_type').append(html);
        },


        /**
         * 设置外链页面的名字
         * @param sharename
         */
        _set_share_name: function(sharename) {
            $('#outlink_title').text(util.format_file_name(sharename));
        },
        /**
         * 设置外链页面的名字
         * @param sharename
         */
        _set_file_name: function(sharename) {

            $('#outlink_share_name').text(util.format_file_name(sharename));
        },

        /**
         * 设置外链页面的名字
         * @param text
         */
        set_pwd_err_text: function(text) {
            if (!text) {
                $('#_password_cnt').removeClass('err').find('[data-id=tip]').text(text);
            } else {
                $('#_password_cnt').addClass('err').find('[data-id=tip]').text(text);
            }

        },
        /**
         * 标识验证码错误
         * @param text
         */
        set_verify_err_text: function(text) {
            if (!text) {
                $('#_verify_code_cnt').removeClass('err').find('[data-id=tip]').text(text);
            } else {
                $('#_verify_code_cnt').addClass('err').find('[data-id=tip]').text(text);
            }
        },

        set_fail_msg: function(msg, ret) {
            $('#outlink_fail_msg').text("msg:" + msg + "ret:" + ret);
        },

        /**
         * 设置下载次数
         * @param share_info
         */
        set_downloaod_times: function(share_info) {
            if (share_info.down_cnt > 0 || share_info.store_cnt > 0) {
                $("#show_download_times").text("使用次数:" + (share_info.down_cnt + share_info.store_cnt));
            }
        },
        get_$down_iframe: function() {
            return this._$down_iframe || (this._$down_iframe = $('<iframe name="batch_download" id="batch_download" style="display:none"></iframe>').appendTo(document.body));
        },
        /**
         * 事件绑定
         * @private
         */
        _initDownloadEvent: function(share_info) {

            var me = this,
                $parent,
                id,
                downloadName,
                fileInfo;
            var data = {
                share_key: share_info.share_key,
                file_list: [],
                dir_list: []
            };
            var $container = $('div.share-file-list'),
                $selected;
            $('.user-icon').mouseover(function() {
                $(this).css('cursor', 'pointer');
                return false;
            });
            $('.logo, .user-icon').click(function() {
                if(query_user.check_cookie() ) {
                    location.href = 'http://www.weiyun.com/disk/index.html';
                } else {
                    location.href = 'http://www.weiyun.com';
                }
                return false;
            });
            //点击登录
            $('#outlink_login').click(function(e) {
                outlink.to_login();
                return false;
            });
            //二维码按钮
            $('#ui-btn-qr').click(function(e) {
                $('div.full-mask').show();
                $('div.qr-code-dialog').show();
                return false;
            });
            $('.close-qr-code-dialog').click(function() {
                $('div.full-mask').hide();
                $('.qr-code-dialog').hide();
                return false;
            });
            $('.close-save-success-dialog').click(function() {
                $('div.full-mask').hide();
                $('.save-success-dialog').hide();
                return false;
            });
            //下载
            $('#ui-btn-down').on('click', function() {
                if(!query_user.check_cookie() ) {
                    $('#outlink_login').click();
                    return false;
                }
                data = {
                    share_key: share_info.share_key,
                    pdir_key: share_info.pdir_key,
                    pwd: share_info.pwd,
                    file_list: [],
                    dir_list: []
                };
                $selected = $container.find('.ui-selected');
                if (0 == $selected.length) {
                    return;
                }
                for (var i = 0, len = $selected.length; i < len; i++) {
                    id = $($selected[i]).attr('data-record-id');
                    fileInfo = allFileInfo[id];
                    if (0 === i) {
                        downloadName = fileInfo['name'];
                        if (len > 1) {
                            downloadName += ('等' + len + '个文件');
                        }
                        data.pack_name = downloadName;
                    }
                    if ('file' == fileInfo.flag) {
                        data['file_list'].push({
                            file_id: fileInfo['file_id'],
                            pdir_key: fileInfo['pdir_key']
                        });
                    } else if ('dir' == fileInfo.flag) {
                        data['dir_list'].push({
                            dir_key: fileInfo['dir_key']
                        });
                    }
                }
                request.xhr_post({
                    url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                    cmd: 'WeiyunSharePartDownload',
                    use_proxy: true,
                    pb_v2: true,
                    body: data
                }).ok(function(msg, body) {
                    me.get_$down_iframe().attr('src', body.download_url);
                }).fail(function(msg) {
                    mini_tip.error(msg || '下载失败');
                });
            });

            //保存到微云
            $('#ui-btn-save').click(function() {
                if (!query_user.check_cookie()) {
                    $('#outlink_login').click();
                    return;
                }
                data = {
                    share_key: share_info.share_key,
                    src_pdir_key: share_info.pdir_key,
                    pwd: share_info.pwd,
                    file_list: [],
                    dir_list: []
                };
                $selected = $container.find('.ui-selected');
                if (0 == $selected.length) {
                    return;
                }
                for (var i = 0, len = $selected.length; i < len; i++) {
                    id = $($selected[i]).attr('data-record-id');
                    fileInfo = allFileInfo[id];
                    if ('file' == fileInfo.flag) {
                        data['file_list'].push({
                            file_id: fileInfo['file_id'],
                            pdir_key: fileInfo['pdir_key']
                        });
                    } else if ('dir' == fileInfo.flag) {
                        data['dir_list'].push({
                            dir_key: fileInfo['dir_key']
                        });
                    }
                }
                request.xhr_post({
                    url: 'http://web2.cgi.weiyun.com/outlink.fcg',
                    cmd: 'WeiyunSharePartSaveData',
                    use_proxy: true,
                    pb_v2: true,
                    body: data
                }).ok(function(msg, body) {
                    $('div.full-mask').show();
                    $('div.save-success-dialog').show();
                }).fail(function(msg) {
                    mini_tip.error(msg || '保存失败');
                });
                return false;
            });

        },
        /**
         * 初始化QRCODE
         * @param share_info
         */
        _init_qr_code: function(share_info) {
            //初始化二维码
            var qrcode_src = 'http://www.weiyun.com/php/phpqrcode/qrcode.php?data=http%3A%2F%2Fshare.weiyun.com/' +
                share_info.data + '&level=4&size=2';
            $('#out_link_qr_code_prew').attr('src', qrcode_src);
        },
        /**
         * 遮罩隐藏
         */
        mask_hide: function() {
            $(".full-mask").hide();
        },
        /**
         * 遮罩显示
         */
        mask_show: function() {
            $(".full-mask").show();
        },

        /**
         * 测速上报
         */
        speed_time_report: function(is_pic) {
	        //测速点上报
	        try {
		        var flag = '21254-1-18';
		        huatuo_speed.store_point(flag, 20, g_serv_taken);
		        huatuo_speed.store_point(flag, 21, g_css_time - g_start_time);
		        huatuo_speed.store_point(flag, 22, g_js_time -  g_start_time);
		        huatuo_speed.store_point(flag, 23, new Date() - g_start_time);
		        huatuo_speed.report(flag, true);
	        } catch (e) {

	        }
        },

        //显示下载的验证码框
        show_down_verifycode: function() {
            var me = this;
            //展示界面和验证码
            me.mask_show();
            me.get_$down_verifycode().show();
        },

        //关闭下载验证码框
        close_down_verifycode: function() {
            var me = this;
            me.mask_hide();
            me.get_$down_verifycode().hide();
        },

        update_down_verifycode: function() {
            this.$imgcode.attr('src', 'http://captcha.weiyun.com/getimage?aid=543009514&' + Math.random());
            this.outlink_down_verifycode.find('input').val('');
        },

        //获取下载验证码框
        get_$down_verifycode: function() {
            var me = this;
            if (me.outlink_down_verifycode) {
                me.update_down_verifycode();
                return me.outlink_down_verifycode;
            } else {
                me.outlink_down_verifycode = $(tmpl.outlink_down_verifycode()).appendTo($('body'));

                //绑定点击关闭事件
                me.outlink_down_verifycode.find('.pop-close').on('click', function(e) {
                    e.preventDefault();
                    me.close_down_verifycode();
                });

                //刷新验证码按钮事件
                var $imgcode = me.outlink_down_verifycode.find('.img-code');
                me.$imgcode = $imgcode;
                me.update_down_verifycode();
                me.outlink_down_verifycode.find('.refresh-code').on('click', function() {
                    me.update_down_verifycode();
                });

                //提交按钮&&输入框
                var $submit = me.outlink_down_verifycode.find('.submit'),
                    $input = me.outlink_down_verifycode.find('input'),
                    $errmsg = me.outlink_down_verifycode.find('.err');

                me.$down_errmsg = $errmsg;

                //绑定输入框事件
                $input.on('focus', function() {
                    $errmsg.hide();
                });
                $input.on('keyup', function() {
                    if ($.trim($input.val()).length == 4) {
                        $submit.removeClass('disabled');
                    } else {
                        $submit.addClass('disabled');
                    }
                });

                //绑定提交按钮事件
                $submit.on('click', function() {
                    var code = $.trim($input.val());
                    if (code.length == 4) {
                        outlink.down_file_by_verifycode(code);
                        me.close_down_verifycode();
                    } else {
                        $errmsg.text('请输入正确的验证码').show();
                    }
                });

                return me.outlink_down_verifycode;
            }
        },

        //提示下载的验证am出错
        show_down_verifycode_error: function() {
            var me = this;
            me.show_down_verifycode();
            me.$down_errmsg.text('验证码输入不正确，请重新输入。').show();
            me.update_down_verifycode();
        },
        //小概率事件，基本不发生
        show_down_sys_error: function() {
            alert('系统错误，请稍后再试。');
        }
    });

    return ui;
});