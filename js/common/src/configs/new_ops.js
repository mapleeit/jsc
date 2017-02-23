/**
 * 命令字与OZ操作码映射表
 * @author jameszuo
 * @date 13-3-29
 */
define(function (require, exports, module) {

    var lib = require('lib'),

		console = lib.get('./console'),

		constants = require('./constants'),

    // 点击流统计, 增加一列表示appbox的值，第一列表示web，第二列表示appbox
		click_ops = {

			/************ 导航区（50000-50999）*******************/
			INDEP_PWD:                            [50002, 60002, '导航-独立密码'],
            RECHARGE_QZONE_VIP:                   [50102, 60102, '导航-开通黄钻'],
			LOGIN_OUT:                            [50006, 60006, '导航-退出'],
			HEADER_HELP:                          [50001, 60001, '导航-帮助'],
			HEADER_FANKUI:                        [50003, 60003, '导航-反馈'], //todo没有引用
			HEADER_GUANWANG:                      [50004, 60004, '导航-官网'],
			NAV_DISK:                             [50201, 60201, '左侧导航-网盘'],
			NAV_RECYCLE:                          [50202, 60202, '左侧导航-回收站'],
			NAV_PHOTO:                            [50205, 60205, '左侧导航-相册'],
			NAV_RECENT:                           [50203, 60203, '左侧导航-最近文件'],
			NAV_SHARE:                            [50206, 60206, '左侧导航-外链管理'],
            NAV_STATION:                          [50211, 60211, '左侧导航-中转站'],
			NAV_DOC:                              [50208, 60208, '左侧导航-文档'],
			NAV_VIDEO:                            [50209, 60209, '左侧导航-视频'],
			NAV_AUDIO:                            [50210, 60210, '左侧导航-音频'],
			NAV_OFFLINE:                          [50211, 60211, '左侧导航-离线文件'],
			NAV_DISK_REFRESH:                     [50221, 60221, '网盘-工具条-刷新'],
			NAV_SHARE_REFRESH:                    [50222, 60222, '导航-外链管理-刷新'],
			NAV_RECENT_REFRESH:                   [50204, 60204, '最近文件-刷新'],
			NAV_DOC_REFRESH:                      [50224, 60224, '文档-刷新'],
			NAV_VIDEO_REFRESH:                    [50226, 60226, '视频-刷新'],
			NAV_AUDIO_REFRESH:                    [50226, 60226, '音频-刷新'],
			NAV_ALBUM:                            [50207, 60207, '导航-图片'],
			NAV_ALBUM_REFRESH:                    [50223, 60223, '图片-刷新'],
            NAV_NOTE:                             [50228, 60228, '导航-笔记'],
			NAV_CLIPBOARD:                        [37304, 37304, '导航-剪贴板'], //todo还没有对应的appboxID

			/************ 头像 *******************/
			HEADER_USER_FACE_HOVER:               [50100, 60010, '头像菜单-鼠标移动至头像'],
			HEADER_USER_FACE_DOWNLOAD_CLIENT:     [50101, 60101, '头像菜单-下载客户端'],
			HEADER_USER_FACE_FEEDBACK:            [50003, 60003, '头像菜单-反馈'],


			/************ 工具条（52100-52199）*******************/
			TOOLBAR_UPLOAD:                       [52101, 62101, '网盘-工具条-上传按钮'],
			TOOLBAR_DOWNLOAD:                     [52102, 62102, '网盘-工具条-下载'],
			TOOLBAR_DOWNLOAD_BACK:                [52103, 62103, '网盘-工具条-下载-返回'],
			TOOLBAR_DOWNLOAD_OK:                  [52104, 62104, '网盘-工具条-下载-确定下载'],
			TOOLBAR_MANAGE:                       [52105, 62105, '网盘-工具条-管理'],
			TOOLBAR_MANAGE_MOVE:                  [52106, 62106, '网盘-工具条-管理-移动'],
			TOOLBAR_MANAGE_MOVE_BACK:             [52107, 62107, '网盘-工具条-管理-移动-返回'],
			TOOLBAR_MANAGE_MOVE_OK:               [52108, 62108, '网盘-工具条-管理-移动-点击移动'],
			TOOLBAR_MANAGE_MOVE_EXPAND_DIR:       [52109, 62109, '网盘-工具条-管理-移动-展开目录'],
			TOOLBAR_MANAGE_DELETE:                [52110, 62110, '网盘-工具条-管理-删除'],
			TOOLBAR_MANAGE_DELETE_BACK:           [52111, 62111, '网盘-工具条-管理-删除-返回'],
			TOOLBAR_MANAGE_DELETE_OK:             [52112, 62112, '网盘-工具条-管理-删除-确定删除'],
			TOOLBAR_MANAGE_MKDIR:                 [52113, 62113, '网盘-工具条-管理-新建文件夹'],
			TOOLBAR_RECYCLE:                      [52114, 62114, '网盘-工具条-回收站'],
			TOOLBAR_RECYCLE_BACK:                 [52115, 62115, '网盘-工具条-回收站-返回'],
			TOOLBAR_RECYCLE_RESTORE:              [57251, 67251, '网盘-工具条-回收站-还原'],
			TOOLBAR_RECYCLE_CLEAR:                [57252, 67252, '网盘-工具条-回收站-清空回收站'],


			/************ 面包屑区域（52200-52299）**************/
			DISK_BREAD_DIR:                       [52201, 62201, '网盘-面包屑-点击其他目录'],
			DISK_BREAD_WEIYUN:                    [52202, 62202, '网盘-面包屑-点击“微云”'],
			SWITCH_AZLIST_MODE:                   [52203, 62203, '网盘-查看模式-按a-z排序'],
			SWITCH_NEWESTLIST_MODE:               [52204, 62204, '网盘-查看模式-按时间排序'],
			SWITCH_NEWTHUMB_MODE:                 [52205, 62205, '网盘-查看模式-按缩略图'],

			/************ item 区（52300-52399）**************/
			ITEM_SHARE:                           [52300, 62300, '网盘-item-分享'],
			ITEM_RENAME:                          [52303, 62303, '网盘-item-文件夹重命名'],
			ITEM_DELETE:                          [52304, 62304, '网盘-item-删除（按钮）'],
			ITEM_MOVE:                            [52320, 62320, '网盘-item-移动按钮'],
			ITEM_DOWNLOAD:                        [52307, 62307, '网盘-item-下载（按钮）'],
			FILE_MENU_MORE:                       [52308, 62308, '网盘-item-更多'],
			MORE_MENU_LINK_SHARE:                 [52309, 62309, '网盘-item-更多-链接分享'],
			MORE_MENU_DELETE:                     [52310, 62310, '网盘-item-更多-删除'],
			MORE_MENU_MAIL_SHARE:                 [52311, 62311, '网盘-item-更多-邮件分享'],
			MORE_MENU_RENAME:                     [52312, 62312, '网盘-item-更多-重命名'],
			DISK_DRAG_RELEASE:                    [52313, 62313, '拖拽item后放手'],
			DISK_DRAG_DIR:                        [52314, 62314, '拖拽item到其他目录'],
			DISK_DRAG_BREAD:                      [52315, 62315, '拖拽item到面包屑'],
			DISK_DRAG_TO_TREE:                    [52316, 62316, '拖拽item到树'],

			/************ 右键（52400-52499）**************/
			RIGHTKEY_MENU:                        [52401, 62401, '网盘-右键-呼出右键'],
			RIGHTKEY_MENU_DOWNLOAD:               [52402, 62402, '网盘-右键-下载'],
			RIGHTKEY_MENU_MAIL_SHARE:             [52403, 62403, '网盘-右键-邮件分享'],
			RIGHTKEY_MENU_LINK_SHARE:             [52404, 62404, '网盘-右键-链接分享'],
			RIGHTKEY_MENU_MOVE:                   [52405, 62405, '网盘-右键-移动'],
			RIGHTKEY_MENU_RENAME:                 [52406, 62406, '网盘-右键-重命名'],
			RIGHTKEY_MENU_DELETE:                 [52407, 62407, '网盘-右键-删除'],
			RIGHTKEY_MENU_SHARE:                  [52408, 62408, '网盘-右键-分享'],


			/************ 上传下载框（52500-52599）**************/
			DISK_PLUGIN_INSTALL:                  [52501, 62501, '网盘-控件-“立即安装”'],
			DISK_PLUGIN_REINSTALL:                [52502, 62502, '网盘-控件-重新安装'],
			DISK_PLUGIN_INSTALLED:                [52503, 62503, '网盘-控件-点击“完成”'],
			DISK_UPLOAD_DONE:                     [52504, 62504, '网盘-上传-点击完成'],
			DISK_UPLOAD_SLIDE_UP:                 [52505, 62505, '网盘-上传-点击收起'],
			DISK_UPLOAD_PAUSE:                    [52506, 62506, '网盘-上传-点击暂停'],
			DISK_UPLOAD_CANCEL:                   [52507, 62507, '网盘-上传-点击取消(完全未上传)'],
			DISK_UPLOAD_CONTIUNE:                 [52508, 62508, '网盘-上传-点击续传'],
			DISK_UPLOAD_RESUME_CONTIUNE:          [52514, 62514, '网盘-上传-断点续传'],
			DISK_UPLOAD_HAS_DATA_CANCEL:          [52509, 62509, '网盘-上传-点击取消(有上传)'],
			UPLOAD_DOWN_BAR_CLOSE:                [52510, 62510, '网盘-下载-关闭APPBOX下载条'],
			UPLOAD_DOWN_BAR_OPEN_DIR:             [52511, 62511, '网盘-下载-点开APPBOX下载条的文件（打开文件所在目录）'],
			DISK_DRAG_UPLOAD:                     [52512, 62512, '拖拽上传'],
			DISK_DRAG_DOWNLOAD:                   [52513, 62513, '拖拽下载'],


			/************ 其他区（52600-52699）*******************/
			VRY_INDEP_PWD:                        [50401, 60401, '网盘 -输入并验证独立密码'],
			TO_TOP:                               [52602, 62602, '回到顶部'],
			BOX_SELECTION:                        [52603, 62603, '框选'],
			CLICK_WYSC_LINK:                      [59044, 69044, '微信目录跳转链接'],

			/************ 最近文件*********************************/
			RECENT_DOWNLOAD_BTN:                  [57001, 67001, '最近文件-下载按钮'],
			RECENT_CLICK_ITEM:                    [57002, 67002, '最近文件-item整条点击'],
			RECENT_LOAD_MORE:                     [57003, 67003, '最近文件-加载更多'],

			RECENT_CLEAR:                         [57004, 67004, '最近文件-清空记录'],
			RECENT_REFRESH:                       [57005, 67005, '最近文件-刷新'],
			/************ 图片预览 ********************************/
			IMAGE_PREVIEW_DOWNLOAD:               [52610, 62610, '图片预览 - 下载'],
			IMAGE_PREVIEW_REMOVE:                 [52611, 62611, '图片预览 - 删除'],
			IMAGE_PREVIEW_RAW:                    [52612, 62612, '图片预览-查看原图'],
			IMAGE_PREVIEW_NAV_PREV:               [52613, 62613, '图片预览-左翻页'],
			IMAGE_PREVIEW_NAV_NEXT:               [52614, 62614, '图片预览-右翻页'],
			IMAGE_PREVIEW_CLOSE:                  [52615, 62615, '图片预览-关闭'],

			IMAGE_PREVIEW_SHARE:                  [52617, 62617, '图片预览-分享'],
			IMAGE_PREVIEW_CODE:                   [52618, 62618, '图片预览-获取二维码'],
			IMAGE_PREVIEW_EXPANSION_UP:           [52619, 62619, '图片预览-缩略图列表-展开'],
			IMAGE_PREVIEW_EXPANSION_DOWN:         [52620, 62620, '图片预览-缩略图列表-收起'],
			IMAGE_PREVIEW_THUMB_NEXT:             [52621, 62621, '图片预览-缩略图列表-左翻页'],
			IMAGE_PREVIEW_THUMB_PREV:             [52622, 62622, '图片预览-缩略图列表-右翻页'],
			IMAGE_PREVIEW_THUMB_PICK:             [52623, 62623, '图片预览-缩略图列表-选中图片'],

			/************ 压缩包预览************************************/
			COMPRESS_DOWNLOAD:                    [52701, 62701, '下载压缩包内文件'],
			COMPRESS_PREV:                        [52702, 62702, '返回上一级'],
			COMPRESS_ENTER:                       [52703, 62703, '进入目录'],
			COMPRESS_CLOSE:                       [52704, 62704, '关闭'],

			/************ 点击item ********************************/
			ITEM_CLICK_DOWNLOAD:                  [52390, 62390, '网盘-item-点击item整条-下载'],
			ITEM_CLICK_DOC_PREVIEW:               [52391, 62391, '网盘-item-点击item整条-预览文档'],
			ITEM_CLICK_IMAGE_PREVIEW:             [52393, 62393, '网盘-item-点击item整条-预览图片'],
			ITEM_CLICK_ZIP_PREVIEW:               [52392, 62392, '网盘-item-点击item整条-预览压缩包'],
			ITEM_CLICK_LIST_CHECKBOX:             [52330, 62330, '网盘-item-checkbox-列表'],
			ITEM_CLICK_THUMB_CHECKBOX:            [52331, 62331, '网盘-item-checkbox-缩略图'],
			ITEM_CLICK_ENTER_DIR:                 [52394, 62394, '网盘-item-点击item整条-打开文件夹'],


			/****************** 上传管理 *************************/
			UPLOAD_SELECT_FILE:                   [52530, 62530, '上传主按钮'],
			UPLOAD_SELECT_PATH_CLOSE:             [52540, 62540, '新上传-关闭位置选择框'],
			UPLOAD_SELECT_PATH_MODIFY:            [52541, 62541, '新上传-“修改”文字链接'],
			UPLOAD_SELECT_PATH_OK:                [52542, 62542, '新上传-选择指定目录'],
			UPLOAD_SUBMIT_BTN_NORMAL:             [52543, 62543, '新上传-“普通上传”按钮'],
			UPLOAD_INSTALL_BTN_PLUGIN:            [52544, 62544, '新上传-“极速上传”按钮-触发安装'],
			UPLOAD_SUBMIT_BTN_PLUGIN:             [52805, 62805, '极速上传点击-位置选择框'],
			UPLOAD_FILE_MANAGER_OPEN:             [52545, 62545, '新上传-展开任务管理器'],
			UPLOAD_FILE_MANAGER_CLOSE:            [52546, 62546, '新上传-收起任务管理器'],
			UPLOAD_FILE_MANAGER_DONE:             [52547, 62547, '新上传-任务管理器-“完成”按钮'],
			UPLOAD_FILE_MANAGER_CANCEL:           [52548, 62548, '新上传-任务管理器-“全部取消/取消”按钮'],
			UPLOAD_FILE_MANAGER_PAUSE:            [52549, 62549, '新上传-任务管理器-“暂停”按钮'],
			UPLOAD_FILE_MANAGER_RESUME:           [52550, 62550, '新上传-任务管理器-“续传”按钮'],
			UPLOAD_FILE_MANAGER_CONTINUE:         [52551, 62551, '新上传-任务管理器-“重试”按钮'],
			UPLOAD_FILE_MANAGER_INSTALL:          [52553, 62553, '新上传-任务管理器-出错提示安装控件'],
			UPLOAD_FILE_MANAGER_OVER_LIMIT:       [52554, 62554, '新上传-单文件超过限制-”关闭“按钮'],
			UPLOAD_FILE_OVER_LIMIT_CLOSE:         [52554, 62554, '新上传-单文件超过限制-”关闭“按钮'],
			UPLOAD_FILE_OVER_LIMIT_INSTALL:       [52555, 62555, '新上传-单文件超过限制-”安装控件“按钮'],
			UPLOAD_FILE_MANAGER_ALL_RETRY:        [52556, 62556, '新上传-上传失败-”全部重试“按钮'],
			UPLOAD_BY_DRAG:                       [52640, 62640, '拖拽上传'],
			UPLOAD_UPLOAD_4G_FILE:                [52534, 62534, '上传-上传文件夹-超大文件'],
			UPLOAD_UPLOAD_4G_RESUME_UPLOAD:       [52540, 62540, '上传-跨登录续传-继续上传'],
			UPLOAD_UPLOAD_4G_TIPS_CONTINUE_IN:    [52550, 62550, '上传-4G以内框-“继续上传”'],
			UPLOAD_UPLOAD_4G_TIPS_RESELECT:       [52551, 62551, '上传-4G以内框-“重新选择”'],
			UPLOAD_UPLOAD_4G_TIPS_CONTINUE_OUT:   [52552, 62552, '上传-4G以外框-“继续上传”'],
			UPLOAD_UPLOAD_4G_PLUGIN_INSTALL:      [52830, 62830, '控件引导-4G以上-升级控件'],

			DOWNLOAD_FILE_MANAGER_PAUSE :         [52557, '下载-暂停'],

			/****************** 网盘新工具条 *************************/
			DISK_TBAR_ALL_CHECK:                  [52210, 62210, '网盘-面包屑-全选'],
			DISK_TBAR_DOWN:                       [52131, 62131, '网盘-工具条-下载'],
			DISK_TBAR_LINK_SHARE:                 [52132, 62132, '网盘-工具条-链接分享'],
			DISK_TBAR_MAIL_SHARE:                 [52133, 62133, '网盘-工具条-邮件分享'],
			DISK_TBAR_DEL:                        [52134, 62134, '网盘-工具条-删除'],
			DISK_TBAR_MOVE:                       [52135, 62135, '网盘-工具条-移动'],
			DISK_TBAR_RENAME:                     [52136, 62136, '网盘-工具条-重命名'],
			DISK_TBAR_SHARE:                      [52137, 62137, '网盘-工具条-分享'],

			/******************* 上传控件安装 **********************/
			PLUGIN_TIPS_INSTALL:                  [52800, 62800, 'tips引导安装控件按钮'],
			PLUGIN_POP_PANEL_INSTALL:             [52811, 62811, '功能性弹窗-“安装控件”'],
			PLUGIN_FLASH_LIMIT_INSTALL:           [52814, 62814, '上传任务中-flash限制-“安装控件”'],
			PLUGIN_ONLINE_ENTER:                  [52815, 62815, '在线安装页面-进入'],
			PLUGIN_ONLINE_REINSTALL:              [52816, 62816, '在线安装页面-重新下载/安装'],
			PLUGIN_DOWNLOAD_ENTER:                [52818, 62818, '下载安装页面-进入'],
			PLUGIN_DOWNLOAD_REINSTALL:            [52819, 62819, '下载安装页面-重新下载/安装'],

			PLUGIN_ONLINE_SUCCESS:                [52802, 62802, '在线安装页面-成功'],
			PLUGIN_DOWNLOAD_SUCCESS:              [52803, 62803, '下载安装页面-成功'],

			PLUGIN_POP_PANEL_SUCCESS:             [52820, 62820, '触发安装后弹窗-已安装成功'],
			PLUGIN_POP_PANEL_REINSTALL:           [52821, 62821, '触发安装后弹窗-重新安装'],
			PLUGIN_POP_PANEL_FAIL_REINSTALL:      [52822, 62822, '触发安装后弹窗-控件未安装成功-重新安装'],

			UPLOAD_UPLOAD_FILE:                   [52531, 62531, '上传-上传文件'],
			UPLOAD_UPLOAD_DIR:                    [52532, 62532, '上传-上传文件夹'],
            UPLOAD_NOTE:                          [52536, 62536, '添加-笔记'],
			UPLOAD_UPLOAD_DIR_NO_PLUGIN:          [52533, 62533, '上传-上传文件夹-未安装控件'],

			UPLOAD_SELECT_FOLDER_NO_FOLDER:       [52560, 62560, '新上传-选择文件夹-包含子目录'],
			UPLOAD_SELECT_FOLDER_HAS_FOLDER:      [52561, 62561, '新上传-选择文件夹-不包含子目录'],
			UPLOAD_FOLDER_ERROR_HOVER:            [52562, 62562, '新上传-选择文件夹-出错时hove详情'],

			/******************  Appbox添加微云到主面板引导页 *************************/
			ADD_WY_TO_APPBOX:                     [59002, 69002, '添加微云到主面板引导页'],//利用subop 1 现在添加 2已完成 3暂不添加 4重新添加 5 以后添加 6 确定  7 关闭按钮
			APPBOX_USER_ENV:                      [59020, 69020, '登录appbox的用户环境'],
			WEB_USER_ENV:                         [59023, 69023, '登录WEB的用户环境'],

			/******************  外链管理 *************** 6***************/
			SHARE_TBAR_CANCEL:                    [57400, 67400, '工具条-取消按钮'],
			SHARE_SELECT_ALL:                     [57410, 67410, '全选'],
			SHARE_HOVERBAR_VISIT:                 [57420, 67420, 'hoverBar-查看链接分享'],
			SHARE_HOVERBAR_COPY:                  [57421, 67421, 'hoverBar-复制链接'],
			SHARE_HOVERBAR_PWD_CHANGE:            [57422, 67422, 'hoverBar-修改密码'],
			SHARE_HOVERBAR_PWD_CREATE:            [57423, 67423, 'hoverBar-创建密码'],
			SHARE_HOVERBAR_CANCEL:                [57424, 67424, 'hoverBar-取消分享'],
			SHARE_ITEM_CLICK:                     [57500, 67500, '外链Item-点击-点击链接查看链接分享'],
			SHARE_ITEM_COPY:                      [57501, 67501, '外链Item-点击展开-复制按钮'],

			SHARE_LINK_TAB:                       [58002, 68002, '外链分享界面-链接分享页面'],
			SHARE_MAIL_TAB:                       [58003, 68003, '外链分享界面-邮件分享页面'],
			CANCEL_SHARE_PWD:                     [57505, 67505, '分享弹窗-取消加密'],
			ADD_SHARE_PWD:                        [57506, 67506, '分享弹窗-给分享链接加密'],
			SHARE_MGR_DELETE_CHECKBOX:            [57510, 67510, '外链密码管理界面-删除密码'],
			SHARE_MGR_CHANGE_CHECKBOX:            [57511, 67511, '外链密码管理界面-修改密码'],
			SHARE_CREATE_COPY_BUTTON:             [58012, 68012,'链接分享的复制按钮'],
			MAIL_SHARE_SEND_BUTTON:               [58013, 68013,'邮件分享的发送按钮'],
			SHARE_CREATE_CHANGE_PWD:              [57507, 67507,'文件分享界面的修改密码'],
			SHARE_MGR_PWD_OK_CREATE:              [57512, 67512,'密码管理界面-确定创建密码'],

			/******************* 搜索 **********************/
			SEARCH_CANCEL :                       [50501, 60501, '页面头部搜索框-点击清空'],
			SEARCH_LIST_CLICK :                   [50510, 60510, '搜索item-点击'],
			SEARCH_LIST_DOWNLOAD :                [50511, 60511, '搜索item-点击下载'],
			SEARCH_LIST_DELETE :                  [50512, 60512, '搜索item-点击删除'],
			SEARCH_LIST_SHARE :                   [50513, 60513, '搜索item-点击分享'],
			SEARCH_LIST_OPEN_FOLDER :             [50514, 60514, '搜索item-点击打开所属目录'],
			SEARCH_LIST_CONTEXT_MENU :            [50515, 60515, '搜索item-右键-弹出菜单'],

			// ==== 手动统计（如文档预览的加载时间等） ==========================================
			active_plugin:                        [9136, 9136, 'Acive控件上传'],
			webkit_plugin:                        [9136, 9136, 'Webkit控件上传'],
			upload_flash:                         [9137, 9137, 'flash上传'],
			upload_form:                          [9138, 9138, '表单上传'],
            upload_h5_flash:                      [9139, 9139, 'h5+flash上传'],
            upload_html5:                         [9140, 9140, 'html5上传'],
			upload_html5_pro:                     [9141, 9141, 'html5极速上传'],
			upload_from_QQClient:                 [20003, 20003, 'qq传文件上传到微云'],
			view_from_QQClient:                   [20005, 20005, 'qq传完文件后，点击“到微云中查看”'],
			download_hijack_check:                [405, 405, '下载劫持侦测'],
			webkit_donwload:                      [515, 515, 'Webkit下载'],

			/****************头部链接广告*********************/
			header_ad_link_web:                   [59000, 69000, 'web头部链接广告'],
			header_ad_link_appbox:                [59001, 69001, 'appbox头部链接广告'],
            HEADER_OUTER_AD_LIND:                 [59002, 69002, '外网头部广告链接'],
            HEADER_OUTER_AD_DOWNLOAD:             [59003, 69003, '外网头部下载入口'],

			/***************cgi因自动重试而成功****************/
			re_try_flag:                          [59001, 59001, 'CGI重试成功'], //todo未被使用

			/***************拖拽文件发送***********************/
			DRAG_FILE_SEND_TO_QQ:                 [59040, 69040, '拖拽到QQ好友'],
			DRAG_FILE_SEND_TO_QUN:                [59041, 69041, '拖拽到群'],
			DRAG_FILE_SEND_TO_GROUP:              [59042, 69042, '拖拽到讨论组'],
			DRAG_FILE_SEND_TO_TMP:                [59043, 69043, '拖拽到临时会话'],

			/************************离线文件*****************************************/
			OFFLINE_ITEM_CHECKALL:                [57600, 67600, '离线文件-item-全选'],
			OFFLINE_ITEM_CHECKBOX:                [57601, 67601, '离线文件-item-checkbox'],
			OFFLINE_ITEM_CLICK:                   [57602, 67602, '离线文件-item-点击整行'],
			OFFLINE_HOVERBAR_SAVEAS:              [57603, 67603, '离线文件-hovebar-另存为'],
			OFFLINE_HOVERBAR_DELETE:              [57604, 67604, '离线文件-hovebar-删除'],
			OFFLINE_HOVERBAR_DOWNLOAD:            [57605, 67605, '离线文件-hovebar-下载'],
			OFFLINE_TOOLBAR_DOWNLOAD:             [57611, 67611, '离线文件-工具栏-下载'],
			OFFLINE_TOOLBAR_DELETE:               [57612, 67612, '离线文件-工具栏-删除'],
			OFFLINE_TOOLBAR_SAVEAS:               [57613, 67613, '离线文件-工具栏-另存为'],
			OFFLINE_TOOLBAR_REFRESH:              [57614, 67614, '离线文件-工具栏-刷新'],
			OFFLINE_HAS_FILES:                    [57620, 67620, '列表中有文件'],
			OFFLINE_EMPTY_FILES:                  [57621, 67621, '列表中无文件'],

			/**************************双屏*****************************/
			DBVIEWTREE_ITEM_CLICK:                [52341, 62341, '目录树-点击item'],
			DBVIEWTREE_ITEM_DELTA_CLICK:          [52342, 62342, '目录树-点击item前三角形'],
			DBVIEWTREE_OPEN:                      [52150, 62150, '网盘-工具条-展开双屏'],
			DBVIEWTREE_CLOSE:                     [52151, 62151, '网盘-工具条-收起双屏'],
			DBVIEWTREE_ITEM_DROP:                 [52641, 62641, '双屏下拖拽到目录树'],

			/**************************引导安装客户端************************/
			GUIDE_INSTALL_ANDROID:                [59110, 69110, '引导安装android'],
			GUIDE_INSTALL_ANDROID_SEND_TO_PHONE:  [59111, 69111, '引导安装android-发送到手机-发送按钮'],
			GUIDE_INSTALL_ANDROID_SEND_BTN:       [59112, 69112, '引导安装android-发短信'],
			GUIDE_INSTALL_ANDROID_CLICK_DOWN:     [59113, 69113, '引导安装android-下载安装包'],
			GUIDE_INSTALL_IPHONE:                 [59120, 69120, '引导安装iPhone'],
			GUIDE_INSTALL_IPHONE_SEND_BTN:        [59121, 69121, '引导安装iPhone-发短信'],
			GUIDE_INSTALL_IPHONE_CLICK_DOWN:      [59122, 69122, '引导安装iPhone-前往appstore下载'],
			GUIDE_INSTALL_IPAD:                   [59130, 69130, '引导安装iPad'],
			GUIDE_INSTALL_IPAD_SEND_BTN:          [59131, 69131, '引导安装iPad-发短信'],
			GUIDE_INSTALL_IPAD_CLICK_DOWN:        [59132, 69132, '引导安装iPad-前往appstore下载'],

			/************************库分类（文档、视频、音频）************************/
			CATEGORY_DOC_FILTER_ALL:              [57700, 67700, '文档库-工具栏-筛选-全部'],
			CATEGORY_DOC_FILTER_DOC:              [57701, 67701, '文档库-工具栏-筛选-DOC'],
			CATEGORY_DOC_FILTER_XLS:              [57702, 67702, '文档库-工具栏-筛选-XLS'],
			CATEGORY_DOC_FILTER_PPT:              [57703, 67703, '文档库-工具栏-筛选-PPT'],
			CATEGORY_DOC_FILTER_PDF:              [57704, 67704, '文档库-工具栏-筛选-PDF'],
			CATEGORY_DOC_SORT_MTIME:              [57710, 67710, '文档库-工具栏-排序-时间'],
			CATEGORY_DOC_SORT_AZ:                 [57711, 67711, '文档库-工具栏-排序-AZ'],
			CATEGORY_DOC_HOVERBAR_DOWNLOAD:       [57720, 67720, '文档库-hoverbar-下载'],
			CATEGORY_DOC_HOVERBAR_SHARE:          [57721, 67721, '文档库-hoverbar-分享'],
			CATEGORY_DOC_HOVERBAR_RENAME:         [57722, 67722, '文档库-hoverbar-重命名'],
			CATEGORY_DOC_HOVERBAR_DELETE:         [57723, 67723, '文档库-hoverbar-删除'],
			CATEGORY_DOC_CONTEXTMENU_DOWNLOAD:    [57730, 67730, '文档库-右键-下载'],
			CATEGORY_DOC_CONTEXTMENU_SHARE:       [57731, 67731, '文档库-右键-分享'],
			CATEGORY_DOC_CONTEXTMENU_RENAME:      [57732, 67732, '文档库-右键-重命名'],
			CATEGORY_DOC_CONTEXTMENU_DELETE:      [57733, 67733, '文档库-右键-删除'],

			CATEGORY_VIDEO_SORT_MTIME:            [57810, 67810, '视频库-工具栏-排序-时间'],
			CATEGORY_VIDEO_SORT_AZ:               [57811, 67811, '视频库-工具栏-排序-AZ'],
			CATEGORY_VIDEO_HOVERBAR_DOWNLOAD:     [57820, 67820, '视频库-hoverbar-下载'],
			CATEGORY_VIDEO_HOVERBAR_SHARE:        [57821, 67821, '视频库-hoverbar-分享'],
			CATEGORY_VIDEO_HOVERBAR_RENAME:       [57822, 67822, '视频库-hoverbar-重命名'],
			CATEGORY_VIDEO_HOVERBAR_DELETE:       [57823, 67823, '视频库-hoverbar-删除'],
			CATEGORY_VIDEO_CONTEXTMENU_DOWNLOAD:  [57830, 67830, '视频库-右键-下载'],
			CATEGORY_VIDEO_CONTEXTMENU_SHARE:     [57831, 67831, '视频库-右键-分享'],
			CATEGORY_VIDEO_CONTEXTMENU_RENAME:    [57832, 67832, '视频库-右键-重命名'],
			CATEGORY_VIDEO_CONTEXTMENU_DELETE:    [57833, 67833, '视频库-右键-删除'],

			CATEGORY_AUDIO_SORT_MTIME:            [57910, 67910, '音乐库-工具栏-排序-时间'],
			CATEGORY_AUDIO_SORT_AZ:               [57911, 67911, '音乐库-工具栏-排序-AZ'],
			CATEGORY_AUDIO_HOVERBAR_DOWNLOAD:     [57920, 67920, '音乐库-hoverbar-下载'],
			CATEGORY_AUDIO_HOVERBAR_SHARE:        [57921, 67921, '音乐库-hoverbar-分享'],
			CATEGORY_AUDIO_HOVERBAR_RENAME:       [57922, 67922, '音乐库-hoverbar-重命名'],
			CATEGORY_AUDIO_HOVERBAR_DELETE:       [57923, 67923, '音乐库-hoverbar-删除'],
			CATEGORY_AUDIO_CONTEXTMENU_DOWNLOAD:  [57930, 67930, '音乐库-右键-下载'],
			CATEGORY_AUDIO_CONTEXTMENU_SHARE:     [57931, 67931, '音乐库-右键-分享'],
			CATEGORY_AUDIO_CONTEXTMENU_RENAME:    [57932, 67932, '音乐库-右键-重命名'],
			CATEGORY_AUDIO_CONTEXTMENU_DELETE:    [57933, 67933, '音乐库-右键-删除'],

			/************************PC客户端下载引导 *****************************/
			PC_GUIDE_DOWNLOAD_AD:                 [59141, 69141, '引导安装pc非同步盘-广告图'],
			PC_GUIDE_DOWNLOAD_CLOSE:              [59142, 69142, '引导安装pc非同步盘-关闭'],

			/*************************图片****************************************************/
			ALBUM_MODE_GROUP:                     [57729, 67729, '图片库-切换到分组'],
			ALBUM_MODE_TIME:                      [57730, 67730, '图片库-切换到时间轴'],
			ALBUM_MODE_ALL:                       [57732, 67732, '图片库-切换到全部'],
			ALBUM_GROUP_ENTER:                    [57733, 67733, '照片库-分组-进入分组'],
			ALBUM_GROUP_DRAG_SORT:                [57734, 67734, '照片库-分组-拖拽分组排序'],
			ALBUM_GROUP_HOVEBAR_RENAME:           [57735, 67735, '照片库-分组-hoveBar-重命名'],
			ALBUM_GROUP_HOVEBAR_DEL:              [57736, 67736, '照片库-分组-hoveBar-删除'],
			ALBUM_GROUP_HOVEBAR_SET_COVER:        [57737, 67737, '照片库-分组-hoveBar-更换封面'],
			ALBUM_GROUP_RIGHT_RENAME:             [57738, 67738, '照片库-分组-右键-重命名'],
			ALBUM_GROUP_RIGHT_DEL:                [57739, 67739, '照片库-分组-右键-删除'],
			ALBUM_GROUP_RIGHT_SET_COVER:          [57740, 67740, '照片库-分组-右键-更换封面'],
			ALBUM_GROUP_SET_COVER_CHOSE_PIC:      [57741, 67741, '照片库-分组-更改封面框-选择不同的照片'],
			ALBUM_GROUP_TOOL_NEW:                 [57742, 67742, '照片库-分组-工具栏-新建分组'],
			ALBUM_GROUP_TOOL_REFRESH:             [57743, 67743, '照片库-分组-工具栏-刷新'],
			ALBUM_GROUP_TOOL_CHANGE:              [57744, 67744, '照片库-分组-工具栏-更改分组'],
			ALBUM_GROUP_TOOL_DEL:                 [57745, 67745, '照片库-分组-工具栏-删除'],
			ALBUM_GROUP_DETAIL_RETURN:            [57746, 67746, '照片库-分组-返回'],
			ALBUM_GROUP_CLOSE_SHORTCUT:           [57747, 67747, '照片库-分组-收起快捷分组栏'],
			ALBUM_GROUP_OPEN_SHORTCUT:            [57748, 67748, '照片库-分组-展开快捷分组栏'],
			ALBUM_GROUP_CLICK_SHORTCUT:           [57749, 67749, '照片库-分组-点击快捷分组中的分组'],
			ALBUM_GROUP_DRAG_TO_SHORTCUT:         [57750, 67750, '照片库-分组-拖拽照片到快捷分组栏'],

			// 使用读屏软件
			USE_SCREEN_READER_APPBOX:             [59024, 69024, '通过读屏软件使用微云appbox'],
			USE_SCREEN_READER_WEB:                [59024, 69024, '通过读屏软件使用微云web'],
			/*************************文件二维码****************************************************/
			FILE_QRCODE_RECENT_ITEM:              [57006, 67006, '最近文件-获取二维码'],
			FILE_QRCODE_DISK_ITEM:                [52316, 62316, '网盘-item-获取二维码'],
			FILE_QRCODE_DISK_RIGHT:               [52409, 62409, '网盘-右键-获取二维码'],
			FILE_QRCODE_PHOTO_RIGHT:              [57751, 67751, '图片库-右键-获取二维码'],
			FILE_QRCODE_DOC_RIGHT:                [57734, 67734, '文档库-工具栏-右键-二维码'],
			FILE_QRCODE_DOC_ITEM:                 [57724, 67724, '文档库-item-二维码'],
			FILE_QRCODE_VIDEO_RIGHT:              [57834, 67834, '视频库-工具栏-右键-获取二维码'],
			FILE_QRCODE_VIDEO_ITEM:               [57824, 67824, '视频库-item-获取二维码'],
			FILE_QRCODE_AUDIO_RIGHT:              [57934, 67934, '音乐库-工具栏-右键-获取二维码'],
			FILE_QRCODE_AUDIO_ITEM:               [57924, 67924, '音乐库-item-获取二维码'],
			FILE_QRCODE_SEARCH_RIGHT:             [50516, 60516, '搜索-item-右键-获取二维码'],
			FILE_QRCODE_SEARCH_ITEM:              [50517, 60517, '搜索-item-获取二维码'],

			/***********************上传下载 数据统计常量设置************************************/
			UPLOAD_ACTIONTYPE_ID:                 [6, 6, '文件上传'],  //文件上传
			UPLOAD_PRE_SUBACTIONTYPE_ID:          [601, 601, '上传信令请求'],
			UPLOAD_PRE_THRACTIONTYPE_ID:          [6011, 6011, '文件预上传'],
			UPLOAD_TRANS_SUBACTIONTYPE_ID:        [651, 651, '上传数据'],
			UPLOAD_TRANS_NORMAL_THRACTIONTYPE_ID: [6512, 6512, '文件普通上传'],

			DOWNLOAD_ACTIONTYPE_ID:               [7, 7, '文件下载'],  //下载数据下载
			DOWNLOAD_PRE_SUBACTIONTYPE_ID:        [701, 701, '文件下载请求'],
			DOWNLOAD_PRE_THRACTIONTYPE_ID:        [7011, 7011, '文件下载请求'],
			DOWNLOAD_TRANS_SUBACTIONTYPE_ID:      [751, 751, '文件普通下载'],
			DOWNLOAD_TRANS_THRACTIONTYPE_ID:      [7511, 751, '文件普通下载'],

			/***********************剪贴板************************************/
			CLIPBOARD_SEND_TAB:                   [57301, 57301, '剪贴板-发送消息tab'],
			CLIPBOARD_SEND_SEND_BTN:              [57302, 57302, '剪贴板-发送消息-发送按钮'],
			CLIPBOARD_SEND_CLEAR_BTN:             [57303, 57303, '剪贴板-发送消息-清空按钮'],
			CLIPBOARD_TOAST_COPY_BTN:             [57305, 57305, '剪贴板-toast-复制按钮'],
			CLIPBOARD_RECEIVE_TAB:                [57307, 57307, '剪贴板-接收消息tab'],
			CLIPBOARD_RECEIVE_SHOW_DETAIL:        [57308, 57308, '剪贴板-接收消息列表-查看详情'],
			CLIPBOARD_RECEIVE_CONTEXTMENU_COPY:   [57309, 57309, '剪贴板-接收消息列表-右键-复制'],
			CLIPBOARD_RECEIVE_CONTEXTMENU_DELETE: [57310, 57310, '剪贴板-接收消息列表-右键-删除'],
			CLIPBOARD_RECEIVE_DETAIL_DELETE_BTN:  [57311, 57311, '剪贴板-消息详情-删除按钮'],
			CLIPBOARD_RECEIVE_DETAIL_COPY_BTN:    [57312, 57312, '剪贴板-消息详情-复制按钮'],
			CLIPBOARD_RECEIVE_DETAIL_BACK_BTN:    [57313, 57313, '剪贴板-消息详情-返回按钮'],
            /***********************笔记************************************/
            NOTE_CREATE:                          [58101,68101, '笔记-工具条-新建笔记'],
            NOTE_SHARE:                           [58102,68102, '笔记-工具条-分享'],
            NOTE_DELETE:                          [58103,68103, '笔记 -工具条-删除 '],
            NOTE_REFRESH:                         [58104,68104, '笔记-工具条-刷新'],
            NOTE_CREATE_RIGHT:                    [58119,68119, '笔记-右键-新建笔记'],
            NOTE_SHARE_RIGHT:                     [58120,68120, '笔记-右键-分享'],
            NOTE_DELETE_RIGHT:                    [58121,68121, '笔记-右键-删除'],
            
            /***********************HTTPS使用情况************************************/
            HTTPS_USE:                            [59507, 69507, '用户使用https访问微云']
		},

	// 点击流统计（以number为key，用于通过op数字查找key）
        ops_web_map = {
            /*
             * 9136: active_plugin,
             * 50006: LOGIN_OUT,
             * ...
             */
        },

        ops_appbox_map = {};


    for (var key in click_ops) {
        var cfg = click_ops[key];
        ops_web_map[cfg[0]] = key;
        ops_appbox_map[cfg[1]] = key;
    }


    return {

        /**
         * 获取统计的 op 码和名称
         * @param {String|Number} op_name
         * @return {{op: Number, name: String}}
         */
        get_op_config: function (op_name) {
            var cfg, key;
            if (typeof op_name === 'number') {
                key = (!constants.IS_APPBOX) ? ops_web_map[op_name] : ops_appbox_map[op_name];
                //如果还有key为空，说明是appbox中写死了id，这个时候重新获取下
                if(!key){
                	key = ops_web_map[op_name];
                }
            } else {
                key = op_name;
            }

            if (key && (cfg = click_ops[key])) {
            	if(!constants.IS_APPBOX){
            		return {
	            		key: key,
	                    op: cfg[0],
	                    name: cfg[2]
	            	};
	            }
            	else{
					return {
                    	key: key,
                    	op: cfg[1],
                    	name: cfg[2]
                    };
            	}
            }
        }

    };
});