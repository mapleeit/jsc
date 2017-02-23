/**
 * 跳转映射配置
 * @type {{}}
 */
//origin host: jump.weiyun.com
module.exports['jump.weiyun.com'] = {
    "1001" : "http://www.weiyun.com/",//pc端右键菜单跳转下载页面
    "1002" : "http://www.weiyun.com/disk/index.html?WYTAG=weiyun.app.pc.menu",//pc端右键菜单跳转web版
    "1003" : "http://support.qq.com/discuss/942_1.shtml?WYTAG=weiyun.app.pc.menu",//pc端右键菜单跳转
    "1004" : "http://kf.qq.com/product/weiyun.html?WYTAG=weiyun.app.pc.menu",//pc端右键菜单跳转
    "1005" : "http://www.weiyun.com/checkout-rule.html?WYTAG=weiyun.app.pc.menu",//pc端右键菜单跳转 官网
    "1006" : "http://zc.qq.com/chs/index.html",
    "1007" : "http://aq.qq.com/cn2/findpsw/findpsw_index",
    "1008" : "http://www.weiyun.com/photo/index.html",
    "1009" : "http://www.weiyun.com/disk/index.html?WYTAG=weiyun.jump",
    "1010" : "http://aq.qq.com/cn2/ipwd/my_ipwd",
    "1011" : "http://www.weiyun.com/act/light-up.html?WYTAG=weiyun.extapp.qq",//点亮图标，从QQ客户端跳转过来
    "1012" : "http://www.weiyun.com/disk/index.html?WYTAG=weiyun.app.pc#m=recycle", //pc端右键菜单跳转跳转回收站

    "2001" : "http://www.weiyun.com/disk/app.php?appbox&WYTAG=weiyun.extapp.qq.filetransfer#", //QQ传文件 打开appbox（在微云中查看，接收方打开）
    "2002" : "http://www.weiyun.com/indep-login.html?from=http%3A%2F%2Fwww.weiyun.com%2Fqtrans%2Fqtrans.html%3FWYTAG%3Dweiyun.extapp.qq.filetransfer", // QQ传文件 发送微云文件   请帮添加&WYTAG=weiyun.extapp.qq.filetransfer
    //code : bondli 增加参数qq_receive，判断是否qq接收到的文件传微云，防止直出的时候多次跳转
    "2003" : "http://www.weiyun.com/disk/app.php?appbox&qq_receive&WYTAG=weiyun.extapp.qq.filetransfer#action=qq_receive", // QQ传文件 上传到微云
	"2004" : "http://www.weiyun.com/disk/index.html?WYTAG=weiyun.app.pc.appbox", // QQ从appbox图标跳转进入网页版
    "2005" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://jump.weiyun.qq.com%3Ffrom%3D3008", //QQ从会员图标跳转至微云会员页（现在直接去支付页了），未启用

    "3001" : "http://kf.qq.com/product/weiyun.htm",                     //PC客户端微信帐号转种登录态使用，本URL无意义，因为种完cookie后会根据source参数再302到具体的URL
    "3002" : "http://www.weiyun.com/appbox/jumpWyDisk.html",            //老页面的入口
    "3003" : "http://www.weiyun.com/client/index.html?m=station",       //PC客户端内嵌web中转站，已下线
    "3004" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://pay.qq.com/ipay/index.shtml%3Fc%3Dwyclub%26aid%3Dpc_pay%26ch%3Dqdqb%2Ckj%26nl%3D!3%2C6%2C9%2C12%26nt%3D!month", // PC客户端内嵌页面  微云会员特权页, 未启用
    "3005" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://jump.weiyun.qq.com%3Ffrom%3D3012%26source%3Dqq_mail", // QQ邮箱跳转会员页
    "3006" : "http://kf.qq.com/product/weiyun.html",                    //ipad帮助页面
    '3007' : 'http://www.weiyun.com/disk/index.html?WYTAG=weiyun.jump', // 打开网盘页面 位置未知，先用jump看数据
    '3008' : 'http://www.weiyun.com/disk/app.php?appbox&WYTAG=weiyun.jump#', // 打开appbox网盘页面 位置未知，先用jump看数据
    "3010" : "http://zc.qq.com/chs/index.html",                         //pc浏览器插件注册页面跳转
    "3011" : "http://support.qq.com/discuss/942_1.shtml",               //pc浏览器插件反馈页面跳转
    "3012" : "http://www.weiyun.com/disk/index.html?WYTAG=weiyun.app.mac#m=recycle", //MAC菜单 –>help ->回收站
    "3013" : "http://www.weiyun.com/disk/index.html?WYTAG=weiyun.extapp.macqq", //MACqq跳转到网页版微云
    "3014" : "http://www.weiyun.com/disk/index.html?WYTAG=weiyun.app.mac", //MAC菜单 ->访问网页版
    "3015" : "http://www.weiyun.com/disk/app.php?appbox&WYTAG=weiyun.extapp.qq.filemanager#", //客户端文件资源管理器打开appbox
    "3016" : "http://www.weiyun.com/mobile/wyfire-faq-cn.html", //我传 -> faq中文版
    "3017" : "http://www.weiyun.com/mobile/wyfire-faq-en.html", //我传 -> faq英文版

    "3018" : "http://www.weiyun.com/act/10t.html?lang=cn",      // android手机端访问10T活动页面，活动已下线
    "3019" : "http://www.weiyun.com/disk/app.php?appbox&WYTAG=weiyun.extapp.qq.senderopenappbox", //QQ传文件 打开appbox（在微云中查看，发送方打开）
    "3020" : "http://www.weiyun.com/disk/app.php?appbox&WYTAG=weiyun.extapp.iqq.appbox", //国际版QQ appbox跳转
    "3021" : "https://h5.weiyun.com/activities",                // 手机客户端签到活动页面
    "3022" : "http://www.weiyun.com/act/bless.html",            // 手机客户端新年拜年活动页面
    "3023" : "http://www.weiyun.com/disk/app.php?s=photoguide#m=album.all",              //客户端跳转到web页提示微云相册和微云网盘已合并，外网未启用
    "3024" : "https://mobile.qzone.qq.com/l?g=1802",             //手Q相册备份引导安装微云
    "3025" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://pay.qq.com/ipay/index.shtml?n%3D12%26c%3Dxxjzghh%2Cxxjzgw%26aid%3Dweiyun%26ch%3Dqdqb%2Ckj%26nl%3D!3%2C6%2C9%2C12%26nt%3D!month", //pc客户端跳到黄钻充值页面
    "3026" : "http://support.qq.com/write.shtml?fid=1096",      //微云非同步盘support反馈入口

    "3027" : "https://ptlogin2.weiyun.com/ho_cross_domain?&tourl=https%3A%2F%2Fh5.qzone.qq.com/vipinfo/index", //黄钻微云特权介绍页，页面已下线，替换为黄钻主页面
    "3028" : "https://mobile.qzone.qq.com/l?g=1802",             //空间下android版下载渠道,相册备份入口
    "3029" : "https://ptlogin2.weiyun.com/ho_cross_domain?&tourl=https://jump.weiyun.qq.com%3Ffrom%3D3030", //手机端黄钻引导下载新版app，旧版用
    "3030" : "https://ptlogin2.weiyun.com/ho_cross_domain?&tourl=https://jump.weiyun.qq.com%3Ffrom%3D3032", //手机端微云会员页
	"3031" : "http://www.weiyun.com/client/index.html?m=note",  //PC客户端内嵌笔记页
    "3032" : "http://www.weiyun.com/pc_innner.html",            //PC内嵌页检测登录态失效后，传递cookie用的
    "3033" : "https://ptlogin2.weiyun.com/ho_cross_domain?&tourl=https://jump.weiyun.qq.com%3Ffrom%3D3031", //手机端微云会员页，iap
    "3034" : "http://www.weiyun.com/disk/index.html?WYTAG=weiyun.app.pc#m=recycle",  //PC进入回收站
    "3035" : "http://www.weiyun.com/feedback.html?WYTAG=weiyun.app.pc.menu",   //PC右键菜单->反馈
	"3036" : "https://ptlogin2.weiyun.com/ho_cross_domain?&tourl=https://jump.weiyun.qq.com%3Ffrom%3D3029",    //移动端小黄条跳转开通流量券
    "3037" : "https://h5.weiyun.com/vip?from=qq_mail",         //手机端QQ邮箱转存文件到微云流量超限
	"3038" : "http://www.weiyun.com/disk/index.html?WYTAG=weiyun.extapp.qq.allinone", //QQ聊天窗口转存成功，跳转web查看
	"3039" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://jump.weiyun.qq.com%3Ffrom%3D3012%26source%3Dqq_allinone", //QQ聊天窗口转存超限，跳转web会员页
    "3040" : "https://www.weiyun.com/mobile/contact-backup.html", //移动端通讯录备份H5页面
    "3041" : "http://www.weiyun.com/pc-share.html",             //PC客户端分享框页面
    "3042" : "https://h5.weiyun.com/share_trace/share_list",     //H5分享链接记录页面
    "3043" : "http://www.weiyun.com/disk/index.html?WYTAG=weiyun.app.pc#m=share",  //PC进入分享链接（一开始是准备内嵌，但新版UI跟PC的交互差别太大，暂时用浏览器打开的方式）
    // 备注：ptlogin2.qq.com域名采用ssl.ptlogin2.qq.com来兼容http，以后尽量采用这个域名
    // 微云的ptlogin2.weiyun.com支持https
    // 但QQ域的ptlogin2.qq.com不支持https
    // ssl.ptlogin2.qq.com这个才支持https
    "3044" : "https://ssl.ptlogin2.qq.com/ho_cross_domain?&tourl=https%3A%2F%2Fh5.weiyun.com%2Fvip%3Ffrom%3Dqqvip_privilege", //手Q里QQ会员专享活动页里跳转微云会员页面开通
    "3045" : "https://ssl.ptlogin2.qq.com/ho_cross_domain?&tourl=https%3A%2F%2Fjump.weiyun.com%3Ffrom%3D3033",  //手空独立版里的照片备份->开通微云会员
    "3046" : "https://www.weiyun.com/mobile/index.html",  //运营活动，拉活H5页面，占坑
    "3047" : "https://ptlogin2.weiyun.com/ho_cross_domain?&tourl=https://jump.weiyun.qq.com%3Ffrom%3D3033",  // H5容量购买
    "3048" : "https://ptlogin2.weiyun.com/ho_cross_domain?&tourl=https://jump.weiyun.qq.com%3Ffrom%3D3011%26source%3Dqq_browser",   // 手机QQ浏览器上传到微云受限，跳转开会员
    "3049" : "https://ptlogin2.weiyun.com/ho_cross_domain?&tourl=https://weiyun.qzone.qq.com%3Ffrom%3D1001",                         //PC客户端跳转送半年活动，多两次302实现免登录
    "3050" : "https://h5.weiyun.com/capacity_purchase?iap", // H5容量购买 ios , iap使用
    "3051" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://jump.weiyun.qq.com%3Ffrom%3D3034", //PC客户端容量受限转去pc web会员页
    "3052" : "https://ptlogin2.weiyun.com/ho_cross_domain?&tourl=https://jump.weiyun.qq.com%3Ffrom%3D3035", //PC客户端容量受限转去pc web容量购买页
    "3053" : "https://ptlogin2.weiyun.com/ho_cross_domain?&tourl=https://jump.weiyun.qq.com%3Ffrom%3D3036", // 微信公众号跳会员页
    "3054" : "https://ptlogin2.weiyun.com/ho_cross_domain?&tourl=https://jump.weiyun.qq.com%3Ffrom%3D3054", // 弹窗支付
    "3055" : "https://h5.weiyun.com/share_trace/trace_detail",                                              //H5分享链接详情页面
    "3060" : "NONSENSE_VALUE"                                                                              // 弹窗支付，随机活动页面种qq域登录态使用
};

//origin host: jump.weiyun.qq.com
module.exports['jump.weiyun.qq.com'] = {
    "1001" : "http://weiyun.qq.com/",
    "1002" : "http://weiyun.qq.com/web/index.html",
    "1003" : "http://support.qq.com/discuss/942_1.shtml?WYTAG=weiyun.qqclient.1003.fankui",
    "1004" : "http://kf.qq.com/product/weiyun.html?WYTAG=weiyun.qqclient.1004.help",
    "1005" : "http://weiyun.qq.com/index.html",
    "1006" : "http://zc.qq.com/chs/index.html",
    "1007" : "http://aq.qq.com/cn2/findpsw/findpsw_index",
    "1010" : "http://aq.qq.com/cn2/ipwd/my_ipwd",
    "1011" : "https://www.weiyun.com/vip/weiyun_vip.html?from=web",
    "1012" : "https://www.weiyun.com/vip/weiyun_vip.html?from=web_limit",
    "1013" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://pay.qq.com/ipay/index.shtml%3Fc%3Dwyclub%26aid%3Dweb_speedup%26ch%3Dqdqb%2Ckj%26nl%3D!3%2C6%2C9%2C12%26nt%3D!month",  //web上传加速，跳转开通会员
    "1014" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://pay.qq.com/ipay/index.shtml%3Fc%3Dwyclub%26aid%3Dpc_speedup%26ch%3Dqdqb%2Ckj%26nl%3D!3%2C6%2C9%2C12%26nt%3D!month",   //pc上传加速，跳转开通会员
    "1015" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://pay.qq.com/ipay/index.shtml%3Fc%3Dwyclub%26aid%3Dweb_menu_pay%26ch%3Dqdqb%2Ckj%26nl%3D!3%2C6%2C9%2C12%26nt%3D!month",  //web右上角菜单开通/续费会员
    "1016" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://pay.qq.com/ipay/index.shtml%3Fc%3Dwyclub%26aid%3Dqqtips%26ch%3Dqdqb%2Ckj%26nl%3D!3%2C6%2C9%2C12%26nt%3D!month",       //QQ催费提醒
    "1017" : "https://www.weiyun.com/vip/weiyun_vip.html?from=web_recycle_top_bar",      //web新版，回收站上方提示bar，跳转会员页面
    "1018" : "https://www.weiyun.com/vip/weiyun_vip.html?from=web_recycle_empty_view",   //web新版，回收站空页面，跳转会员页面
    "1019" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://pay.qq.com/ipay/index.shtml%3Fc%3Dwyclub%26aid%3Dweb_old_wyvip_recyclebinvipbar%26ch%3Dqdqb%2Ckj%26nl%3D!3%2C6%2C9%2C12%26nt%3D!month",       //web旧版，回收站上方提示bar，跳转会员页面
    "1020" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://pay.qq.com/ipay/index.shtml%3Fc%3Dwyclub%26aid%3Dweb_old_wyvip_recyclebinemptyview%26ch%3Dqdqb%2Ckj%26nl%3D!3%2C6%2C9%2C12%26nt%3D!month",       //web旧版，回收站空页面，跳转会员页面
	"1021" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://pay.qq.com/ipay/index.shtml%3Fc%3Dwyclub%26aid%3Dweb_wyvip_btdownload%26ch%3Dqdqb%2Ckj%26nl%3D!3%2C6%2C9%2C12%26nt%3D!month",  //离线下载开通会员
    "1022":  "https://www.weiyun.com/vip/weiyun_vip.html?from=pc_speedup",               //微信帐号用，同1014 --- pc上传加速，跳转开通会员
    "1023":  "https://www.weiyun.com/vip/weiyun_vip.html?from=pc_qboss",                 //微信帐号用，同3017 --- PC客户端广告位，跳转开通会员
    "1024":  "https://www.weiyun.com/vip/weiyun_vip.html?from=web_speedup",              //微信帐号用，同1013 --- web上传加速，跳转开通会员
    "1025":  "https://www.weiyun.com/vip/weiyun_vip.html?from=web_menu",                 //微信帐号用，同1015 --- web右上角菜单开通/续费会员
    "1026":  "https://www.weiyun.com/vip/weiyun_vip.html?from=web_btdownload",           //微信帐号用，同1021 --- web离线下载开通会员
    "1027" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://pay.qq.com/ipay/index.shtml%3Fc%3Dwyclub%26aid%3Dweb_wyvip_shrink_transfer_yellow_bar%26ch%3Dqdqb%2Ckj%26nl%3D!3%2C6%2C9%2C12%26nt%3D!month",  //web上传容量受限，跳转开通会员
    "1028":  "https://www.weiyun.com/vip/weiyun_vip.html?from=web_capacity",              //微信帐号用，同1027 --- web上传容量受限，跳转开通会员

    "2000" : "NONSENSE_VALUE", //转weiyun域名的登录态到qq.com，value无意义，但不能为空，具体值由sync指定


    "3003" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://jump.weiyun.qq.com%3Ffrom%3D3012%26source%3Dpc_menu_pay", //微信帐号用，同3005 --- PC客户端会员中心跳转微云会员特权页，
    "3004" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://jump.weiyun.qq.com%3Ffrom%3D3012%26source%3Dpc_center", // PC客户端会员中心跳转微云会员特权页
    "3005" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://pay.qq.com/ipay/index.shtml%3Fc%3Dwyclub%26aid%3Dpc_menu_pay%26ch%3Dqdqb%2Ckj%26nl%3D!3%2C6%2C9%2C12%26nt%3D!month", // PC客户端直接到pay支付页
    "3006" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://jump.weiyun.qq.com%3Ffrom%3D3012%26source%3Dmac", // MAC客户端跳转微云会员特权页 上传受限跳转
    "3007" : "https://www.weiyun.com/vip/weiyun_vip.html?from=mac",      // MAC客户端跳转微云会员特权页 上传受限跳转，未启用
    "3008" : "https://www.weiyun.com/vip/weiyun_vip.html?from=pc_limit", // PC客户端跳转微云会员特权页 上传受限跳转，未启用
    "3009" : "http://kf.qq.com/product/weiyun.html",                    //MAC设置 -> 帮助
    "3010" : "https://ptlogin2.weiyun.com/ho_cross_domain?&tourl=https://jump.weiyun.qq.com%3Ffrom%3D3011",
    "3011" : "https://h5.weiyun.com/vip",                                //用于H5会员页透传weiyun域名登录态到qq域名
    '3012' : "https://www.weiyun.com/vip/weiyun_vip.html",               //用于会员透传weiyun域名登录态到qq域名
    "3013" : "http://support.qq.com/discuss/715_1.shtml",               //MAC菜单 -> help -> 问题反馈
    "3014" : "https://ptlogin2.weiyun.com/ho_cross_domain?&tourl=https://jump.weiyun.qq.com%3Ffrom%3D3015",
    "3015" : "https://h5.weiyun.com/act/qqvip",                          //QQ会员活动页面
    "3016" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://jump.weiyun.qq.com%3Ffrom%3D3012%26source%3Dpc_limit",// PC客户端跳转微云会员特权页 上传受限跳转
	"3017" : "http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=http://pay.qq.com/ipay/index.shtml%3Fc%3Dwyclub%26aid%3Dpc_qboss_pay%26ch%3Dqdqb%2Ckj%26nl%3D!3%2C6%2C9%2C12%26nt%3D!month", // PC客户端广告位直接到pay支付页
    "3025" : "http://pay.qq.com/ipay/index.shtml?n=12&c=xxjzghh,xxjzgw&aid=weiyun&ch=qdqb,kj", //开通黄钻
    "3026" : "http://support.qq.com/write.shtml?fid=1096",  //微云非同步盘support反馈入口
    "3027" : "http://crm2.qq.com/page/portalpage/wpa.php?uin=40012345&f=1&ty=1&ap=000011:400797:|m:16|f:Kwy1", //PC非同步盘跳转客服入口，这个已经不维护，后面可以干掉
    "3028" : "http://kf.qq.com/product/weiyun.html",        //新入口：PC非同步盘跳转客服入口
    "3029" : "https://h5.weiyun.com/act/coupon",         // 微云客户端呼起的H5流量券活动入口
    "3030" : "https://h5.weiyun.com/vip?qzone",      //手机端黄钻引导下载新版app，旧版用
    "3031" : "https://h5.weiyun.com/vip?iap",        //手机端微云会员页，苹果审核时候用到，有细微调整
    "3032" : "https://h5.weiyun.com/vip",             //手机端微云会员页
    "3033" : "https://h5.weiyun.com/capacity_purchase", //H5容量购买
    "3034" : "https://www.weiyun.com/vip?from=pc_capacity",                             //PC客户端容量受限转去pc web会员页
    "3035" : "https://www.weiyun.com/vip/capacity_purchase.html?from=pc_capacity",        //PC客户端容量受限转去pc web容量购买页
    "3036" : "https://h5.weiyun.com/vip?from=public_vipcenter",           // 微信公众号跳会员页



    "3054" : "https://h5.weiyun.com/pop_pay",                                // 弹窗支付

    "3060" : "NONSENSE_VALUE"                                                // 弹窗支付，随机活动页面种qq域登录态使用
};


/**
 * 用来种p_skey到qzone.qq.com，方便对接空间的活动页
 * 配置规则：手机H5页面用1000开头，web页面用2000开头，其他内嵌页用3000开头
 * @example:
 * var s_url = encodeURIComponent(url);
 * location.href = 'http://ptlogin2.weiyun.com/ho_cross_domain?&tourl=' + encodeURIComponent('http://weiyun.qzone.qq.com?from=1000&s_url='+s_url);
 *
 */
//origin host: weiyun.qzone.qq.com
module.exports['weiyun.qzone.qq.com'] = {
    "1000": "http://www.weiyun.com/",                           //转weiyun域名的登录态到qzone.qq.com，此处value值无意义
    "1001": "https://act.qzone.qq.com/vip/meteor/m/p/1216",      //微云会员送半年活动，H5活动页，因为配置的活动页有区分web和h5,这里判断下再跳转
    "2001": "http://act.qzone.qq.com/vip/meteor/pc/p/1217"      //微云会员送半年活动web活动页
};