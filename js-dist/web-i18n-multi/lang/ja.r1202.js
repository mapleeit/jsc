//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web-i18n-multi/lang/ja.r1202",["$","lib"],function(require,exports,module){

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
//ja/src/module/categories.js
//ja/src/module/common.js
//ja/src/module/disk.js
//ja/src/module/doc_preview.js
//ja/src/module/downloader.js
//ja/src/module/indep_login.js
//ja/src/module/indep_setting.js
//ja/src/module/main.js
//ja/src/module/photo.js
//ja/src/module/recent.js
//ja/src/module/recycle.js
//ja/src/module/search.js
//ja/src/module/share.js
//ja/src/module/share_enter.js
//ja/src/module/upload.js
//ja/src/pack.js

//js file list:
//ja/src/module/categories.js
//ja/src/module/common.js
//ja/src/module/disk.js
//ja/src/module/doc_preview.js
//ja/src/module/downloader.js
//ja/src/module/indep_login.js
//ja/src/module/indep_setting.js
//ja/src/module/main.js
//ja/src/module/photo.js
//ja/src/module/recent.js
//ja/src/module/recycle.js
//ja/src/module/search.js
//ja/src/module/share.js
//ja/src/module/share_enter.js
//ja/src/module/upload.js
//ja/src/pack.js
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
        '删除':'削除',
        '刷新':'更新',
        '查看所有文档':'全て',
        '查看所有doc文档':'ドキュメント',
        '查看所有excel表格':'スプレッドシート',
        '查看所有ppt':'プレゼンテーション',
        '查看所有pdf电子文档':'PDF',
        '全部':'All',
        "按时间排序": "時間で並べ替え",
        '按A-Z顺序排序':'A～Z順に並べ替え',
        '请选择文件':'ファイルを選択してください',
        '更名成功':'名前変更済み',
        '更名失败':'名前の変更に失敗',
        '暂无文档':'現在、ドキュメントはありません',
        '请点击左上角的“上传”按钮添加':'[アップロード]ボタンをクリックして追加してください',
        '暂无视频':'ビデオはまだありません',
        '暂无音乐':'音はまだありません',
        '下载':'フォルダの',
        '重命名':'名前変更',
        '分享':'共有',
        '正在加载':'読み込み中…'
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
        '取消':'取り消し',
        '关闭':'閉じる'
    };

    c['common.copy'] = {
        '微云':'Tencentクラウド',
        '微云网页版':'TencentクラウドWeb'
    };

    c['common.constants'] = {
        "微信": "WeChat",
        "文字语音": "音とテキスト",
        "视频图片": "動画",
        "文章": "記事",
        "腾讯新闻": "Tencentニュース",
        "图片": "写真",
        "QQ邮箱": "QQ Mail"
    };

    c['common.request'] = {
        "网络错误, 请稍后再试": "ネットワークエラー。後でやり直してください",
        "服务器出现错误, 请稍后再试": "サーバーエラー。後でやり直してください",
        "连接服务器超时, 请稍后再试": "接続タイムアウト。後でやり直してください"
    };

    c['common.ret_msgs'] = {
        '无效的请求命令字':'無効な操作',
        '系统正在初始化，请稍后再试':'システム初期化中。後でやり直してください',
        '存储系统繁忙，请稍后再试':'システムビジー。後でやり直してください',
        '服务器繁忙，请稍后再试':'サーバーがビジー。やり直してください',
        '创建用户失败':'ユーザーの作成失敗',
        '不存在该用户':'ユーザーが存在しません',
        '无效的请求格式':'無効な要求形式',
        '上传地址获取失败':'アップロードエラー',
        '登录状态超时，请重新登录':'ログイン時間超過。やり直してください',
        '父目录不存在':'親フォルダが存在しません',
        '无效的目录信息':'無効なフォルダ情報',
        '目录或文件数超过总限制':'ファイルまたはフォルダの最大数を超過しました',
        '单个文件大小超限':'最大ファイルサイズを超過しました',
        '签名已经超时，请重新验证独立密码':'スタンドアロンパスワード署名の期限切れ。再確認してください',
        '验证独立密码失败':'スタンドアロンパスワードを確認できません',
        '设置独立密码失败':'スタンドアロンパスワードを設定できません',
        '删除独立密码失败':'スタンドアロンパスワードを削除できません',
        '失败次数过多，独立密码被锁，请稍后再试':'試行失敗回数の超過:パスワードがロックされました。後でやり直してください',
        '独立密码不能与QQ密码相同':'QQパスワードと同じにはできません',
        '该目录下已经存在同名文件':'同じ名前のファイルがこのフォルダに存在します',
        '该文件未完整上传，无法下载':'このファイルは一部アップロード済みです。ダウンロードできません',
        '不能分享超过2G的文件':'2GBを超えるファイルは共有できません',
        '根据相关法律法规和政策，该文件禁止分享':'予期しないエラー',
        '该目录下文件个数已达上限，请清理后再试':'このフォルダは一杯です。ファイルを一部削除して再試行してください',
        '网盘文件个数已达上限，请清理后再试':'容量不足です。ファイルを一部削除して再試行してください',
        '部分文件或目录不存在，请刷新后再试':'一部のファイル/フォルダが使用不可です。更新してやり直してください',
        '不能对不完整的文件进行该操作':'この操作は不完全なファイルで実行できません',
        '不能对空文件进行该操作':'この操作は空のファイルで実行できません',
        '该文件已加密，无法下载':'暗号化ファイルです。ダウンロードできません',
        '参数无效':'無効なパラメータ',
        '请求中缺少协议头':'無効なパラメータ',
        '请求中缺少协议体':'無効なパラメータ',
        '请求中缺少字段':'空の要求',
        '无效的命令':'無効なコマンド',
        '导入数据请求无效':'無効なデータ要求',
        '目录的ID长度无效':'無効なフォルダIDの長さ',
        '文件的SHA值长度无效':'無効なSHAハッシュの長さ',
        '文件的MD5值长度无效':'無効なMD5ハッシュの長さ',
        '文件的ID长度无效':'無効なIDの長さ',
        '返回数据过长导致内存不足':'メモリ不足',
        '指针无效':'無効なポインタ',
        '时间格式无效':'無効な時間形式',
        '输入字段类型无效':'無効なデータ形式',
        '无效的文件名':'無効なファイル名',
        '文件已过期':'ファイル期限切れ',
        '文件超过下载次数限制':'このファイルのダウンロード制限に達しました',
        '收听官方微博失败':'フォローできません',
        '用户未开通微博':'ユーザーにWeiboがありません',
        '分享到微博失败':'Weiboで共有できません',
        '内容中出现脏字、敏感信息':'予期しないエラー',
        '用户限制禁止访问':'ユーザーがアクセス拒否しました',
        '内容超限':'コンテンツの制限超過',
        '帐号异常':'予期しないアカウントエラー',
        '请休息一下吧':'休憩しませんか?',
        '请勿重复发表微博':'複数回投稿しないでください',
        '身份验证失败':'ID確認失敗',
        '文件已被删除':'ファイルは削除済みです',
        '文件已损坏':'壊れたファイル',
        '访问超过频率限制':'閲覧頻度の制限を超過しました',
        '服务器暂时不可用，请稍后再试':'サーバが一時的に使用不可です。やり直してください',
        '参数错误':'誤ったパラメータ',
        '服务器内部错误':'内部サーバエラー',
        '网络错误':'ネットワークエラー',
        '非法请求':'要求失敗',
        '输入参数错误':'パラメータ入力エラー',
        '非法的用户号码':'無効なアカウント',
        'QQMail未激活':'非アクティブなQQMail',
        'skey验证不通过':'skey確認失敗',
        '邮件被拦截':'ブロックされたメールメッセージ',
        '发送频率过高':'送信頻度の制限を超過しました',
        '收件人总数超过限制':'受信者制限を超過しました',
        '邮件大小超过限制':'メールサイズ制限を超過しました',
        '邮件发送失败':'メールを送信できません',
        '分组不存在':'カテゴリが存在しません',
        '不能删除默认分组':'既定グループは削除できません',
        '分组名不能为空':'カテゴリ名は空にできません',
        '分组名重复':'カテゴリ名は同じにはできません',
        "网络错误，请稍后再试":"ネットワークエラー。後でやり直してください",

        "操作成功": "完了",
        "连接服务器超时, 请稍后再试": "接続タイムアウト。やり直してください",
        "出现未知错误": "申し訳ありません。不明なエラー",
        "目录不存在": "フォルダが存在しません",
        "文件不存在": "ファイルが存在しません",
        "目录已经存在": "既存のフォルダです",
        "文件已经存在": "既存のファイルです",
        "剩余空间不足": "容量が不足しています",

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
        "文字语音": "音とテキスト",
        "视频图片": "動画",
        "文章": "記事",
        "腾讯新闻": "Tencentニュース",
        "图片": "写真",
        "QQ邮箱": "QQ Mail",
        "QQ离线文件": "QQオフラインファイル",
        "微云": "Tencentクラウド",
        "微云相册": "Tencentクラウドアルバム"//
    };
    c['disk.file_list.dir_name'] = {//add in file
        "微信": "WeChat",
        "腾讯新闻": "Tencentニュース",
        "QQ邮箱": "QQ Mail",
        "QQ离线文件": "QQオフラインファイル",
        "微云相册": "Tencentクラウドアルバム",
        "文字语音": "音とテキスト",
        "视频图片": "動画",
        "文章": "記事"
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
        "选择存储位置": "ストレージの場所を選択する",
        "移动到": "移動先",
        "等{0}个文件": " および{0}フォルダ",
        "另存为": "名前を付けて保存",
        "文件已经在该文件夹下了": "このフォルダに既存のファイル",//
        "不能将文件移动到自身或其子文件夹下": "このファイルはそれ自体やサブフォルダに移動できません",//

        "请选中要存放的目录": "送信先フォルダの選択",//
        "正在移动第{0}/{1}个文件": "{0}/{1}のファイルを移動中...",//如 "正在移动第1/10个文件"
        "文件移动成功": "ファイルが移動されました",//
        "部分文件移动失败：": "一部のファイルを移動できません："//
    };

    c['disk.remove'] = {//add in file
        "删除文件": "ファイルの削除",
        "删除成功": "削除済み",
        "文件夹": "フォルダ",
        "文件": "ファイル",
        "确定": "OK",
        "正在删除第{0}/{1}个文件": "{0}/{1}のファイルを削除中...",
        "确定删除这些文件吗？": "これらのファイルを削除しますか?", //
        "确定删除这些文件夹吗？": "これらのフォルダを削除しますか?",//
        "确定删除这个文件吗？": "このファイルを削除しますか?",//
        "确定删除这个文件夹吗？": "これらのフォルダを削除しますか?",//
        "等{0}个文件": "および{0}ファイル",//
        "等{0}个文件夹": "および{0}フォルダ",//
        "部分文件删除失败：": "一部のファイルを削除できません：",//
        "正在删除": "削除中…",//
        "文件删除失败：": "削除失敗："//
    };

    c['disk.menu'] = {//add in file
        "分享": "共有",
        "邮件分享": "Eメールの共有",
        "链接分享": "リンクの共有",
        "重命名": "名前変更",
        "删除": "削除",
        "移动到": "移動先",
        "下载": "ダウンロード",
        "另存为": "名前を付けて保存"
    };

    c['disk.offline'] = {//add in file
        "名称": "名前",
        "大小": "サイズ",
        "过期时间": "タイムアウト",//
        "来源": "ソース",//
        "我知道了": "OK",//
        "发给： ": "送信先： ",//
        "来自： ": "送信元： ",//
        "即将过期": "期限間近",//
        "{0}天": "{0}日",//
        "{0}个文件成功另存到微云，{1}个文件另存失败": "{0}個のファイルをクラウドに保存、{1}個失敗", // 如 "10个文件成功另存到微云，1个文件另存失败"
        "{0}个文件成功另存到微云": "{0}個のファイルをクラウドに保存", // 如 "10个文件成功另存到微云"
        "正在另存为{0}/{1}第个文件": "{0}/{1}のファイルをクラウドに保存中...",// 如： "正在另存为1/10第个文件"
        "暂无离线文件": "オフラインファイルなし",//
        "QQ收发的离线文件，在这里查看": "QQで受信したオフラインファイルの表示",//

        "确定删除{0}吗?": "{0}を削除しますか?",//
        "确定删除{0}等文件吗?": "ファイルを含む{0}を削除しますか?",//
        "确定删除{0}等文件夹吗?": "フォルダを含む{0}を削除しますか?",//
        "确认删除": "削除を確認",//
        "如果对方未接收，删除会导致对方接收失败": "削除すると、受信者に受信エラーが発生する可能性があります"//
    };

    c['disk.rename'] = {//add in file
        "新建文件夹成功": "フォルダが作成されました",
        "更名成功": "名前変更済み",
        "文件夹名有冲突，请重新命名": "フォルダ名の競合。変更してやり直してください",//
        "文件名有冲突，请重新命名": "ファイル名の競合。変更してやり直してください",//
        "文件夹路径过深，请重新创建": "パスの階層が深すぎます。やり直してください"//
    };

    c['disk.share'] = {//add in file
        "复制成功": "コピー済み",
        "获取下载链接成功！": "ダウンロードURLの準備完了!",//
        "复制链接": "リンクのコピー",//
        "邮件分享暂不支持文件夹": "フォルダのメール共有は現在サポートされていません",//
        "链接分享一次最多支持{0}个文件": "各URLで最高{0}個のファイルを共有できます",//
        "不能分享破损的文件": "壊れたファイルは共有できません",//
        "不能分享空文件": "空のファイルは共有できません",//
        "分享的文件应小于{0}": "{0}未満のファイルのみ共有できます", // 如 "分享的文件应小于2K"
        "您的浏览器不支持该功能": "この機能はブラウザでサポートされていません",//
        "{0}等{2}个文件夹": "{0}/{2}個のフォルダ",//
        "{0}等{1}个文件": "{0}/{1}個のファイル",//
        "{0}等{1}个文件夹和{2}个文件": "{0}/{1}個のフォルダと{2}個のファイル"//
    };

    c['disk.tree'] = {//add in file
        "不能移动到{0}中": "{0}に移動できません"//
    };

    c['disk.ui_normal_tmpl'] = {//add in file
        "文件夹": "Folders",
        "文件": "ファイル",
        "暂无文件": "現在、ファイルはありません",
        "请点击左上角的“上传”按钮添加": '[アップロード]ボタンをクリックして追加'
    };

    c['disk.ui_virtual'] = {//add in file  (正在载入...)
        "文件夹": "フォルダ",
        "文件": "ファイル",
        "下载": "ダウンロード",
        "删除成功": "削除済み",
        "文章": "写真",
        "没有了": "使用不可", // 空提示
        "点击收起": "クリックして閉じる",//
        "点击展开": "クリックして展開",//
        "您还没有安装flash播放器，请点击{0}这里{1}安装": "Flashがありません。{0}をクリックして{1}をインストールしてください", //
        "加载中...": "読み込み中…",
        "加载更多": "さらに読み込む",//
        "删除": "削除",
        "来源": "ソース",
        "消息": "情報",//
        "您还没有保存任何{0}内容": "{0}を保存していません" //
    };


    c['disk.tbar'] = {//add in file
        "下载": "ダウンロード",
        "分享": "共有",
        "移动到": "移動先",
        "重命名": "名前変更",
        "删除": "削除",
        "新建文件夹": "新しいフォルダ",
        "刷新": "更新",//
        "另存为": "名前を付けて保存",
        "请选择文件": "選択してください",
        "打包下载一次最多支持{0}个文件": "各ダウンロードには最高{0}個のファイル含めることができます",//
        "不能下载破损的文件": "壊れたファイルはダウンロードできません",//
        "部分文件不可下载": "一部のファイルをダウンロードできません",//
        "链接分享一次最多支持{0}个文件": "各URLで最高{0}個のファイルを共有できます",//
        "不能分享破损的文件": "壊れたファイルは共有できません",//
        "不能分享空的文件": "空のファイルは共有できません",//
        "不能移动破损文件": "壊れたファイルは移動できません",//
        "不能移动QQ硬盘目录": "QQディスクフォルダに移動できません",//
        "部分文件不可移动": "一部のファイルを移動できません",//
        "只能对单个文件（夹）重命名": "単一ファイル/フォルダのみ名前を変更できます",//
        "不能对破损文件进行重命名": "壊れたファイルは名前変更できません",//
        "部分文件不可重命名": "一部のファイルを名前変更できません",//
        "不能删除网络收藏夹目录": "お気に入りは削除できません",//
        "不能删除QQ硬盘目录": "QQディスクフォルダは削除できません",//
        "部分文件不可删除": "一部のファイルを削除できません"//
    };

    c['disk.view_switch'] = {//add in file
        "隐藏目录树": "ディレクトリツリーの非表示",
        "查看目录树": "ディレクトリツリーの表示",
        "按时间排序": "時間で並べ替え",
        "按字母顺序": "アルファベット順に並べ替え",
        "显示缩略图": "サムネイルの表示"
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
        '文档较大，正在加载，请耐心等候':'読み込み中。時間がかかる場合があります',
        '文档正在加载中，请稍候':'読み込み中。お待ちください...',
        '附件预览时发生错误':'エラーのプレビュー',
        '请':'以下を試行してください',
        '重试':'再試行',
        '或': 'または',
        '文件夹':'フォルダの',
        '该文件夹为空。':'ダウンロード',
        '拉取数据时发生错误':'データの読み込み中にエラーが発生しました',
        '该压缩包已经加密，无法预览':'暗号化されています。プレビューできません',
        '文件已损坏':'壊れたファイル',
        '已加载':'読み込み済み',
        '正在加载中...':'読み込み中。お待ちください...',
        '压缩包大小超过{0}M，暂不支持预览':'{0}MBを超える圧縮ファイル。プレビューできません',
        '第{0}张':'Page {0}',
        '第{0}/{1}张':'Page {0}/{1}',
        '原图':'オリジナル',
        '来源':'ソース',
        '下载':'フォルダの',
        '删除':'削除',
        '上一张':'前へ',
        '下一张':'次へ',
        '仍在加载中':'読み込み中…',
        '文件':'ファイル',
        //新增加的
        '请<a data-action="retry" href="#">重试</a>或直接<a data-action="down" href="#">下载</a>':'{<a data-action="retry" href="#">再試行</a>}するか{<a data-action="download" href="#">ダウンロード</a>}して表示してください',
        //'请{重试}或直接{下载}查看'
        '请直接{0}':'{0}してください',  //请直接{下载}
        '请<a data-action="down" href="#">下载</a>后查看':'{<a data-action="down" href="#">ダウンロード</a>}して表示してください', //请{下载}后查看
        '请<a data-action="retry" href="#">重试</a> 或直接 <a data-action="download" href="#">下载</a> 查看。':'{<a data-action="retry" href="#">再試行</a>}するか{<a data-action="download" href="#">ダウンロード</a>}して表示してください'
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
        '提示':'通知',
        '你的QQ版本暂不支持下载4G以上的文件':'このQQバージョンでは4GBを超えるファイルはダウンロードできません',
        '打包下载不能超过{0}个文件':'{0}個より多いファイルは一度にダウンロードできません',
        '正在获取下载地址':'ダウンロードアドレスを取得中...'
    };

    c['wx_helper'] ={
        '点击展开':'クリックして展開',
        '帐号绑定成功':'アカウントをリンクしました',
        '帐号绑定失败':'アカウントをリンクできません',
        '删除失败，请稍后重试':'削除できません。やり直してください',
        '登录态已经过期，请您重新在微信内输入"0"进行激活':'ログインタイムアウト。やり直してWeChatで「0」を入力してください',
        '暂时无法访问，请稍后重试':'一時的に使用できません。後でやり直してください'
    };

    c['third_party_iframe'] = {
        '在加载中，请稍候':'読み込み中。お待ちください...'
    };

    c['photo_guide'] ={
        '我知道了':'OK',
        '微云相册':'Tencentクラウドアルバム'
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
        '更换帐号': 'アカウントの切替',
        '请输入您的独立密码': '独自のパスワードを入力してください',
        '确定': 'OK',
        '请输入密码':'パスワードを入力してください',
        '忘记密码': 'パスワードを忘れた場合',
        '您输入的独立密码有误，请重新输入': '入力した独自のパスワードが正しくありません。やり直してください',
        '验证独立密码失败':'スタンドアロンパスワードを確認できません',
        '刷新页面':"更新",
        '验证独立密码过程中出现错误':'確認プロセスエラー',
        '如果您从未设置过独立密码，请尝试':'個別のパスワードを作成してください (未作成の場合)',
        '您的会话已经超时，请重新登录微云':'ログインタイムアウト。再びサインインしてください',
        '独立密码签名已经超时，请重新验证':'個別のパスワード署名の期限切れ。再確認してください',
        '失败次数过多，独立密码已被锁定，请稍后访问':'試行失敗回数の超過:パスワードがロックされました。後でやり直してください'
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
        '关闭': '閉じる',
        '新设置密码': '新しいパスワードの設定',
        '更改密码': 'パスワードの変更',
        '删除密码': 'パスワードの削除',
        '确定密码': 'パスワードの再入力',
        '填写当前密码': '現在のパスワードの入力',
        '填写新密码': '新しいパスワードの入力',
        '确定新密码': '新しいパスワードの再入力',
        '输入密码': 'パスワードの入力',
        '密码设置成功': 'パスワードの設定',
        '管理密码': 'パスワードの管理',
        '独立密码已删除': '独自のパスワードは削除されています',
        '您输入的密码有误，请重新输入': '入力したパスワードが正しくありません。やり直してください',
        '请输入密码': 'パスワードを入力してください',
        '密码长度不能小于6个字符': '新しいパスワードは6文字以上で設定する必要があります',
        '您两次输入的密码不一致，请重新输入': '入力した2つのパスワードが矛盾しています。やり直してください',
        '新密码长度不能小于6个字符': '新しいパスワードは6文字以上で設定する必要があります',
        '两次输入的密码不一致': '入力した2つのパスワードが矛盾しています',
        '填写您的密码':'パスワードを入力してください',
        '密码修改成功':'パスワードが変更されました',
        '请输入原密码':'古いパスワードの入力',
        '请输入新密码':'新しいパスワードの入力',
        '会话已超时，请重新登录后再尝试':'ログインタイムアウト。再びサインインしてください',
        '独立密码签名已经超时，请重新验证':'スタンドアロンパスワードの期限切れ。再確認してください',
        '当前密码输入有误，请重新输入':'パスワードが間違っています。やり直してください',
        '新设置独立密码失败':'パスワードの作成失敗',
        '删除独立密码失败':'パスワードの削除失敗',
        '失败次数过多，独立密码已被锁定':'試行失敗回数の超過:パスワードがロックされました。後でやり直してください',
        '独立密码不能与QQ密码相同':'QQパスワードと同じにはできません',
        '新密码不能和原密码相同':'古いパスワードと同じにはできません',
        '您尚未设置独立密码，请刷新页面后尝试':'パスワードを作成できない場合は、更新してやり直してください',
        '您修改密码的频率过快，请过12小时后尝试':'パスワードは12時間に一度だけ変更できます',
        '您已设置了独立密码，请重新登录':'スタンドアロンパスワード設定完了。再びログインしてください'
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
        '已使用':'使用済み',
        '总容量':'合計',
        '独立密码':'独自のパスワード',
        '（未开启）':'(有効になっていません)',
        '下载客户端':'クライアントのダウンロード',
        '反馈':'フィードバック',
        '退出':'終了',
        '搜索全部文件':'全てのファイルを検索',
        '确定':'OK',
        //新增加的
        '微云Android版':'Android',
        '微云iPad版':'iPad',
        '微云iPhone版':'iPhone',
        '微云手机版':'携帯',
        '手机号码输入有误，请重新输入。':'無効な番号です。やり直してください',
        '发送速率过快，请稍后再发,您还可以通过右侧二维码的方式快速安装微云。':'要求の送信が多すぎます。後でやり直すか、QRコードをスキャンしてインストールしてください',
        '网络繁忙，暂不能发送短信，请稍后再试。建议您通过右侧二维码的方式快速安装微云。':'SMS送信不可。やり直すか、QRコードをスキャンしてインストールしてください',
        '使用iPad扫描以下二维码即可安装。':'以下のQRコードをスキャンしてインストール',
        '使用手机上的二维码扫描软件拍摄以下二维码即可立即下载。':'携帯で以下のQRコードをスキャンしてインストール',
        '方法二：二维码获取':'方法2:QRコードをスキャンしてインストール',
        '方法三：二维码获取':'方法3:QRコードをスキャンしてインストール',
        '安装android版':'Android版のインストール',
        '安装iphone版':'iPhone版のインストール',
        '安装ipad版':'iPad版のインストール',
        '方法一：短信获取下载地址':'方法1:SMSでダウンロードリンクを受信',
        '请填写手机号，下载地址将发送到您的手机上。':'ダウンロードリンクが記載されたSMSを受信する携帯電話番号を入力してください',
        '请输入手机号码':'携帯電話番号',
        '发送短信':'SMSの送信',
        '您输入的电话号码有误，请重新输入。':'無効な番号です。やり直してください',
        '您将收到一条包含微云下载地址的短信，点击短信中的地址即可开始下载。':'送信されたSMSのリンクを開いてダウンロードしてください',
        '完成':'完了',
        '再次发送短信':'再送信',
        '方法二：下载安装包':'方法2:インストールファイルのダウンロード',
        '点击开始下载':'クリックしてダウンロード',
        '方法二：前往App Store下载':'方法2:アプリストアからダウンロード',
        '方法一：前往App Store下载':'方法1:アプリストアからダウンロード',
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
        '刷新':'更新',
        '分享':'共有',
        '删除':'削除',
        '下载':'ダウンロード',
        '返回':'戻る',
        '删除分组':'カテゴリの削除',
        '更改封面':'カバーの変更',
        '重命名':'名前変更',
        '时间轴':'タイムライン',
        '分组':'カテゴリ',
        '全部':'全て',
        '新建分组':'新しいカテゴリ',
        '打开':'開く',
        '请点击左上角的“上传”按钮添加':'[アップロード]ボタンをクリックして追加',
        '此分组中无图片': 'このカテゴリに画像はありません',
        '爱情':'いいね',
        '{0}张':'{0}項目',
        '请选择图片':'画像の選択',
        '一次最多只能修改100张图片':'一度に最高100個の画像を変更できます',
        '设置成功':'完了',
        '选定':'選択',
        '取消':'取り消し',
        '请选择分组':'カテゴリの選択',
        '请选择不同的分组':'別のカテゴリの選択',
        '更改分组成功':'変更済み',
        '列表已更新':'リスト更新済み',
        '更改分组':'カテゴリの変更',
        '设置为封面':'カバーとして設定',
        '不能为空':'空にできません',
        '过长':'長すぎます',
        '不能含有特殊字符':'特殊文字は使用できません',
        '确定要删除这个分组吗？':'このカテゴリを削除しますか?',
        '删除成功':'削除済み',
        '组名':'名前',
        '修改成功':'完了',
        '创建成功':'完了',
        '排序成功':'完了',
        '删除图片':'画像の削除',
        '确定要删除这些图片吗？':'これらを削除しますか?',
        '确定要删除这张图片吗？':'これを削除しますか?',
        '删除失败':'削除できません'
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
        "今天": "今日",
        "昨天": "昨日",
        "最近7天": "過去7日間",
        "7天前": "7日以上前",
        '暂无文件':"現在、ファイルはありません",
        "正在加载":"読み込み中…",
        "加载完成":"完了",
        "下载":"ダウンロード",
        '您可以通过“添加”上传文件':'[追加]を使用してさらにファイルをアップロード'
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
        '文件名':'ファイル名',
        '文件大小':'サイズ',
        '删除时间':'日付',
        '还原文件大小超过剩余容量':'復元に十分な容量がありません',
        '还原':'復元',
        '部分文件还原失败：':'一部のファイルを復元できません:',
        '正在还原第{0}/{1}个文件':'{0}/{1}個のファイルを復元中',
        '清空完成':'空になりました',
        '请选择文件':'選択してください',
        '清空回收站':'ごみ箱を空にする',
        '确定清空回收站吗？':'ごみ箱を空にしますか?',
        '清空后将无法找回已删除的文件':'空にすると、削除したファイルを復元することはできません',
        '确定':'OK',
        '您的回收站内没有文件':'復元するファイルがありませ',
        '刷新':'更新',
        '回收站不占用网盘空间，保留30天后将自动清除！':'ごみ箱は30日後に自動的に空になります',
        '回收站为空':'ごみ箱は空です',
        '取消':'取り消し',
        '您可以在这里找回最近30天删除的文件':'過去30日間に削除したファイルを復元する',
        '成功还原{0}个文件夹':'{0}個のフォルダを復元',
        '成功还原{0}个文件':'{0}個のフォルダを復元',
        '成功还原{0}个文件夹和{1}个文件':'{0}個のフォルダと{1}個のファイルを復元'


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
        '打开文件所在目录':'そのフォルダを開く',
        '分享':'共有',
        '删除':'削除',
        '下载':'ダウンロード',
        '抱歉，未找到匹配文件':"検索条件に一致するドキュメントはありませんでした",
        '正在打开':'開いています...',
        '没有可显示的数据':'データなし',
        '正在搜索...':'検索中...',
        '无结果':'結果がありません',
        '搜索':'検索中...',
        '共{0}个':'合計{0}項目'

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
        '今天': '今日',
        '昨天': '昨日',
        '关闭':'閉じる',
        '取消分享': '共有の取り消し',
        '创建访问密码': 'アクセスパスワードの作成',
        '密码管理': 'パスワード管理',
        '复制分享链接': '共有リンクのコピー',
        '访问分享链接': '共有リンクにアクセス',
        '私密': '非公開',
        '公开': '公開',
        '您确定取消全部分享吗？':'共有を取り消しますか?',
        '您确定取消分享吗？':'共有を取り消しますか?',
        '取消分享后，分享链接将被删除。':'取り消すと、共有リンクは削除されます。',
        '已取消分享':'共有が取り消されました',
        '是':'はい',
        '否':'いいえ',
        '修改密码':'パスワードの変更',
        '删除密码':'パスワードの削除',
        '请输入您要创建的密码：':'新しいパスワードを入力してください:',
        '暂无分享':'現在、共有項目はありません',
        '名称':'名前',
        '状态':'ステータス',
        '分享时间':'時間の共有',
        '浏览次数':'表示数',
        '下载次数':'ダウンロード数',
        '确定':'OK',
        '取消':'取り消し',
        '密码删除成功':'パスワードの削除',
        '链接复制成功':'コピーされたリンク',
        '创建密码':'パスワードの作成',
        '访问密码创建成功！':'アクセスパスワードが作成されました',
        '复制链接和密码':'リンクとパスワードをコピー',
        '密码修改成功！':'パスワードが変更されました',
        '分享的链接':'共有リンク',
        '微云分享链接，不限下载次数，永久有效！':'Tencentクラウド共有のリンクは永久的です',
        '刷新':'更新',
        '正在取消第{0}/{1}个分享链接':'{0}/{1}の共有リンクの取り消し中...',
        '已失效': '取り消し済み',      //状态
        '该文件已被删除，分享链接已失效': 'リンクを取り消し済み:削除済みファイルを指し示します',
        '复制成功，粘贴给您的朋友吧':'クリップボードにコピー済み。貼り付けて共有できます',
        '您的浏览器不支持该功能':"この機能はブラウザでサポートされていません",
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
        '系统繁忙(0),请稍后重试':'System busy (0). Please try again. {Feedback}',
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