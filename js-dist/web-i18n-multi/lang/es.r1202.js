//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web-i18n-multi/lang/es.r1202",["$","lib"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//es/src/module/categories.js
//es/src/module/common.js
//es/src/module/disk.js
//es/src/module/doc_preview.js
//es/src/module/downloader.js
//es/src/module/indep_login.js
//es/src/module/indep_setting.js
//es/src/module/main.js
//es/src/module/photo.js
//es/src/module/recent.js
//es/src/module/recycle.js
//es/src/module/search.js
//es/src/module/share.js
//es/src/module/share_enter.js
//es/src/module/upload.js
//es/src/pack.js

//js file list:
//es/src/module/categories.js
//es/src/module/common.js
//es/src/module/disk.js
//es/src/module/doc_preview.js
//es/src/module/downloader.js
//es/src/module/indep_login.js
//es/src/module/indep_setting.js
//es/src/module/main.js
//es/src/module/photo.js
//es/src/module/recent.js
//es/src/module/recycle.js
//es/src/module/search.js
//es/src/module/share.js
//es/src/module/share_enter.js
//es/src/module/upload.js
//es/src/pack.js
/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-4
 * Time: 下午6:44
 * To change this template use File | Settings | File Templates.
 */
define.pack("./module.categories",[],function (require, exports, module) {
    var c = {};

    c['categories'] = {
        '删除':'Delete',
        '刷新':'Refresh',
        '查看所有文档':'All',
        '查看所有doc文档':'Documents',
        '查看所有excel表格':'Spreadsheets',
        '查看所有ppt':'Presentations',
        '查看所有pdf电子文档':'PDF',
        '全部':'All',
        '按时间排序':'Sort by time',
        '按A-Z顺序排序':'Sort A to Z',
        '请选择文件':'Please select a file',
        '更名成功':'Renamed',
        '更名失败':'Rename failed',
        '暂无文档':'No documents at the moment',
        '请点击左上角的“上传”按钮添加':'Click on the "Upload" button to add',
        '暂无视频':'No videos (yet)',
        '暂无音乐':'No sounds (yet)',
        '下载':'DownLoad',
        '重命名':'Rename',
        '分享':'Share',
        '正在加载':'Loading…'
    };
    return c;
});



/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-12-2
 * Time: 上午11:27
 * To change this template use File | Settings | File Templates.
 */
define.pack("./module.common",[],function (require, exports, module) {
    var c = {};

    c['common.file_object'] = {
        '文件夹名称不能为空，请重新命名': '文件夹名称不能为空，请重新命名',
        '文件夹名称不能包含以下字符之一 /\\:?*\"><|': '文件夹名称不能包含以下字符之一 /\\:?*\"><|',
        '文件夹名称过长，请重新命名': '文件夹名称过长，请重新命名',
        '文件名称不能为空，请重新命名': '文件名称不能为空，请重新命名',
        '文件名称不能包含以下字符之一 /\\:?*\"><|': '文件名称不能包含以下字符之一 /\\:?*\"><|',
        '文件名称过长，请重新命名': '文件名称过长，请重新命名'
    };

    c['common.widgets'] = {
        '确定':'OK',
        '取消':'Cancel',
        '关闭':'Close'
    };

    c['common.copy'] = {
        '微云':'Tencent Cloud',
        '微云网页版':'Tencent Cloud on Web'
    };

    c['common.constants'] = {
        "微信": "WeChat",
        "文字语音": "Text and Voice",
        "视频图片": "Videos and Pictures",
        "文章": "Articles",
        "腾讯新闻": "Tencent News",
        "图片": "Photo",
        "QQ邮箱": "QQ Mail"
    };

    c['common.request'] = {
        "网络错误, 请稍后再试": "Network error, please try again later",
        "服务器出现错误, 请稍后再试": "Server error, please try again later",
        "连接服务器超时, 请稍后再试": "Connection timeout, please try again"
    };

    c['common.ret_msgs'] = {
        '无效的请求命令字':'Invalid operation',
        '系统正在初始化，请稍后再试':'System initializing, please try again later',
        '存储系统繁忙，请稍后再试':'System busy, please try again later',
        '服务器繁忙，请稍后再试':'Server busy, please try again later',
        '创建用户失败':'User creation failed',
        '不存在该用户':'User doesn\'t exist',
        '无效的请求格式':'Invalid request format',
        '上传地址获取失败':'Unable to acquire upload address',
        '登录状态超时，请重新登录':'Login overtime, please try again',
        '父目录不存在':'Parent folder doesn\'t exist',
        '无效的目录信息':'Invalid folder information',
        '目录或文件数超过总限制':'Maximum number of files or folders exceeded',
        '单个文件大小超限':'Maximum file size exceeded',
        '签名已经超时，请重新验证独立密码':'Standalone password signature expired, please verify it again',
        '验证独立密码失败':'Unable to verify your standalone password',
        '设置独立密码失败':'Unable to setup your standalone password',
        '删除独立密码失败':'Unable to delete your standalone password',
        '失败次数过多，独立密码被锁，请稍后再试':'Too many failed attempts: password locked, try again later',
        '独立密码不能与QQ密码相同':'Cannot be identical to your QQ password',
        '该目录下已经存在同名文件':'A file with the same name exists in this folder',
        '该文件未完整上传，无法下载':'This file was partially uploaded, unable to download',
        '不能分享超过2G的文件':'Cannot share files larger than 2GB',
        '根据相关法律法规和政策，该文件禁止分享':'Unexpected error',
        '该目录下文件个数已达上限，请清理后再试':'This folder is full, please delete some files and retry',
        '网盘文件个数已达上限，请清理后再试':'No space available, please delete some files and retry',
        '部分文件或目录不存在，请刷新后再试':'Some files or folders are not available, please refresh and retry',
        '不能对不完整的文件进行该操作':'Cannot do this operation on an incomplete file',
        '不能对空文件进行该操作':'Cannot do this operation on an empty file',
        '该文件已加密，无法下载':'Encrypted file, unable to download',
        '参数无效':'Invalid parameter',
        '请求中缺少协议头':'Invalid request',
        '请求中缺少协议体':'Invalid request',
        '请求中缺少字段':'Empty request',
        '无效的命令':'Invalid command',
        '导入数据请求无效':'Data request invalid',
        '目录的ID长度无效':'Invalid folder ID length',
        '文件的SHA值长度无效':'Invalid SHA hash length',
        '文件的MD5值长度无效':'Invalid MD5 hash length',
        '文件的ID长度无效':'Invalid ID length',
        '返回数据过长导致内存不足':'Insufficient memory',
        '指针无效':'Invalid pointer',
        '时间格式无效':'Invalid time format',
        '输入字段类型无效':'Invalid data format',
        '无效的文件名':'Invalid filename',
        '文件已过期':'File already expired',
        '文件超过下载次数限制':'Download limit reached for this file',
        '收听官方微博失败':'Unable to follow',
        '用户未开通微博':'User doesn\'t have Weibo',
        '分享到微博失败':'Unable to share on Weibo',
        '内容中出现脏字、敏感信息':'Unexpected error',
        '用户限制禁止访问':'Access denied by the user',
        '内容超限':'Content limit exceeded',
        '帐号异常':'Unexpected account error',
        '请休息一下吧':'Why don\'t you take a rest?',
        '请勿重复发表微博':'Please don\'t post more than once',
        '身份验证失败':'Identity verification failed',
        '文件已被删除':'File already deleted',
        '文件已损坏':'Broken file',
        '访问超过频率限制':'Visits frequency limit exceeded',
        '服务器暂时不可用，请稍后再试':'Server temporary unavailable, please try again',
        '参数错误':'Wrong parameter',
        '服务器内部错误':'Internal server error',
        '网络错误':'Network error',
        '非法请求':'Request failed',
        '输入参数错误':'Parameter input error',
        '非法的用户号码':'Invalid account',
        'QQMail未激活':'QQMail is inactive',
        'skey验证不通过':'skey verification failed',
        '邮件被拦截':'Mail message blocked',
        '发送频率过高':'Sending frequency limit exceeded',
        '收件人总数超过限制':'Recipients limit exceeded',
        '邮件大小超过限制':'Mail size limit exceeded',
        '邮件发送失败':'Unable to send mail',
        '分组不存在':'Category doesn\'t exist',
        '不能删除默认分组':'Cannot delete default group',
        '分组名不能为空':'Category name cannot be empty',
        '分组名重复':'Category names cannot be identical',
        "网络错误，请稍后再试":"Network error, please try again later",

        "操作成功": "Done",
        "连接服务器超时, 请稍后再试": "Connection timeout, please try again",
        "出现未知错误": "Sorry! Unknown error",
        "目录不存在": "Folder doesn't exist",
        "文件不存在": "File doesn't exist",
        "目录已经存在": "Folder already exists",
        "文件已经存在": "File already exists",
        "剩余空间不足": "Not enough space available",

        'default_value': 'error'
    };
    return c;
});
/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-12-2
 * Time: 上午11:27
 * To change this template use File | Settings | File Templates.
 */
define.pack("./module.disk",[],function (require, exports, module) {
    var c = {};
    //disk\src\file_list\file_list
    c['disk.file_list'] = {//add in file
        "微信": "WeChat",
        "文字语音": "Message",
        "视频图片": "Media",
        "文章": "Article",
        "腾讯新闻": "Tencent News",
        "图片": "Photo",
        "QQ邮箱": "QQ Mail",
        "QQ离线文件": "QQ offline files",
        "微云": "Tencent Cloud",
        "微云相册": "Tencent Cloud Album"//
    };
    c['disk.file_list.dir_name'] = {//add in file
        "微信": "WeChat",
        "腾讯新闻": "Tencent News",
        "QQ邮箱": "QQ Mail",
        "QQ离线文件": "QQ offline files",
        "微云相册": "Tencent Cloud Album",
        "文字语音": "Sounds and Texts",
        "视频图片": "Videos",
        "文章": "Articles"
    };
    c['disk.date_time'] = {
        '上午': 'AM',
        '下午': 'PM',
        '昨天': 'Yesterday',
        '1月': 'Jan',
        '2月': 'Feb',
        '3月': 'Mar',
        '4月': 'Apr',
        '5月': 'May',
        '6月': 'Jun',
        '7月': 'Jul',
        '8月': 'Aug',
        '9月': 'Sep',
        '10月': 'Oct',
        '11月': 'Nov',
        '12月': 'Dec'
    };

    //---------------start------------
    c['disk.move'] = {//add in file
        "选择存储位置": "Select a storage location",
        "移动到": "Move To",
        "等{0}个文件": " and {0} other files",
        "另存为": "Save As",
        "文件已经在该文件夹下了": "File already in this folder",//
        "不能将文件移动到自身或其子文件夹下": "Cannot move this file to itself or a sub-folder",//

        "请选中要存放的目录": "Select destination folder",//
        "正在移动第{0}/{1}个文件": "Moving {0} of {1} files…",//如 "正在移动第1/10个文件"
        "文件移动成功": "File moved successfully",//
        "部分文件移动失败：": "Some files cannot be moved："//
    };

    c['disk.remove'] = {//add in file
        "删除文件": "Delete files",
        "删除成功": "Deleted",
        "文件夹":"Folders",
        "文件":"Files",
        "确定":"OK",
        "正在删除第{0}/{1}个文件": "Deleting {0} of {1} files",
        "确定删除这些文件吗？": "Do you want to delete these files?", //
        "确定删除这些文件夹吗？": "Do you want to delete these folders?",//
        "确定删除这个文件吗？": "Do you want to delete this file?",//
        "确定删除这个文件夹吗？": "Do you want to delete these folders?",//
        "等{0}个文件": "and {0} file(s)",//
        "等{0}个文件夹": "and {0} folder(s)",//
        "部分文件删除失败：": "Some files cannot be deleted：",//
        "正在删除": "Deleting…",//
        "文件删除失败：": "Delete failed："//
    };

    c['disk.menu'] = {//add in file
        "分享": "Share",
        "邮件分享": "Email sharing",
        "链接分享": "Link sharing",
        "重命名": "Rename",
        "删除": "Delete",
        "移动到": "Move To",
        "下载": "Download",
        "另存为": "Save As"
    };

    c['disk.offline'] = {//add in file
        "名称": "Name",
        "大小": "Size",
        "过期时间": "Timeout",//
        "来源": "Source",//
        "我知道了": "Ok",//
        "发给： ": "To： ",//
        "来自： ": "From： ",//
        "即将过期": "Almost expired",//
        "{0}天": "{0} day(s)",//
        "{0}个文件成功另存到微云，{1}个文件另存失败": "{0} file(s) saved in the cloud, {1} failed", // 如 "10个文件成功另存到微云，1个文件另存失败"
        "{0}个文件成功另存到微云": "{0} file(s) saved in the cloud", // 如 "10个文件成功另存到微云"
        "正在另存为{0}/{1}第个文件": "Saving {0} of {1} files in the cloud…",// 如： "正在另存为1/10第个文件"
        "暂无离线文件": "No offline files",//
        "QQ收发的离线文件，在这里查看": "View offline files received via QQ",//

        "确定删除{0}吗?": "Confirm deleting {0}?",//
        "确定删除{0}等文件吗?": "Confirm deleting {0} including files?",//
        "确定删除{0}等文件夹吗?": "Confirm deleting {0} including folder?",//
        "确认删除": "Confirm deleting",//
        "如果对方未接收，删除会导致对方接收失败": "If you delete, the recipient could likely incur in a receiving error"//
    };

    c['disk.rename'] = {//add in file
        "新建文件夹成功": "Folder created",
        "更名成功": "Renamed",
        "文件夹名有冲突，请重新命名": "Folder name conflict, please change and retry",//
        "文件名有冲突，请重新命名": "File name conflict, please change and retry",//
        "文件夹路径过深，请重新创建": "Path too deep, please try again"//
    };

    c['disk.share'] = {//add in file
        "复制成功": "Copied",
        "获取下载链接成功！": "Download URL ready!",//
        "复制链接": "Copy link",//
        "邮件分享暂不支持文件夹": "Email sharing of folders currently not supported",//
        "链接分享一次最多支持{0}个文件": "Each URL can be used to share up to {0} files",//
        "不能分享破损的文件": "Cannot share broken files",//
        "不能分享空文件": "Cannot share empty files",//
        "分享的文件应小于{0}": "Only files smaller than {0} can be shared", // 如 "分享的文件应小于2K"
        "您的浏览器不支持该功能": "Your browser doesn't support this function",//
        "{0}等{2}个文件夹": "{0} of {2} folder(s)",//
        "{0}等{1}个文件": "{0} of {1} file(s)",//
        "{0}等{1}个文件夹和{2}个文件": "{0} of {1} folders and {2} files"//
    };

    c['disk.tree'] = {//add in file
        "不能移动到{0}中": "Cannot move to {0}"//
    };

    c['disk.ui_normal_tmpl'] = {//add in file
        "文件夹":"Folders",
        "文件":"Files",
        "暂无文件": "No files at the moment",
        "请点击左上角的“上传”按钮添加": 'Click on the "Upload" button to add'
    };

    c['disk.ui_virtual'] = {//add in file  (正在载入...)
        "文件夹":"Folders",
        "文件":"Files",
        "下载":"Download",
        "删除成功": "Deleted",
        "文章": "Articles",
        "没有了": "Not available", // 空提示
        "点击收起": "Click to collapse",//
        "点击展开": "Click to unfold",//
        "您还没有安装flash播放器，请点击{0}这里{1}安装": "You haven't installed Flash, click {0} to install {1}", //
        "加载中...": "Loading...",
        "加载更多": "Load more",//
        "删除":"Delete",
        "来源":"Source",
        "消息": "Information",//
        "您还没有保存任何{0}内容": "You haven't saved any {0} content yet" //
    };


    c['disk.tbar'] = {//add in file
        "下载": "Download",
        "分享": "Share",
        "移动到": "Move To",
        "重命名": "Rename",
        "删除": "Delete",
        "新建文件夹": "New Folder",
        "刷新": "Refresh",//
        "另存为": "Save as",
        "请选择文件": "Please select files",
        "打包下载一次最多支持{0}个文件": "Each download can only include up to {0} files",//
        "不能下载破损的文件": "Cannot download broken files",//
        "部分文件不可下载": "Some files cannot be downloaded",//
        "链接分享一次最多支持{0}个文件": "Each URL can be used to share up to {0} files",//
        "不能分享破损的文件": "Cannot share an broken file",//
        "不能分享空的文件": "Cannot share an empty file",//
        "不能移动破损文件": "Cannot move a broken file",//
        "不能移动QQ硬盘目录": "Cannot move to a QQ Disk folder",//
        "部分文件不可移动": "Some files cannot be moved",//
        "只能对单个文件（夹）重命名": "Can only rename a single file or folder",//
        "不能对破损文件进行重命名": "Cannot rename a broken file",//
        "部分文件不可重命名": "Some files cannot be renamed",//
        "不能删除网络收藏夹目录": "Cannot delete favorites",//
        "不能删除QQ硬盘目录": "Cannot delete a QQ Disk folder",//
        "部分文件不可删除": "Some files cannot be deleted"//
    };

    c['disk.view_switch'] = {//add in file
        "隐藏目录树": "Hide directory tree",
        "查看目录树": "Display directory tree",
        "按时间排序": "Sort by time",
        "按字母顺序": "Sort alphabetically",
        "显示缩略图": "Display thumbnails"
    };

    return c;
});
/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-4
 * Time: 上午10:07
 * To change this template use File | Settings | File Templates.
 */
define.pack("./module.doc_preview",[],function (require, exports, module) {
    var c = {};
    //recent\src\recent.tmpl.html
    //未提供翻译
    c['doc_preview'] = {
        '文档较大，正在加载，请耐心等候':'Loading, this may take a while…',
        '文档正在加载中，请稍候':'Loading, please wait…',
        '附件预览时发生错误':'Preview error',
        '请':'Please',
        '重试':'Retry',
        '或': 'or',
        '文件夹':'Folder',
        '该文件夹为空。':'This folder is empty',
        '拉取数据时发生错误':'An error occurred while loading data',
        '该压缩包已经加密，无法预览':'Encrypted, cannot be previewed',
        '文件已损坏':'Broken file',
        '已加载':'Loaded',
        '正在加载中...':'Loading...',
        '压缩包大小超过{0}M，暂不支持预览':'Compressed file over {0}MB, cannot be previewed',
        '第{0}张':'Page {0}',
        '第{0}/{1}张':'Page {0}/{1}',
        '原图':'Original',
        '来源':'Source',
        '下载':'Download',
        '删除':'Delete',
        '上一张':'Previous',
        '下一张':'Next',
        '仍在加载中':'Still loading…',
        '文件':'File',
        //新增加的
        '请<a data-action="retry" href="#">重试</a>或直接<a data-action="down" href="#">下载</a>':'Please {<a data-action="retry" href="#">retry</a>} or <a data-action="download" href="#">download</a>',
        //'请{重试}或直接{下载}查看'
        '请直接{0}':'Please {0}',  //请直接{下载}
        '请<a data-action="down" href="#">下载</a>后查看':'Please <a data-action="down" href="#">download</a> to view', //请{下载}后查看
        '请<a data-action="retry" href="#">重试</a> 或直接 <a data-action="download" href="#">下载</a> 查看。':'Please {<a data-action="retry" href="#">retry</a>} or <a data-action="download" href="#">download</a> to view'
         //'请{重试}或直接{下载}查看'


    };
    return c;
});
/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-5
 * Time: 上午9:05
 * To change this template use File | Settings | File Templates.
 */
define.pack("./module.downloader",[],function (require, exports, module) {
    var c = {};

    c['downloader'] = {
        '提示':'Notification',
        '你的QQ版本暂不支持下载4G以上的文件':'Your version of QQ cannot download files larger than 4GB',
        '打包下载不能超过{0}个文件':'Cannot download more of {0} files at once',
        '正在获取下载地址':'Getting download address…'
    };

    c['wx_helper'] ={
        '点击展开':'Click to unfold',
        '帐号绑定成功':'Account linked',
        '帐号绑定失败':'Unable to link account',
        '删除失败，请稍后重试':'Unable to delete, try again',
        '登录态已经过期，请您重新在微信内输入"0"进行激活':'Login timeout, retry and enter "0" on WeChat',
        '暂时无法访问，请稍后重试':'Temporarily unavailable, try again later'
    };

    c['third_party_iframe'] = {
        '在加载中，请稍候':'Loading, please wait…'
    };

    c['photo_guide'] ={
        '我知道了':'Ok',
        '微云相册':'Tencent Cloud Album'
    }
    return c;
});






/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-3
 * Time: 上午10:18
 * To change this template use File | Settings | File Templates.
 */

define.pack("./module.indep_login",[],function (require, exports, module) {
    var c = {};
    c['indep_login'] = {
        '更换帐号': 'Switch account',
        '请输入您的独立密码': 'Please enter your independent password',
        '确定': 'OK',
        '请输入密码':'Please enter your password',
        '忘记密码': 'Forgot your password',
        '您输入的独立密码有误，请重新输入': 'The independent password you entered is incorrect. Please try again',
        '验证独立密码失败':'Verification failed',
        '刷新页面':"Please create a standalone password if you haven't",
        '验证独立密码过程中出现错误':'Verification process error',
        '如果您从未设置过独立密码，请尝试':'Login time out, please sign-in again',
        '您的会话已经超时，请重新登录微云':'Standalone password signature expired, please verify again',
        '独立密码签名已经超时，请重新验证':'Password incorrect, please try again',
        '失败次数过多，独立密码已被锁定，请稍后访问':'Too many failed attempts: password locked, try again later'
    };
    return c;
});
/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-3
 * Time: 上午10:18
 * To change this template use File | Settings | File Templates.
 */

define.pack("./module.indep_setting",[],function (require, exports, module) {
    var c = {};
    c['indep_setting'] = {
        '关闭': 'Close',
        '新设置密码': 'Set a new password',
        '更改密码': 'Change password',
        '删除密码': 'Delete password',
        '确定密码': 'Confirm password',
        '填写当前密码': 'Enter current password',
        '填写新密码': 'Enter new password',
        '确定新密码': 'Confirm new password',
        '输入密码': 'Enter password',
        '密码设置成功': 'Password set',
        '管理密码': 'Manage password',
        '独立密码已删除': 'Independent password has been deleted',
        '您输入的密码有误，请重新输入': 'The password you entered is incorrect. Please try again',
        '请输入密码': 'Please enter your password',
        '密码长度不能小于6个字符': 'Password cannot be less than 6 characters',
        '您两次输入的密码不一致，请重新输入': 'The two passwords you entered are inconsistent. Please try again',
        '新密码长度不能小于6个字符': 'The new password cannot be less than 6 characters',
        '两次输入的密码不一致': 'The two passwords you entered are inconsistent.',
        '填写您的密码':'Enter your password',
        '密码修改成功':'Password changed',
        '请输入原密码':'Enter your old password',
        '请输入新密码':'Enter a new password',
        '会话已超时，请重新登录后再尝试':'Login time out, please sign-in again',
        '独立密码签名已经超时，请重新验证':'Standalone password expired, please verify again',
        '当前密码输入有误，请重新输入':'Password incorrect, please try again',
        '新设置独立密码失败':'Password creation failed',
        '删除独立密码失败':'Password removal failed',
        '失败次数过多，独立密码已被锁定':'Too many failed attempts: password locked, try again later',
        '独立密码不能与QQ密码相同':'Cannot be identical to your QQ password',
        '新密码不能和原密码相同':'Cannot be identical to your old password',
        '您尚未设置独立密码，请刷新页面后尝试':'Cannot create your password? Please refresh and try again',
        '您修改密码的频率过快，请过12小时后尝试':'You can only change your password once every 12 hours',
        '您已设置了独立密码，请重新登录':'Standalone password set, now please login again'
    };
    return c;
});
/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-3
 * Time: 上午11:04
 * To change this template use File | Settings | File Templates.
 */
define.pack("./module.main",[],function (require, exports, module) {
    var c = {};
    c['main'] = {
        '已使用':'Used',
        '总容量':'Total',
        '独立密码':'Independent password',
        '（未开启）':'(not enabled)',
        '下载客户端':'Download client',
        '反馈':'Feedback',
        '退出':'Exit',
        '搜索全部文件':'Search all files',
        '确定':'OK',
        //新增加的
        '微云Android版':'Android',
        '微云iPad版':'iPad',
        '微云iPhone版':'iPhone',
        '微云手机版':'Mobile',
        '手机号码输入有误，请重新输入。':'Invalid number, please try again.',
        '发送速率过快，请稍后再发,您还可以通过右侧二维码的方式快速安装微云。':'You are sending requests too often: retry after a while or scan the QR code to install.',
        '网络繁忙，暂不能发送短信，请稍后再试。建议您通过右侧二维码的方式快速安装微云。':'Cannot send SMS, please try again or scan the QR code to install.',
        '使用iPad扫描以下二维码即可安装。':'Scan the QR code below to install',
        '使用手机上的二维码扫描软件拍摄以下二维码即可立即下载。':'Scan the QR code below with your mobile to install.',
        '方法二：二维码获取':'Method 2: scan QR code to install',
        '方法三：二维码获取':'Method 3: scan QR code to install',
        '安装android版':'Install Android version',
        '安装iphone版':'Install iPhone version',
        '安装ipad版':'Install iPad version',
        '方法一：短信获取下载地址':'Method 1: receive download link via SMS',
        '请填写手机号，下载地址将发送到您的手机上。':'Enter a mobile number to receive an SMS with the download link',
        '请输入手机号码':'Mobile number',
        '发送短信':'Send SMS',
        '您输入的电话号码有误，请重新输入。':'Invalid number, please try again',
        '您将收到一条包含微云下载地址的短信，点击短信中的地址即可开始下载。':'SMS sent, open the included link to download',
        '完成':'Complete',
        '再次发送短信':'Send again',
        '方法二：下载安装包':'Method 2: download installation file',
        '点击开始下载':'Click to download',
        '方法二：前往App Store下载':'Method 2: download from App Store',
        '方法一：前往App Store下载':'Method 1: download from App Store',
        'android版':'Android',
        'iPhone版':'iPhone'



    };
    return c;
});
/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-5
 * Time: 上午9:57
 * To change this template use File | Settings | File Templates.
 */

define.pack("./module.photo",[],function (require, exports, module) {
    var c = {};
    c['photo'] = {
        '暂无图片':'Click on the "Upload" button to add',
        '刷新':'Refresh',
        '分享':'Share',
        '删除':'Delete',
        '下载':'Download',
        '返回':'Back',
        '删除分组':'Delete Category',
        '更改封面':'Change Cover',
        '重命名':'Rename',
        '时间轴':'Timeline',
        '分组':'Category',
        '全部':'All',
        '新建分组':'New Category',
        '打开':'Open',
        '请点击左上角的“上传”按钮添加':'Click on the "Upload" button to add',
        '此分组中无图片': 'No images in this category',
        '爱情':'Like',
        '{0}张':'{0} items',
        '请选择图片':'Select image',
        '一次最多只能修改100张图片':'You can modify up to 100 images at a time',
        '设置成功':'Done',
        '选定':'Select',
        '取消':'Cancel',
        '请选择分组':'Select category',
        '请选择不同的分组':'Select different categories',
        '更改分组成功':'Modified',
        '列表已更新':'List updated',
        '更改分组':'Modify category',
        '设置为封面':'Set as cover',
        '不能为空':'Cannot be empty',
        '过长':'Too longs',
        '不能含有特殊字符':'Special characters not allowed',
        '确定要删除这个分组吗？':'Do you really want to delete this category?',
        '删除成功':'Deleted',
        '组名':'Name',
        '修改成功':'Done',
        '创建成功':'Done',
        '排序成功':'Done',
        '删除图片':'Delete image',
        '确定要删除这些图片吗？':'Do you really want to delete these?',
        '确定要删除这张图片吗？':'Do you really want to delete this?',
        '删除失败':'Unable to delete'
    };
    return c;
});

/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-2
 * Time: 下午4:41
 * To change this template use File | Settings | File Templates.
 */
define.pack("./module.recent",[],function (require, exports, module) {
    var c = {};
    c['recent'] = {
        "今天": "Today",
        "昨天": "Yesterday",
        "最近7天": "Last 7 days",
        "7天前": "Over 7 days ago",
        '暂无文件':"No files at the moment",
        "正在加载":"Loading…",
        "加载完成":"Complete",
        "下载":"Download",
        '您可以通过“添加”上传文件':'Use "Add" to upload more files'
    };
    return c;
});
/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-4
 * Time: 上午9:01
 * To change this template use File | Settings | File Templates.
 */


define.pack("./module.recycle",[],function (require, exports, module) {
    var c = {};
    c['recycle'] = {
        '文件名':'Filename',
        '文件大小':'Size',
        '删除时间':'Deleted',
        '还原文件大小超过剩余容量':'Not enough space available to restore',
        '还原':'Restore',
        '部分文件还原失败：':'Unable to restore some files:',
        '正在还原第{0}/{1}个文件':'Restoring file {0}/{1}',
        '清空完成':'Emptied',
        '请选择文件':'Please select',
        '清空回收站':'Empty recycle bin',
        '确定清空回收站吗？':'Are you sure you want to empty the recycle bin?',
        '清空后将无法找回已删除的文件':'After emptying, there will be no way to restore your deleted files',
        '确定':'OK',
        '您的回收站内没有文件':'No files to recover (yet)',
        '刷新':'Refresh',
        '回收站不占用网盘空间，保留30天后将自动清除！':'The recycle bin will be emptied automatically after 30 days',
        '回收站为空':'The recycle bin is empty',
        '取消':'Cancel',
        '您可以在这里找回最近30天删除的文件':'Restore files deleted within the last 30 days',
        '成功还原{0}个文件夹':'Restored {0} folders',
        '成功还原{0}个文件':'Restored {0} files',
        '成功还原{0}个文件夹和{1}个文件':'Restored {0} folders and {1} files'


    };
    return c;
});

/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-4
 * Time: 下午4:15
 * To change this template use File | Settings | File Templates.
 */
define.pack("./module.search",[],function (require, exports, module) {
    var c = {};

    c['search'] = {
        '打开文件所在目录':'Open its folder',
        '分享':'Share',
        '删除':'Delete',
        '下载':'Download',
        '抱歉，未找到匹配文件':"Sorry, your search didn't match any document",
        '正在打开':'Opening…',
        '没有可显示的数据':'No data',
        '正在搜索...':'Searching…',
        '无结果':'No data',
        '搜索':'Searching…',
        '共{0}个':'Total {0} items'

    };
    return c;
})
;



/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-3
 * Time: 下午3:21
 * To change this template use File | Settings | File Templates.
 */

define.pack("./module.share",[],function (require, exports, module) {
    var c = {};

    // share/view.tmpl.html 和  share/view.js文件
    c['share'] = {
        '今天': 'Today',
        '昨天': 'Yestoday',
        '关闭':'Close',
        '取消分享': 'Cancel Shared Link',
        '创建访问密码': 'Create Access Password',
        '密码管理': 'Password Management',
        '复制分享链接': 'Copy Shared Link',
        '访问分享链接': 'Access Shared Link',
        '私密': 'Private',
        '公开': 'Public',
        '您确定取消全部分享吗？':'Are you sure you want to cancel sharing?',
        '您确定取消分享吗？':'Are you sure you want to cancel sharing?',
        '取消分享后，分享链接将被删除。':'After cancelling, the shared link will be deleted.',
        '已取消分享':'Sharing canceled',
        '是':'Yes',
        '否':'NO',
        '修改密码':'Change Password',
        '删除密码':'Delete Password',
        '请输入您要创建的密码：':'Please enter the new password:',
        '暂无分享':'No shared items at the moment',
        '名称':'Name',
        '状态':'Status',
        '分享时间':'Share Time',
        '浏览次数':'Views',
        '下载次数':'Downloads',
        '确定':'OK',
        '取消':'Cancel',
        '密码删除成功':'Password deleted',
        '链接复制成功':'Link copied',
        '创建密码':'Create password',
        '访问密码创建成功！':'Access password created',
        '复制链接和密码':'Copy Link and Password',
        '密码修改成功！':'change success!',
        '分享的链接':'Share link',
        '微云分享链接，不限下载次数，永久有效！':'Links to your Tencent Cloud shares are permanent',
        '刷新':'Refresh',
        '正在取消第{0}/{1}个分享链接':'Canceling {0} of {1} shared links…',
        '已失效': 'Canceled',      //状态
        '该文件已被删除，分享链接已失效': 'Link cancelled: it points to a deleted file',
        '复制成功，粘贴给您的朋友吧':'Copied to clipboard, now paste to share',
        '您的浏览器不支持该功能':"Your browser doesn't support this function",
        '链接': 'Link',
        '密码':'Password',
        '访问密码': 'Protect with password',
        '复制': 'Copy',
        '链接信息获取失败': 'Cannot acquire link information',
        '文件已被删除': 'File deleted',
        '正在加载': 'Loading',
        '请选择链接':'Please Select link',
        '部分分享链接取消失败':"Some links couldn't be canceled",
        '分享链接取消失败:':"Couldn't cancel link:",
        '{0}个公开分享':'{0} public share(s)',
        '{0}个私密分享':'{0} private share(s)'


    };
    return c;
})
;

/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-3
 * Time: 下午5:31
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-3
 * Time: 下午3:21
 * To change this template use File | Settings | File Templates.
 */

define.pack("./module.share_enter",[],function (require, exports, module) {
    var c = {};
    c['share_enter'] = {
        '输入收件人，多收件人中间用分号隔开':'Please enter recipients, using semicolons to separate them',
        '已创建链接':'Created link',
        '密码':'Password',
        '添加访问密码':'Add access password',
        '链接分享':'Link sharing',
        '邮件分享':'Email sharing',
        '发送内容：':'Content to be sent',
        '收件人：':'Recipients',
        '常用联系人':'Frequent contacts',
        '姓名':'Name',
        'Email地址':'Email Address',
        '复制链接发送给您的好友吧！':'Copy a link and send it to your friends!',
        '密码不足四位':'Password must be at least 4 characters',
        '收件人最多20个':'Maximum 20 recipients',
        '发送成功':'Sent',
        '不能分享破损的文件':'Cannot share broken file',
        '不能分享空文件':'Cannot share empty file',
        '分享的文件应小于{0}':'Files to share must be smaller than {0}',
        '分享一次最多支持{0}个文件':'You can share up to {0} files each time',
        '链接分享一次最多支持{0}个文件':'Links can be used to share up to {0} files',
        '【微云分享】':'【Tencent Cloud】',
        '请填写收件人':'Recipients',
        '复制链接成功':'Copied to clipboard',
        '复制链接失败':'Cannot copy to clipboard',
        '复制链接':'Copy link',
        '分享文件':'Share file',
        '发送':'Send',
        '分享':'Share',
        '链接':'Link',
        '复制链接和密码':'Copy Link and Password',
        '我通过微云给你分享了':'I used Tencent Cloud to share',
        '关闭':'Close',
        '有{0}个收件人邮箱不合法':'{0} invalid email recipients',
        'sharekey不合法':'Invalid sharekey',
        '分享：{0}等{1}个文件（夹）':'Share: {0} of {1} items',
        '{0}等{1}个文件（夹）':'{0} of {1} items',
        '取消加密':'Remove encryption'

    };
    return c;
})
;


/**
 * Created with JetBrains WebStorm.
 * User: yuyanghe
 * Date: 13-12-3
 * Time: 上午9:10
 * To change this template use File | Settings | File Templates.
 */
define.pack("./module.upload",[],function(require,exports,module){
    var c={};
    // upload/drag_upload_active.js
    c['upload']={
        '取消':'Cancel',
        '指定分组':'Specify category',
        '创建新分组':'Create category',
        '极速上传':'Instant Upload',
        '普通上传':'Normal Upload',
        '上传文件':'Upload files',
        '上传到：':'Upload to',
        '不支持上传文件夹到相册':'You cannot upload folders to albums',
        '您要上传的文件超过300M，请启用极速上传。':'The file you wish to upload is larger than 300M. Please enable Instant Upload.',
        '您的浏览器暂不支持上传300M以上的文件。':'Your browser does not support the upload of files larger than 300M at the moment.',
        '仅可上传图片文件':'You can only upload picture files',
        '启用极速上传，立即享受：':'Enable Instant Upload to enjoy:',
        '文件夹上传':'Folder uploads',
        '单文件最大32G':'Upload of single files up to 32G',
        '暂不支持上传整个盘符，请重新选择。':'Uploading entire drives is not supported at the moment. Please make another selection.',
        '正在传输：':'Transmitting:',
        '全部取消':'Cancel All',
        '完成':'Complete',
        '正在上传':'Uploading',
        '正在扫描:':'Scanning ',
        '暂停':'Pause',
        '提示':'Prompt',
        '暂时连接不上服务器，请重试':'Cannot connect to the server at the moment. Please try again',
        '未能连接服务器，请重试。':'Failed to connect to the server. Please try again.',
        //'未能连接服务器，请重试。{反馈}':'Failed to connect to the server. Please try again. {Feedback}',
        '获取源文件信息失败，请尝试重新上传':'Failed to obtain source file info. Please try to upload again',
        '上传出错，请重试。':'Upload error. Please try again',
        //'上传出错，请重试。{反馈}':'Upload error. Please try again. {Feedback}',
        '文件过大':'The file is too big',
        '容量不足，请删除一些旧文件后重试':'Insufficient capacity. Please delete some old files and try again',
        '文件大小为空':'The file is empty',
        '该目录下已存在同名文件':'This directory already has a file of the same name',
        '上传目录已被删除':'The upload directory has been deleted',
        '文件名包含特殊字符，请重命名后重传':'The file name contains special characters. Please rename it and upload again',
        '无效的字符':'Invalid characters',
        '系统繁忙(0),请稍后重试':'System busy (0). Please try again. Feedback',
        '名称':'Name',
        '大小':'Size',
        '目的地':'Destination',
        '状态':'Status',
        '操作':'Operation',
        '极速秒传':'Instant upload',
        '续传':'Resume',
        '文件大小超过4G，请升级控件完成上传。控件升级后，单文件大小上限将提升至32G。':'The file size exceeds 4G. Please upgrade the control to complete file upload. After upgrading the control, the size limit for single files will be increased to 32G.',
        '桌面':'Desktop',
        '未分组':'Uncategorized',
        '新建分组':'New category',
        '没有分组数据':'No category data',
        '创建':'New',
        '开始上传':'Upload',
        '目录所在层级过深，请上传至其他目录':'Directory level too deep, please upload to another folder',
        '文件夹创建失败(0)，无法上传':'Cannot create folder, unable to upload',
        '请安装极速上传控件，以启用“极速上传”。':'Please install the "Uploader" plugin for faster uploads', //install upload
        '上传提醒':'Upload notification',
        '微云':'Tencent Cloud',
        '网盘':'Online disk',
        '相册':'Album',
        '折叠':'Fold',
        '超大文件':'File is too large',
        '修改':'Modify',
        //'反馈':'Feedback',
        '系统繁忙':'System busy',
        '暂不支持上传4G以上的文件。':'Temporarily cannot upload files larger than 4GB',
        '当前浏览器单文件仅支持2G，您可以换用IE浏览器上传4G超大文件':'Please use Internet Explorer to upload files larger than 4GB',
        '秒传极速、断点续传':'',
        '文件超过4G，请改用浏览器上传。':'File larger than 4GB, please use another browser',
        '文件超过2G，请安装最新版本QQ。':'File larger than 2GB, please use the newest QQ version',
        '您要上传的文件超过300M，请安装最新版QQ。':'File larger than 300M, please use the newest QQ version',
        '您所选的文件超过32G，无法上传。':'Your selection is larger than 32GB, unable to upload',
        '容量不足，请参与送容量活动':'Not enough space, please delete some files and retry',
        '文件夹中文件夹总数超过{0}个，请分批上传。':'Folder contains over {0} files, please upload them separately',
        '文件夹{0}下文件总数超过{1}个，请管理后上传。':'The number of files in {0} has exceeded {1}. Please manage it and upload it again',
        '容量不足，请删除一些旧文件或升级空间':'Not enough space, please delete some files or upgrade',
        '全部重试':'Retry all',
        '{n}个上传任务已暂停':'{n} upload(s) suspended',
        '继续上传':'Resume',
        '传输':'Transfer',
        '未上传完成':'incomplete',
        '未上传和下载完成':'incomplete',
        '{0}个文件上传失败':'Couldn\'t upload {0} file(s)',
        '上传失败':'upload failed',
        '详情':'Details',
        '正在计算...':'Working…',
        '等待上传':'Awaiting upload',
        "下载失败":'Awaiting upload',
        '正在下载':'Downloading…',
        '关闭':'Close',
        '将文件拖拽至此区域':'Drag files to this area',
        '请将文件拖拽到此处':'Drag and drop files in here',
        '释放鼠标':'Release your click',
        '暂不支持文件夹拖拽上传！':'Cannot drag and drop a folder',
        '确定':'Ok',
        '删除':'Delete',
        '有{0}个文件上传失败':'{0} upload(s) failed', //特殊处理
        '文件':'File',
        '文件夹':'Folder',
        '4G以上':'More than 4GB',
        '微云网页版':'Tencent Cloud Web',
        '存储服务繁忙(0)':'Server busy (0)',
        '升级控件':'Upgrade',
        '重试':'Retry',
        '连接失败':'Link failed',
        '连接已丢失，请重新下载。':'Link failed',
        '正在获取文件夹信息':'Getting folder information…',
        '请升级控件以支持文件夹上传。':'Please upgrade to enable folder upload support',
        '当前的上传方式成功率较低，建议安装最新版的QQ，上传更稳定并支持查看进度。':'Please consider upgrading your QQ client for better performance and support',
        '立即安装':'Install now',
        '当前的上传方式成功率较低，建议安装 {name}控件，更稳定并支持查看进度。':'',//web的
        '文件名过长':'Filename too long',
        '目录创建失败(目录达到上限)，无法上传':'Unable to create folder (limit reached), cannot upload',
        '所选本地目录不允许下载文件，请选择其他位置。':'Cannot download to selected folders, please choose another location',
        '您的本地硬盘已满，请选择其他位置重新下载。':'Local disk is full, please choose another location',
        '下载失败，请重新下载。':'Download failed, please retry',
        '获取文件失败':'File transfer failed',
        '上传出错':'Upload error',
        '文件已被删除':'File already removed',
        '另一个程序正在使用此文件':'Another program is using this file',
        '文件上传过程中被修改，请重新上传':'Another program is using this file',
        '设备未就绪,上传失败':'Device not ready, upload failed',
        '文件或目录损坏，无法读取':'File or folder damaged, cannot be read',
        '网络链接失败，请检查网络':'Network connection problem',
        '网络文件不可读取，请检查网络':'Network connection problem',
        '文件没有访问权限':'Cannot access this file',
        '上传过程中文件被修改，请重新上传':'File changed during upload, please upload again',
        '上传过程中微云文件目录被删除':'File folder deleted during the upload process',
        '文件大小超过32G限制':'Cannot be larger than 32GB',
        '容量不足':'Insufficient space',
        '大小超过{2}G,请{升级控件}以完成上传:':'Please upgrade to complete uploads larger than {2}GB',
        '文件名为空，不支持上传':'Filename contains space, cannot be uploaded',
        '文件名不能包含以下字符之一 /\\:?*\"><|':'Filename cannot contain /\\:?*\"><|',
        '文件名过长，请重命名后重传':'Filename too long, please rename and retry',
        '该目录下文件过多，请选择其他目录':'Folder is full, please choose another',
        '文件过多':'Too many files',
        '登录超时':'Login timeout',
        '文件同名':'File with the same name',
        '相册还没初始化':'Album hasn\'t initialized',
        '请先访问相册再上传照片到相册':'Upload photos and add them to your album',
        '目录已被删除':'Folder already deleted',
        '微云文件过多':'Too many files on Tencent Cloud',
        '微云中文件过多，请删除一些旧文件后重试':'Free up some space on your Tencent Cloud and retry',
        '文件名不合法':'Invalid name',
        '文件超过300M，请<a target="_blank" href="http://im.qq.com/qq/">安装新版本QQ</a>后上传':'File over 300MB, <a target="_blank" href="http://www.imqq.com"> download a new version</a> of QQ and try again',
        '文件大小超过300M，请启用{极速上传}':'File over 300MB, please enable {极速上传}',
        '该文件超过4G暂不支持上传,请使用<a target="_blank" href="http://d.weiyun.com/">IE</a>上传':'This file is over 4GB and currently cannot be uploaded, <a target="_blank" href="http://d.weiyun.com/">visit this page</a> with Internet Explorer to upload it',
        '{n}个下载任务已暂停':'{n} download(s) suspended',
        '{n}个失败':'{n} failed',
        '传输失败':'Transfer failed',
        '失败：':'Failed:',
        '{n}个文件（夹）':'{n} items',
        '{n}个文件':'{n} files',
        '是':'Yes',
        '否':'No',

        '{ok}个文件（夹）传输成功':'{ok} items transferred',
        '{ok}个文件传输成功':'{ok} files transferred',
        '{ok}个文件（夹）传输成功,{er}个失败':'{ok} items transferred, {er} failed',
        '{ok}个文件输成功,{er}个失败':'{ok} files transferred, {er} failed',
        '{er}个文件（夹）传输失败':'{er} item transfers failed',
        '{er}个文件传输失败':'{er} file trnasfers failed',
        '剩余':'Remaining',
        '小时':'h',
        '分':'m',
        '秒':'s',

        '请安装{0}控件以支持上传到相册':'Please install {0} to enable uploads to album',
        '点击安装新版QQ启用极速上传，立即享受：<br>– 单文件最大32G <br>– 秒传极速、断点续传':'Click to install the latest QQ and enjoy faster transfers',
        '文件夹中文件总数超过{0}个，请分批上传。':'You have selected {0} files, please upload them separately',
        "等{0}张图片":"of {0} images",
        "等{0}个文件":"of {0} files",
        "列表中有{0}的文件，确定要取消吗？":"The list includes {0} files. Are you sure you want to continue?" ,
        '您有{0}的文件, 确定要关闭微云吗？':'You have {0} files, do you really want to quit?',
        '空文件夹':'Empty folder',
        '大小超过{size}请<a href="http://www.weiyun.com/plugin_install.html?from=ad" target="_blank">升级控件</a>以完成上传。':'Size over {size}, <a href="http://www.weiyun.com/plugin_install.html?from=ad" target="_blank">install this plugin</a> to complete the upload'
    };
    return c;

});
/**
 * Created with JetBrains WebStorm.
 * User: trumpli
 * Date: 13-12-2
 * Time: 上午11:24
 * To change this template use File | Settings | File Templates.
 */
define.pack("./pack",["$","lib","./module.common","./module.disk","./module.indep_login","./module.indep_setting","./module.main","./module.recent","./module.recycle","./module.search","./module.categories","./module.upload","./module.photo","./module.doc_preview","./module.share_enter","./module.share","./module.downloader"],function (require, exports, module) {
    var $ = require('$'),
        console = require('lib').get('./console'),
        pack = $.extend(
            {},
            require('./module.common'),
            require('./module.disk'),
            require('./module.indep_login'),
            require('./module.indep_setting'),
            require('./module.main'),
            require('./module.recent'),
            require('./module.recycle'),
            require('./module.search'),
            require('./module.categories'),
            require('./module.upload'),
            require('./module.photo'),
            require('./module.doc_preview'),
            require('./module.share_enter'),
            require('./module.share'),
            require('./module.downloader')
        );
    var _ = function (key, val) {
        //return !pack[key] ? val: ( pack[key][val] || pack[key]['default_value'] || val );
        var ret = !pack[key] ? val : ( pack[key][val] || pack[key]['default_value'] || val );
        if (ret === val) {
            console.debug('not found ', key, ' --> ', val);
        }
        return ret;
    };
    _.lang_id = 1033;
    return _;
});