//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web-i18n-multi/lang/zh.r20140120",["$","lib"],function(require,exports,module){

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
//zh/src/module/categories.js
//zh/src/module/common.js
//zh/src/module/disk.js
//zh/src/module/doc_preview.js
//zh/src/module/downloader.js
//zh/src/module/indep_login.js
//zh/src/module/indep_setting.js
//zh/src/module/main.js
//zh/src/module/photo.js
//zh/src/module/recent.js
//zh/src/module/recycle.js
//zh/src/module/search.js
//zh/src/module/share.js
//zh/src/module/share_enter.js
//zh/src/module/upload.js
//zh/src/pack.js

//js file list:
//zh/src/module/categories.js
//zh/src/module/common.js
//zh/src/module/disk.js
//zh/src/module/doc_preview.js
//zh/src/module/downloader.js
//zh/src/module/indep_login.js
//zh/src/module/indep_setting.js
//zh/src/module/main.js
//zh/src/module/photo.js
//zh/src/module/recent.js
//zh/src/module/recycle.js
//zh/src/module/search.js
//zh/src/module/share.js
//zh/src/module/share_enter.js
//zh/src/module/upload.js
//zh/src/pack.js
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
        '删除':'刪除',
        '刷新':'刷新',
        '查看所有文档':'查看所有文檔',
        '查看所有doc文档':'查看所有doc文檔',
        '查看所有excel表格':'查看所有excel表格',
        '查看所有ppt':'查看所有ppt',
        '查看所有pdf电子文档':'查看所有pdf電子文檔',
        '全部':'全部',
        '按时间排序':'按時間排序',
        '按A-Z顺序排序':'按A-Z順序排序',
        '请选择文件':'請選擇文件',
        '更名成功':'更名成功',
        '更名失败':'更名失敗',
        '暂无文档':'暫無文檔',
        '请点击左上角的“上传”按钮添加':'請點擊左上角的“上傳”按鈕添加',
        '暂无视频':'暫無視頻',
        '暂无音乐':'暫無音樂',
        '下载':'下載',
        '重命名':'重命名',
        '分享':'分享',
        '正在加载':'正在加載'
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
        '文件夹名称不能为空，请重新命名':'文件夾名稱不能爲空，請重新命名',
        '文件夹名称不能包含以下字符之一 /\\:?*\"><|':'文件夾名稱不能包含以下字符之一 /\\:?*\"><|',
        '文件夹名称过长，请重新命名':'文件夾名稱過長，請重新命名',
        '文件名称不能为空，请重新命名':'文件名稱不能爲空，請重新命名',
        '文件名称不能包含以下字符之一 /\\:?*\"><|':'文件名稱不能包含以下字符之一 /\\:?*\"><|',
        '文件名称过长，请重新命名':'文件名稱過長，請重新命名'
    };

    c['common.widgets'] = {
        '确定':'確定',
        '取消':'取消',
        '关闭':'關閉'
    };

    c['common.copy'] = {
        '微云':'微雲',
        '微云网页版':'微雲網頁版'
    };

    c['common.constants'] = {
        '微信':'微信',
        '文字语音':'文字語音',
        '视频图片':'視頻圖片',
        '文章':'文章',
        '腾讯新闻':'騰訊新聞',
        '图片':'圖片',
        'QQ邮箱':'QQ郵箱'
    };

    c['common.request'] = {
        '网络错误, 请稍后再试':'網絡錯誤, 請稍後再試',
        '服务器出现错误, 请稍后再试':'服務器出現錯誤, 請稍後再試',
        '连接服务器超时, 请稍后再试':'連接服務器超時, 請稍後再試'
    };

    c['common.ret_msgs'] = {
        '无效的请求命令字':'無效的請求命令字',
        '系统正在初始化，请稍后再试':'系統正在初始化，請稍後再試',
        '存储系统繁忙，请稍后再试':'存儲系統繁忙，請稍後再試',
        '服务器繁忙，请稍后再试':'服務器繁忙，請稍後再試',
        '创建用户失败':'創建用戶失敗',
        '不存在该用户':'不存在該用戶',
        '无效的请求格式':'無效的請求格式',
        '上传地址获取失败':'上傳地址獲取失敗',
        '登录状态超时，请重新登录':'登錄狀態超時，請重新登錄',
        '父目录不存在':'父目錄不存在',
        '无效的目录信息':'無效的目錄信息',
        '目录或文件数超过总限制':'目錄或文件數超過總限制',
        '单个文件大小超限':'單個文件大小超限',
        '签名已经超时，请重新验证独立密码':'簽名已經超時，請重新驗證獨立密碼',
        '验证独立密码失败':'驗證獨立密碼失敗',
        '设置独立密码失败':'設置獨立密碼失敗',
        '删除独立密码失败':'刪除獨立密碼失敗',
        '失败次数过多，独立密码被锁，请稍后再试':'失敗次數過多，獨立密碼被鎖，請稍後再試',
        '独立密码不能与QQ密码相同':'獨立密碼不能與QQ密碼相同',
        '该目录下已经存在同名文件':'該目錄下已經存在同名文件',
        '该文件未完整上传，无法下载':'該文件未完整上傳，無法下載',
        '不能分享超过2G的文件':'不能分享超過2G的文件',
        '根据相关法律法规和政策，该文件禁止分享':'根據相關法律法規和政策，該文件禁止分享',
        '该目录下文件个数已达上限，请清理后再试':'該目錄下文件個數已達上限，請清理後再試',
        '网盘文件个数已达上限，请清理后再试':'網盤文件個數已達上限，請清理後再試',
        '部分文件或目录不存在，请刷新后再试':'部分文件或目錄不存在，請刷新後再試',
        '不能对不完整的文件进行该操作':'不能對不完整的文件進行該操作',
        '不能对空文件进行该操作':'不能對空文件進行該操作',
        '该文件已加密，无法下载':'該文件已加密，無法下載',
        '参数无效':'參數無效',
        '请求中缺少协议头':'請求中缺少協議頭',
        '请求中缺少协议体':'請求中缺少協議體',
        '请求中缺少字段':'請求中缺少字段',
        '无效的命令':'無效的命令',
        '导入数据请求无效':'導入數據請求無效',
        '目录的ID长度无效':'目錄的ID長度無效',
        '文件的SHA值长度无效':'文件的SHA值長度無效',
        '文件的MD5值长度无效':'文件的MD5值長度無效',
        '文件的ID长度无效':'文件的ID長度無效',
        '返回数据过长导致内存不足':'返回數據過長導致內存不足',
        '指针无效':'指針無效',
        '时间格式无效':'時間格式無效',
        '输入字段类型无效':'輸入字段類型無效',
        '无效的文件名':'無效的文件名',
        '文件已过期':'文件已過期',
        '文件超过下载次数限制':'文件超過下載次數限制',
        '收听官方微博失败':'收聽官方微博失敗',
        '用户未开通微博':'用戶未開通微博',
        '分享到微博失败':'分享到微博失敗',
        '内容中出现脏字、敏感信息':'內容中出現髒字、敏感信息',
        '用户限制禁止访问':'用戶限制禁止訪問',
        '内容超限':'內容超限',
        '帐号异常':'帳號異常',
        '请休息一下吧':'請休息一下吧',
        '请勿重复发表微博':'請勿重複發表微博',
        '身份验证失败':'身份驗證失敗',
        '文件已被删除':'文件已被刪除',
        '文件已损坏':'文件已損壞',
        '访问超过频率限制':'訪問超過頻率限制',
        '服务器暂时不可用，请稍后再试':'服務器暫時不可用，請稍後再試',
        '参数错误':'參數錯誤',
        '服务器内部错误':'服務器內部錯誤',
        '网络错误':'網絡錯誤',
        '非法请求':'非法請求',
        '输入参数错误':'輸入參數錯誤',
        '非法的用户号码':'非法的用戶號碼',
        'QQMail未激活':'QQMail未激活',
        'skey验证不通过':'skey驗證不通過',
        '邮件被拦截':'郵件被攔截',
        '发送频率过高':'發送頻率過高',
        '收件人总数超过限制':'收件人總數超過限制',
        '邮件大小超过限制':'郵件大小超過限制',
        '邮件发送失败':'郵件發送失敗',
        '分组不存在':'分組不存在',
        '不能删除默认分组':'不能刪除默認分組',
        '分组名不能为空':'分組名不能爲空',
        '分组名重复':'分組名重複',
        '网络错误，请稍后再试':'網絡錯誤，請稍後再試',

        '操作成功':'操作成功',
        '连接服务器超时, 请稍后再试':'連接服務器超時, 請稍後再試',
        '出现未知错误':'出現未知錯誤',
        '目录不存在':'目錄不存在',
        '文件不存在':'文件不存在',
        '目录已经存在':'目錄已經存在',
        '文件已经存在':'文件已經存在',
        '剩余空间不足':'剩余空間不足',

        'default_value':'網絡繁忙'
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
        '微信':'微信',
        '文字语音':'文字語音',
        '视频图片':'視頻圖片',
        '文章':'文章',
        '腾讯新闻':'騰訊新聞',
        '图片':'圖片',
        'QQ邮箱':'QQ郵箱',
        'QQ离线文件':'QQ離線文件',
        '微云':'微雲',
        '微云相册':'微雲相冊'//
    };
    c['disk.file_list.dir_name'] = {//add in file
        '微信':'微信',
        '腾讯新闻':'騰訊新聞',
        'QQ邮箱':'QQ郵箱',
        'QQ离线文件':'QQ離線文件',
        '微云相册':'微雲相冊',
        '文字语音':'文字語音',
        '视频图片':'視頻圖片',
        '文章':'文章'
    };
    c['disk.date_time'] = {
        '上午':'上午',
        '下午':'下午',
        '昨天':'昨天',
        '1月':'1月',
        '2月':'2月',
        '3月':'3月',
        '4月':'4月',
        '5月':'5月',
        '6月':'6月',
        '7月':'7月',
        '8月':'8月',
        '9月':'9月',
        '10月':'10月',
        '11月':'11月',
        '12月':'12月'
    };

    //---------------start------------
    c['disk.move'] = {//add in file
        '选择存储位置':'選擇存儲位置',
        '移动到':'移動到',
        '等{0}个文件':'等{0}個文件',
        '另存为':'另存爲',
        '文件已经在该文件夹下了':'文件已經在該文件夾下了',//
        '不能将文件移动到自身或其子文件夹下':'不能將文件移動到自身或其子文件夾下',//

        '请选中要存放的目录':'請選中要存放的目錄',//
        '正在移动第{0}/{1}个文件':'正在移動第{0}/{1}個文件',
        '文件移动成功':'文件移動成功',//
        '部分文件移动失败：':'部分文件移動失敗：'//
    };

    c['disk.remove'] = {//add in file
        '删除文件':'刪除文件',
        '删除成功':'刪除成功',
        '文件夹':'文件夾',
        '文件':'文件',
        '确定':'確定',
        '正在删除第{0}/{1}个文件':'正在刪除第{0}/{1}個文件',
        '确定删除这些文件吗？':'確定刪除這些文件嗎？', //
        '确定删除这些文件夹吗？':'確定刪除這些文件夾嗎？',//
        '确定删除这个文件吗？':'確定刪除這個文件嗎？',//
        '确定删除这个文件夹吗？':'確定刪除這個文件夾嗎？',//
        '等{0}个文件':'等{0}個文件',//
        '等{0}个文件夹':'等{0}個文件夾',//
        '部分文件删除失败：':'部分文件刪除失敗：',//
        '正在删除':'正在刪除',//
        '文件删除失败：':'文件刪除失敗：'//
    };

    c['disk.menu'] = {//add in file
        '分享':'分享',
        '邮件分享':'郵件分享',
        '链接分享':'鏈接分享',
        '重命名':'重命名',
        '删除':'刪除',
        '移动到':'移動到',
        '下载':'下載',
        '另存为':'另存爲'
    };

    c['disk.offline'] = {//add in file
        '名称':'名稱',
        '大小':'大小',
        '过期时间':'過期時間',//
        '来源':'來源',//
        '我知道了':'我知道了',//
        '发给： ':'發給： ',//
        '来自： ':'來自： ',//
        '即将过期':'即將過期',//
        '{0}天':'{0}天',//
        '{0}个文件成功另存到微云，{1}个文件另存失败':'{0}個文件成功另存到微雲，{1}個文件另存失敗',
        '{0}个文件成功另存到微云':'{0}個文件成功另存到微雲',
        '正在另存为{0}/{1}第个文件':'正在另存爲{0}/{1}第個文件',
        '暂无离线文件':'暫無離線文件',//
        'QQ收发的离线文件，在这里查看':'QQ收發的離線文件，在這裏查看',//

        '确定删除{0}吗?':'確定刪除{0}嗎?',//
        '确定删除{0}等文件吗?':'確定刪除{0}等文件嗎?',//
        '确定删除{0}等文件夹吗?':'確定刪除{0}等文件夾嗎?',//
        '确认删除':'確認刪除',//
        '如果对方未接收，删除会导致对方接收失败':'如果對方未接收，刪除會導致對方接收失敗'//
    };

    c['disk.rename'] = {//add in file
        '新建文件夹成功':'新建文件夾成功',
        '更名成功':'更名成功',
        '文件夹名有冲突，请重新命名':'文件夾名有衝突，請重新命名',//
        '文件名有冲突，请重新命名':'文件名有衝突，請重新命名',//
        '文件夹路径过深，请重新创建':'文件夾路徑過深，請重新創建'//
    };

    c['disk.share'] = {//add in file
        '复制成功':'複制成功',
        '获取下载链接成功！':'獲取下載鏈接成功！',//
        '复制链接':'複制鏈接',//
        '邮件分享暂不支持文件夹':'郵件分享暫不支持文件夾',//
        '链接分享一次最多支持{0}个文件':'鏈接分享一次最多支持{0}個文件',//
        '不能分享破损的文件':'不能分享破損的文件',//
        '不能分享空文件':'不能分享空文件',//
        '分享的文件应小于{0}':'分享的文件應小于{0}',
        '您的浏览器不支持该功能':'您的浏覽器不支持該功能',//
        '{0}等{2}个文件夹':'{0}等{2}個文件夾',//
        '{0}等{1}个文件':'{0}等{1}個文件',//
        '{0}等{1}个文件夹和{2}个文件':'{0}等{1}個文件夾和{2}個文件'//
    };

    c['disk.tree'] = {//add in file
        '不能移动到{0}中':'不能移動到{0}中'//
    };

    c['disk.ui_normal_tmpl'] = {//add in file
        '文件夹':'文件夾',
        '文件':'文件',
        '暂无文件':'暫無文件',
        '请点击左上角的“上传”按钮添加':'請點擊左上角的“上傳”按鈕添加'
    };

    c['disk.ui_virtual'] = {//add in file  (正在载入...)
        '文件夹':'文件夾',
        '文件':'文件',
        '下载':'下載',
        '删除成功':'刪除成功',
        '文章':'文章',
        '没有了':'沒有了', // 空提示
        '点击收起':'點擊收起',//
        '点击展开':'點擊展開',//
        '您还没有安装flash播放器，请点击{0}这里{1}安装':'您還沒有安裝flash播放器，請點擊{0}這裏{1}安裝', //
        '加载中...':'加載中...',
        '加载更多':'加載更多',//
        '删除':'刪除',
        '来源':'來源',
        '消息':'消息',//
        '您还没有保存任何{0}内容':'您還沒有保存任何{0}內容' //
    };


    c['disk.tbar'] = {//add in file
        '下载':'下載',
        '分享':'分享',
        '移动到':'移動到',
        '重命名':'重命名',
        '删除':'刪除',
        '新建文件夹':'新建文件夾',
        '刷新':'刷新',//
        '另存为':'另存爲',
        '请选择文件':'請選擇文件',
        '打包下载一次最多支持{0}个文件':'打包下載一次最多支持{0}個文件',//
        '不能下载破损的文件':'不能下載破損的文件',//
        '部分文件不可下载':'部分文件不可下載',//
        '链接分享一次最多支持{0}个文件':'鏈接分享一次最多支持{0}個文件',//
        '不能分享破损的文件':'不能分享破損的文件',//
        '不能分享空的文件':'不能分享空的文件',//
        '不能移动破损文件':'不能移動破損文件',//
        '不能移动QQ硬盘目录':'不能移動QQ硬盤目錄',//
        '部分文件不可移动':'部分文件不可移動',//
        '只能对单个文件（夹）重命名':'只能對單個文件（夾）重命名',//
        '不能对破损文件进行重命名':'不能對破損文件進行重命名',//
        '部分文件不可重命名':'部分文件不可重命名',//
        '不能删除网络收藏夹目录':'不能刪除網絡收藏夾目錄',//
        '不能删除QQ硬盘目录':'不能刪除QQ硬盤目錄',//
        '部分文件不可删除':'部分文件不可刪除'//
    };

    c['disk.view_switch'] = {//add in file
        '隐藏目录树':'隱藏目錄樹',
        '查看目录树':'查看目錄樹',
        '按时间排序':'按時間排序',
        '按字母顺序':'按字母順序',
        '显示缩略图':'顯示縮略圖'
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
        '文档较大，正在加载，请耐心等候':'文檔較大，正在加載，請耐心等候',
        '文档正在加载中，请稍候':'文檔正在加載中，請稍候',
        '附件预览时发生错误':'附件預覽時發生錯誤',
        '请':'請',
        '重试':'重試',
        '或':'或',
        '文件夹':'文件夾',
        '该文件夹为空。':'該文件夾爲空。',
        '拉取数据时发生错误':'拉取數據時發生錯誤',
        '该压缩包已经加密，无法预览':'該壓縮包已經加密，無法預覽',
        '文件已损坏':'文件已損壞',
        '已加载':'已加載',
        '正在加载中...':'正在加載中...',
        '压缩包大小超过{0}M，暂不支持预览':'壓縮包大小超過{0}M，暫不支持預覽',
        '第{0}张':'第{0}張',
        '第{0}/{1}张':'第{0}/{1}張',
        '原图':'原圖',
        '来源':'來源',
        '下载':'下載',
        '删除':'刪除',
        '上一张':'上一張',
        '下一张':'下一張',
        '仍在加载中':'仍在加載中',
        '文件':'文件',
        //新增加的
        '请<a data-action="retry" href="#">重试</a>或直接<a data-action="down" href="#">下载</a>':'請<a data-action="retry" href="#">重試</a>或直接<a data-action="down" href="#">下載</a>',
        //'请{重试}或直接{下载}查看'
        '请直接{0}':'請直接{0}',  //請直接{下載}
        '请<a data-action="down" href="#">下载</a>后查看':'請<a data-action="down" href="#">下載</a>後查看', //請{下載}後查看
        '请<a data-action="retry" href="#">重试</a> 或直接 <a data-action="download" href="#">下载</a> 查看。':'請<a data-action="retry" href="#">重試</a> 或直接 <a data-action="download" href="#">下載</a> 查看。'
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
        '提示':'提示',
        '你的QQ版本暂不支持下载4G以上的文件':'你的QQ版本暫不支持下載4G以上的文件',
        '打包下载不能超过{0}个文件':'打包下載不能超過{0}個文件',
        '正在获取下载地址':'正在獲取下載地址'
    };

    c['wx_helper'] ={
        '点击展开':'點擊展開',
        '帐号绑定成功':'帳號綁定成功',
        '帐号绑定失败':'帳號綁定失敗',
        '删除失败，请稍后重试':'刪除失敗，請稍後重試',
        '登录态已经过期，请您重新在微信内输入"0"进行激活':'登錄態已經過期，請您重新在微信內輸入"0"進行激活',
        '暂时无法访问，请稍后重试':'暫時無法訪問，請稍後重試'
    };

    c['third_party_iframe'] = {
        '在加载中，请稍候':'在加載中，請稍候'
    };

    c['photo_guide'] ={
        '我知道了':'我知道了',
        '微云相册':'微雲相冊'
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
        '更换帐号':'更換帳號',
        '请输入您的独立密码':'請輸入您的獨立密碼',
        '确定':'確定',
        '忘记密码':'忘記密碼',
        '您输入的独立密码有误，请重新输入':'您輸入的獨立密碼有誤，請重新輸入',
        '验证独立密码失败':'驗證獨立密碼失敗',
        '刷新页面':'刷新頁面',
        '验证独立密码过程中出现错误':'驗證獨立密碼過程中出現錯誤',
        '如果您从未设置过独立密码，请尝试':'如果您從未設置過獨立密碼，請嘗試',
        '您的会话已经超时，请重新登录微云':'您的會話已經超時，請重新登錄微雲',
        '独立密码签名已经超时，请重新验证':'獨立密碼簽名已經超時，請重新驗證',
        '失败次数过多，独立密码已被锁定，请稍后访问':'失敗次數過多，獨立密碼已被鎖定，請稍後訪問'
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
        '关闭':'關閉',
        '新设置密码':'新設置密碼',
        '更改密码':'更改密碼',
        '删除密码':'刪除密碼',
        '确定密码':'確定密碼',
        '填写当前密码':'填寫當前密碼',
        '填写新密码':'填寫新密碼',
        '确定新密码':'確定新密碼',
        '输入密码':'輸入密碼',
        '密码设置成功':'密碼設置成功',
        '管理密码':'管理密碼',
        '独立密码已删除':'獨立密碼已刪除',
        '您输入的密码有误，请重新输入':'您輸入的密碼有誤，請重新輸入',
        '请输入密码':'請輸入密碼',
        '密码长度不能小于6个字符':'密碼長度不能小于6個字符',
        '您两次输入的密码不一致，请重新输入':'您兩次輸入的密碼不一致，請重新輸入',
        '新密码长度不能小于6个字符':'新密碼長度不能小于6個字符',
        '两次输入的密码不一致':'兩次輸入的密碼不一致',
        '填写您的密码':'填寫您的密碼',
        '密码修改成功':'密碼修改成功',
        '请输入原密码':'請輸入原密碼',
        '请输入新密码':'請輸入新密碼',
        '会话已超时，请重新登录后再尝试':'會話已超時，請重新登錄後再嘗試',
        '独立密码签名已经超时，请重新验证':'獨立密碼簽名已經超時，請重新驗證',
        '当前密码输入有误，请重新输入':'當前密碼輸入有誤，請重新輸入',
        '新设置独立密码失败':'新設置獨立密碼失敗',
        '删除独立密码失败':'刪除獨立密碼失敗',
        '失败次数过多，独立密码已被锁定':'失敗次數過多，獨立密碼已被鎖定',
        '独立密码不能与QQ密码相同':'獨立密碼不能與QQ密碼相同',
        '新密码不能和原密码相同':'新密碼不能和原密碼相同',
        '您尚未设置独立密码，请刷新页面后尝试':'您尚未設置獨立密碼，請刷新頁面後嘗試',
        '您修改密码的频率过快，请过12小时后尝试':'您修改密碼的頻率過快，請過12小時後嘗試',
        '您已设置了独立密码，请重新登录':'您已設置了獨立密碼，請重新登錄'
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
        '已使用':'已使用',
        '总容量':'總容量',
        '独立密码':'獨立密碼',
        '（未开启）':'（未開啓）',
        '下载客户端':'下載客戶端',
        '反馈':'反饋',
        '退出':'退出',
        '搜索全部文件':'搜索全部文件',
        '确定':'確定',
        //新增加的
        '微云Android版':'微雲Android版',
        '微云iPad版':'微雲iPad版',
        '微云iPhone版':'微雲iPhone版',
        '微云手机版':'微雲手機版',
        '手机号码输入有误，请重新输入。':'手機號碼輸入有誤，請重新輸入。',
        '发送速率过快，请稍后再发,您还可以通过右侧二维码的方式快速安装微云。':'發送速率過快，請稍後再發,您還可以通過右側二維碼的方式快速安裝微雲。',
        '网络繁忙，暂不能发送短信，请稍后再试。建议您通过右侧二维码的方式快速安装微云。':'網絡繁忙，暫不能發送短信，請稍後再試。建議您通過右側二維碼的方式快速安裝微雲。',
        '使用iPad扫描以下二维码即可安装。':'使用iPad掃描以下二維碼即可安裝。',
        '使用手机上的二维码扫描软件拍摄以下二维码即可立即下载。':'使用手機上的二維碼掃描軟件拍攝以下二維碼即可立即下載。',
        '方法二：二维码获取':'方法二：二維碼獲取',
        '方法三：二维码获取':'方法三：二維碼獲取',
        '安装android版':'安裝android版',
        '安装iphone版':'安裝iphone版',
        '安装ipad版':'安裝ipad版',
        '方法一：短信获取下载地址':'方法一：短信獲取下載地址',
        '请填写手机号，下载地址将发送到您的手机上。':'請填寫手機號，下載地址將發送到您的手機上。',
        '请输入手机号码':'請輸入手機號碼',
        '发送短信':'發送短信',
        '您输入的电话号码有误，请重新输入。':'您輸入的電話號碼有誤，請重新輸入。',
        '您将收到一条包含微云下载地址的短信，点击短信中的地址即可开始下载。':'您將收到一條包含微雲下載地址的短信，點擊短信中的地址即可開始下載。',
        '完成':'完成',
        '再次发送短信':'再次發送短信',
        '方法二：下载安装包':'方法二：下載安裝包',
        '点击开始下载':'點擊開始下載',
        '方法二：前往App Store下载':'方法二：前往App Store下載',
        '方法一：前往App Store下载':'方法一：前往App Store下載',
        'android版':'android版',
        'iPhone版':'iPhone版'



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
        '暂无图片':'暫無圖片',
        '刷新':'刷新',
        '分享':'分享',
        '删除':'刪除',
        '下载':'下載',
        '返回':'返回',
        '删除分组':'刪除分組',
        '更改封面':'更改封面',
        '重命名':'重命名',
        '时间轴':'時間軸',
        '分组':'分組',
        '全部':'全部',
        '新建分组':'新建分組',
        '打开':'打開',
        '请点击左上角的“上传”按钮添加':'請點擊左上角的“上傳”按鈕添加',
        '此分组中无图片':'此分組中無圖片',
        '爱情':'愛情',
        '{0}张':'{0}張',
        '请选择图片':'請選擇圖片',
        '一次最多只能修改100张图片':'一次最多只能修改100張圖片',
        '设置成功':'設置成功',
        '选定':'選定',
        '取消':'取消',
        '请选择分组':'請選擇分組',
        '请选择不同的分组':'請選擇不同的分組',
        '更改分组成功':'更改分組成功',
        '列表已更新':'列表已更新',
        '更改分组':'更改分組',        '设置为封面':'設置爲封面',
        '不能为空':'不能爲空',
        '过长':'過長',
        '不能含有特殊字符':'不能含有特殊字符',
        '确定要删除这个分组吗？':'確定要刪除這個分組嗎？',
        '删除成功':'刪除成功',
        '组名':'組名',
        '修改成功':'修改成功',
        '创建成功':'創建成功',
        '排序成功':'排序成功',
        '删除图片':'刪除圖片',
        '确定要删除这些图片吗？':'確定要刪除這些圖片嗎？',
        '确定要删除这张图片吗？':'確定要刪除這張圖片嗎？',
        '删除失败':'刪除失敗'
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
        '今天':'今天',
        '昨天':'昨天',
        '最近7天':'最近7天',
        '7天前':'7天前',
        '暂无文件':'暫無文件',
        '正在加载':'正在加載',
        '加载完成':'加載完成',
        '下载':'下載',
        '您可以通过“添加”上传文件':'您可以通過“添加”上傳文件'
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
        '文件名':'文件名',
        '文件大小':'文件大小',
        '删除时间':'刪除時間',
        '还原文件大小超过剩余容量':'還原文件大小超過剩余容量',
        '还原':'還原',
        '部分文件还原失败：':'部分文件還原失敗：',
        '正在还原第{0}/{1}个文件':'正在還原第{0}/{1}個文件',
        '清空完成':'清空完成',
        '请选择文件':'請選擇文件',
        '清空回收站':'清空回收站',
        '确定清空回收站吗？':'確定清空回收站嗎？',
        '清空后将无法找回已删除的文件':'清空後將無法找回已刪除的文件',
        '确定':'確定',
        '您的回收站内没有文件':'您的回收站內沒有文件',
        '刷新':'刷新',        '回收站不占用网盘空间，保留30天后将自动清除！':'回收站不占用網盤空間，保留30天後將自動清除！',
        '回收站为空':'回收站爲空',
        '取消':'取消',
        '您可以在这里找回最近30天删除的文件':'您可以在這裏找回最近30天刪除的文件',
        '成功还原{0}个文件夹':'成功還原{0}個文件夾',
        '成功还原{0}个文件':'成功還原{0}個文件',
        '成功还原{0}个文件夹和{1}个文件':'成功還原{0}個文件夾和{1}個文件'


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
        '打开文件所在目录':'打開文件所在目錄',
        '分享':'分享',
        '删除':'刪除',
        '下载':'下載',
        '抱歉，未找到匹配文件':'抱歉，未找到匹配文件',
        '正在打开':'正在打開',
        '没有可显示的数据':'沒有可顯示的數據',
        '正在搜索...':'正在搜索...',
        '无结果':'無結果',
        '搜索':'搜索',
        '共{0}个':'共{0}個'

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
        '今天':'今天',
        '昨天':'昨天',
        '关闭':'關閉',
        '取消分享':'取消分享',
        '创建访问密码':'創建訪問密碼',
        '密码管理':'密碼管理',
        '复制分享链接':'複制分享鏈接',
        '访问分享链接':'訪問分享鏈接',
        '私密':'私密',
        '公开':'公開',
        '您确定取消全部分享吗？':'您確定取消全部分享嗎？',
        '取消分享后，分享链接将被删除。':'取消分享後，分享鏈接將被刪除。',
        '已取消分享':'已取消分享',
        '是':'是',
        '否':'否',
        '修改密码':'修改密碼',
        '删除密码':'刪除密碼',
        '请输入您要创建的密码：':'請輸入您要創建的密碼：',
        '暂无分享':'暫無分享',
        '名称':'名稱',
        '状态':'狀態',
        '分享时间':'分享時間',
        '浏览次数':'浏覽次數',
        '下载次数':'下載次數',
        '确定':'確定',
        '取消':'取消',
        '密码删除成功':'密碼刪除成功',
        '链接复制成功':'鏈接複制成功',
        '创建密码':'創建密碼',
        '访问密码创建成功！':'訪問密碼創建成功！',
        '复制链接和密码':'複制鏈接和密碼',
        '密码修改成功！':'密碼修改成功！',
        '分享的链接':'分享的鏈接',
        '微云分享链接，不限下载次数，永久有效！':'微雲分享鏈接，不限下載次數，永久有效！',
        '刷新':'刷新',
        '正在取消第{0}/{1}个分享链接':'正在取消第{0}/{1}個分享鏈接',
        '已失效':'已失效',      //狀態
        '该文件已被删除，分享链接已失效':'該文件已被刪除，分享鏈接已失效',
        '复制成功，粘贴给您的朋友吧':'複制成功，粘貼給您的朋友吧',
        '您的浏览器不支持该功能':'您的浏覽器不支持該功能',
        '链接':'鏈接',
        '密码':'密碼',
        '访问密码':'訪問密碼',
        '复制':'複制',
        '链接信息获取失败':'鏈接信息獲取失敗',
        '文件已被删除':'文件已被刪除',
        '正在加载':'正在加載',
        '请选择链接':'請選擇鏈接',
        '部分分享链接取消失败':'部分分享鏈接取消失敗',
        '分享链接取消失败:':'分享鏈接取消失敗:',
        '{0}个公开分享':'{0}個公開分享',
        '{0}个私密分享':'{0}個私密分享'


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
        '输入收件人，多收件人中间用分号隔开':'輸入收件人，多收件人中間用分號隔開',
        '已创建链接':'已創建鏈接',
        '密码':'密碼',
        '添加访问密码':'添加訪問密碼',
        '链接分享':'鏈接分享',
        '邮件分享':'郵件分享',
        '发送内容：':'發送內容：',
        '收件人：':'收件人：',
        '常用联系人':'常用聯系人',
        '姓名':'姓名',
        'Email地址':'Email地址',
        '复制链接发送给您的好友吧！':'複制鏈接發送給您的好友吧！',
        '密码不足四位':'密碼不足四位',
        '收件人最多20个':'收件人最多20個',
        '发送成功':'發送成功',
        '不能分享破损的文件':'不能分享破損的文件',
        '不能分享空文件':'不能分享空文件',
        '分享的文件应小于{0}':'分享的文件應小于{0}',
        '分享一次最多支持{0}个文件':'分享一次最多支持{0}個文件',
        '链接分享一次最多支持{0}个文件':'鏈接分享一次最多支持{0}個文件',
        '【微云分享】':'【微雲分享】',
        '请填写收件人':'請填寫收件人',
        '复制链接成功':'複制鏈接成功',
        '复制链接失败':'複制鏈接失敗',
        '复制链接':'複制鏈接',
        '分享文件':'分享文件',
        '发送':'發送',
        '分享':'分享',
        '链接':'鏈接',
        '复制链接和密码':'複制鏈接和密碼',
        '我通过微云给你分享了':'我通過微雲給你分享了',
        '关闭':'關閉',
        '有{0}个收件人邮箱不合法':'有{0}個收件人郵箱不合法',
        'sharekey不合法':'sharekey不合法',
        '分享：{0}等{1}个文件（夹）':'分享：{0}等{1}個文件（夾）',
        '{0}等{1}个文件（夹）':'{0}等{1}個文件（夾）',
        '取消加密':'取消加密'

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
        '取消':'取消',
        '指定分组':'指定分組',
        '创建新分组':'創建新分組',
        '极速上传':'極速上傳',
        '普通上传':'普通上傳',
        '上传文件':'上傳文件',
        '上传到：':'上傳到：',
        '不支持上传文件夹到相册':'不支持上傳文件夾到相冊',
        '您要上传的文件超过300M，请启用极速上传。':'您要上傳的文件超過300M，請啓用極速上傳。',
        '您的浏览器暂不支持上传300M以上的文件。':'您的浏覽器暫不支持上傳300M以上的文件。',
        '仅可上传图片文件':'僅可上傳圖片文件',
        '启用极速上传，立即享受：':'啓用極速上傳，立即享受：',
        '文件夹上传':'文件夾上傳',
        '单文件最大32G':'單文件最大32G',
        '暂不支持上传整个盘符，请重新选择。':'暫不支持上傳整個盤符，請重新選擇。',
        '正在传输：':'正在傳輸：',
        '全部取消':'全部取消',
        '完成':'完成',
        '正在上传':'正在上傳',
        '正在扫描:':'正在掃描:',
        '暂停':'暫停',
        '提示':'提示',
        '暂时连接不上服务器，请重试':'暫時連接不上服務器，請重試',
        '未能连接服务器，请重试。':'未能連接服務器，請重試。',
        //'未能连接服务器，请重试。{反馈}':'未能連接服務器，請重試。{反饋}',
        '获取源文件信息失败，请尝试重新上传':'獲取源文件信息失敗，請嘗試重新上傳',
        '上传出错，请重试。':'上傳出錯，請重試。',
        //'上传出错，请重试。{反馈}':'上傳出錯，請重試。{反饋}',
        '文件过大':'文件過大',
        '容量不足，请删除一些旧文件后重试':'容量不足，請刪除一些舊文件後重試',
        '文件大小为空':'文件大小爲空',
        '该目录下已存在同名文件':'該目錄下已存在同名文件',
        '上传目录已被删除':'上傳目錄已被刪除',
        '文件名包含特殊字符，请重命名后重传':'文件名包含特殊字符，請重命名後重傳',
        '无效的字符':'無效的字符',
        '系统繁忙(0),请稍后重试':'系統繁忙(0),請稍後重試',
        '名称':'名稱',
        '大小':'大小',
        '目的地':'目的地',
        '状态':'狀態',
        '操作':'操作',
        '极速秒传':'極速秒傳',
        '续传':'續傳',
        '文件大小超过4G，请升级控件完成上传。控件升级后，单文件大小上限将提升至32G。':'文件大小超過4G，請升級控件完成上傳。控件升級後，單文件大小上限將提升至32G。',
        '桌面':'桌面',
        '未分组':'未分組',
        '新建分组':'新建分組',
        '没有分组数据':'沒有分組數據',
        '创建':'創建',
        '开始上传':'開始上傳',
        '目录所在层级过深，请上传至其他目录':'目錄所在層級過深，請上傳至其他目錄',
        '文件夹创建失败(0)，无法上传':'文件夾創建失敗(0)，無法上傳',
        '请安装极速上传控件，以启用“极速上传”。':'請安裝極速上傳控件，以啓用“極速上傳”。', //install upload
        '上传提醒':'上傳提醒',
        '微云':'微雲',
        '网盘':'網盤',
        '相册':'相冊',
        '折叠':'折疊',
        '超大文件':'超大文件',
        '修改':'修改',
        //'反馈':'反饋',
        '系统繁忙':'系統繁忙',
        '暂不支持上传4G以上的文件。':'暫不支持上傳4G以上的文件。',
        '当前浏览器单文件仅支持2G，您可以换用IE浏览器上传4G超大文件':'當前浏覽器單文件僅支持2G，您可以換用IE浏覽器上傳4G超大文件',
        '秒传极速、断点续传':'',
        '文件超过4G，请改用浏览器上传。':'文件超過4G，請改用浏覽器上傳。',
        '文件超过2G，请安装最新版本QQ。':'文件超過2G，請安裝最新版本QQ。',
        '您要上传的文件超过300M，请安装最新版QQ。':'您要上傳的文件超過300M，請安裝最新版QQ。',
        '您所选的文件超过32G，无法上传。':'您所選的文件超過32G，無法上傳。',
        '容量不足，请参与送容量活动':'容量不足，請參與送容量活動',
        '文件夹中文件夹总数超过{0}个，请分批上传。':'文件夾中文件夾總數超過{0}個，請分批上傳。',
        '文件夹{0}下文件总数超过{1}个，请管理后上传。':'文件夾{0}下文件總數超過{1}個，請管理後上傳。',
        '容量不足，请删除一些旧文件或升级空间':'容量不足，請刪除一些舊文件或升級空間',
        '全部重试':'全部重試',
        '{n}个上传任务已暂停':'{n}個上傳任務已暫停',
        '继续上传':'繼續上傳',
        '传输':'傳輸',
        '未上传完成':'未上傳完成',
        '未上传和下载完成':'未上傳和下載完成',
        '{0}个文件上传失败':'{0}個文件上傳失敗',
        '上传失败':'上傳失敗',
        '详情':'詳情',
        '正在计算...':'正在計算...',
        '等待上传':'等待上傳',
        '下载失败':'下載失敗',
        '正在下载':'正在下載',
        '关闭':'關閉',
        '将文件拖拽至此区域':'將文件拖拽至此區域',
        '请将文件拖拽到此处':'請將文件拖拽到此處',
        '释放鼠标':'釋放鼠標',
        '暂不支持文件夹拖拽上传！':'暫不支持文件夾拖拽上傳！',
        '确定':'確定',
        '删除':'刪除',
        '有{0}个文件上传失败':'有{0}個文件上傳失敗', //特殊處理
        '文件':'文件',
        '文件夹':'文件夾',
        '4G以上':'4G以上',
        '微云网页版':'微雲網頁版',
        '存储服务繁忙(0)':'存儲服務繁忙(0)',
        '升级控件':'升級控件',
        '重试':'重試',
        '连接失败':'連接失敗',
        '连接已丢失，请重新下载。':'連接已丟失，請重新下載。',
        '正在获取文件夹信息':'正在獲取文件夾信息',
        '请升级控件以支持文件夹上传。':'請升級控件以支持文件夾上傳。',
        '当前的上传方式成功率较低，建议安装最新版的QQ，上传更稳定并支持查看进度。':'當前的上傳方式成功率較低，建議安裝最新版的QQ，上傳更穩定並支持查看進度。',
        '立即安装':'立即安裝',
        '当前的上传方式成功率较低，建议安装 {name}控件，更稳定并支持查看进度。':'',//web的
        '文件名过长':'文件名過長',
        '目录创建失败(目录达到上限)，无法上传':'目錄創建失敗(目錄達到上限)，無法上傳',
        '所选本地目录不允许下载文件，请选择其他位置。':'所選本地目錄不允許下載文件，請選擇其他位置。',
        '您的本地硬盘已满，请选择其他位置重新下载。':'您的本地硬盤已滿，請選擇其他位置重新下載。',
        '下载失败，请重新下载。':'下載失敗，請重新下載。',
        '获取文件失败':'獲取文件失敗',
        '上传出错':'上傳出錯',
        '文件已被删除':'文件已被刪除',
        '另一个程序正在使用此文件':'另一個程序正在使用此文件',
        '文件上传过程中被修改，请重新上传':'文件上傳過程中被修改，請重新上傳',
        '设备未就绪,上传失败':'設備未就緒,上傳失敗',
        '文件或目录损坏，无法读取':'文件或目錄損壞，無法讀取',
        '网络链接失败，请检查网络':'網絡鏈接失敗，請檢查網絡',
        '网络文件不可读取，请检查网络':'網絡文件不可讀取，請檢查網絡',
        '文件没有访问权限':'文件沒有訪問權限',
        '上传过程中文件被修改，请重新上传':'上傳過程中文件被修改，請重新上傳',
        '上传过程中微云文件目录被删除':'上傳過程中微雲文件目錄被刪除',
        '文件大小超过32G限制':'文件大小超過32G限制',
        '容量不足':'容量不足',
        '大小超过{2}G,请{升级控件}以完成上传:':'大小超過{2}G,請{升級控件}以完成上傳:',
        '文件名为空，不支持上传':'文件名爲空，不支持上傳',
        '文件名不能包含以下字符之一 /\\:?*\"><|':'文件名不能包含以下字符之一 /\\:?*\"><|',
        '文件名过长，请重命名后重传':'文件名過長，請重命名後重傳',
        '该目录下文件过多，请选择其他目录':'該目錄下文件過多，請選擇其他目錄',
        '文件过多':'文件過多',
        '登录超时':'登錄超時',
        '文件同名':'文件同名',
        '相册还没初始化':'相冊還沒初始化',
        '请先访问相册再上传照片到相册':'請先訪問相冊再上傳照片到相冊',
        '目录已被删除':'目錄已被刪除',
        '微云文件过多':'微雲文件過多',
        '微云中文件过多，请删除一些旧文件后重试':'微雲中文件過多，請刪除一些舊文件後重試',
        '文件名不合法':'文件名不合法',
        '文件超过300M，请<a target="_blank" href="http://im.qq.com/qq/">安装新版本QQ</a>后上传':'文件超過300M，請<a target="_blank" href="http://im.qq.com/qq/">安裝新版本QQ</a>後上傳',
        '文件大小超过300M，请启用{极速上传}':'文件大小超過300M，請啓用{極速上傳}',
        '该文件超过4G暂不支持上传,请使用<a target="_blank" href="http://d.weiyun.com/">IE</a>上传':'該文件超過4G暫不支持上傳,請使用<a target="_blank" href="http://d.weiyun.com/">IE</a>上傳',
        '{n}个下载任务已暂停':'{n}個下載任務已暫停',
        '{n}个失败':'{n}個失敗',
        '传输失败':'傳輸失敗',
        '失败：':'失敗：',
        '{n}个文件（夹）':'{n}個文件（夾）',
        '{n}个文件':'{n}個文件',
        '是':'是',
        '否':'否',

        '{ok}个文件（夹）传输成功':'{ok}個文件（夾）傳輸成功',
        '{ok}个文件传输成功':'{ok}個文件傳輸成功',
        '{ok}个文件（夹）传输成功,{er}个失败':'{ok}個文件（夾）傳輸成功,{er}個失敗',
        '{ok}个文件输成功,{er}个失败':'{ok}個文件輸成功,{er}個失敗',
        '{er}个文件（夹）传输失败':'{er}個文件（夾）傳輸失敗',
        '{er}个文件传输失败':'{er}個文件傳輸失敗',
        '剩余':'剩余',
        '小时':'小時',
        '分':'分',
        '秒':'秒',

        '请安装{0}控件以支持上传到相册':'請安裝{0}控件以支持上傳到相冊',
        '点击安装新版QQ启用极速上传，立即享受：<br>– 单文件最大32G <br>– 秒传极速、断点续传':'點擊安裝新版QQ啓用極速上傳，立即享受：<br>– 單文件最大32G <br>– 秒傳極速、斷點續傳',
        '文件夹中文件总数超过{0}个，请分批上传。':'文件夾中文件總數超過{0}個，請分批上傳。',
        '等{0}张图片':'等{0}張圖片',
        '等{0}个文件':'等{0}個文件',
        '列表中有{0}的文件，确定要取消吗？':'列表中有{0}的文件，確定要取消嗎？' ,
        '您有{0}的文件, 确定要关闭微云吗？':'您有{0}的文件, 確定要關閉微雲嗎？',
        '空文件夹':'空文件夾',
        '大小超过{size}请<a href="http://www.weiyun.com/plugin_install.html?from=ad" target="_blank">升级控件</a>以完成上传。':'大小超過{size}請<a href="http://www.weiyun.com/plugin_install.html?from=ad" target="_blank">升級控件</a>以完成上傳。'
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