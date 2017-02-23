/**
 * WEBCGI2.0 PB协议命令字对接
 */
var cmds = {
	Invalid : 0,

	//-------------------------------------------------------------------//
	//文件预览模块用到的相关命令
	ListFile                : 51,          //拉取压缩文件中的列表--手机Srv转发给spp
	TransListFile           : 52,     //转发拉取命令--spp发现没有该文件信息，转给其它的spp处理
	ExtractFile             : 53,       //抽取压缩文件中的某个文件请求
	TransExtractFile        : 54,  //转发抽取压缩文件中的某个文件请求

	//-------------------------------------------------------------------//
	//office文档预览cgi与spp通讯
	ConvertOfficeToHtml     : 100,  //转换文档为html
	ConvertOfficeToPic      : 101,  //转换文档为图片
	DownloadAndConvertOffice: 102,  //下载并转换文档
	//docview
	DocviewPreviewFile      : 103, //请求预览文档
	DocviewGetPreview       : 104, //拉取预览结果
	DocviewConvertFile      : 105, //转换文档
	DownloadFile            : 106, //下载源文件

	//-------------------------------------------------------------------//
	//KeyValue系统用到的相关命令
	KeyValueSet         : 200,
	KeyValueGet         : 201,
	KeyValueDel         : 202,
	KeyValueAppend      : 203,
	KeyValueDeppend     : 204,
	KeyValueOverwrite   : 205,
	KeyValueInsert      : 206,
	KeyValueGetConfig   : 220,
	KeyValueGetIndex    : 221,
	KeyValueGetList     : 222,
	KeyValueClearUser   : 223,

	//-------------------------------------------------------------------//
	//qza_proxy QZONE代理服务器
	QzaShareAddShare    : 300,
	QzaShareAddShareV2  : 301,

	//-------------------------------------------------------------------//
	//微云助手--微信平台上的微云公共帐号
	//CollectionTextMsg  : 400,  //微信推送过来的文本消息
	//CollectionUrlMsg   : 401,  //微信推送过来的链接信息
	//CollectionVoiceMsg : 402,
	//CollectionImageMsg : 403,
	//CollectionVideoMsg : 404,
	//CollectionPullTextMsg  : 405,
	//CollectionPullUrlMsg   : 406,
	//CollectionPullVoiceMsg : 407,
	//CollectionDelTextMsg   : 408,
	//CollectionDelUrlMsg    : 409,
	//CollectionDelVoiceMsg  : 410,

	//-------------------------------------------------------------------//
	//文件代理模块中接入层与Cache层之间的协议
	FileTransPieceMsg   : 500,  //转存分片
	FileQueryOffsetMsg  : 501,  //查询已经上传的偏移量

	//文件增量上传
	FileDiffUploadMsg               :   580,
	FileDiffUploadConfParamMsg      : 581,

	//-------------------------------------------------------------------//
	//外链分享
	WyShareAdd          : 600,      // 生成微云分享
	WyShareGetDownInfo  : 601,      // 获取下载信息

	//-------------------------------------------------------------------//
	//联合活动文件上传和复制server
	UnionActivityFileUpload         : 620,      //联合活动文件上传
	UnionActivityFileCopy           : 621,      //联合活动文件复制

	//这个是之前的老协议，必须占用一下700~709的命令码
	WyUserLogin	:700,
	WyUserUploadFile	:701,
	//-------------------------------------------------------------------//
	//测试命令预留1000以下，这个范围内ajian不要再分配出去
	TestMsg             : 710,


	//各个模块需要分配的命令号：从1000开始分:每个模块预留1000个命令
	//-------------------------------------------------------------------//
	//对客户端的tcp文件上传相关协议
	ClientFileTransQueryMsg     : 1001, //该控制头来查询文件是否需要上传以及从什么位置开始上传：tcp文件上传代理非分片使用
	ClientFileTransPieceMsg     : 1011, //tcp分片上传数据

	//-------------------------------------------------------------------//
	//虚拟目录用到的命令：范围2001~2100
	VirtualDirConfigSet    			: 2001,         //保存用户的配置到云端
	VirtualDirConfigGet     		: 2002,         //从云端获取用户的配置
	VirtualDirConfigDelete  		: 2003,         //删除用户的配置
	VirtualDirDirList       		: 2004,         //返回用户已开通的所有的应用列表
	VirtualDirFileUpload    		: 2005,         //上传文件
	VirtualDirFileDownload  		: 2006,         //文件下载
	//VirtualDirBatchFileDelete   	: 2007,     //批量删除文件
	VirtualDirBatchItemDelete       : 2007,     //批量删除文件
	VirtualDirBatchFileMove 		: 2008,         //批量移动文件
	VirtualDirBatchFileCopy 		: 2009,         //批量复制文件
	VirtualDirBatchFileDownload 	: 2010,     //批量文件下载
	VirtualDirUserQuery     		: 2011,         //用户信息查询
	VirtualDirFileCopyFromOtherBid			: 2012,	//其他业务转存到微云
	VirtualDirFileCopyFromOtherBidBackend	: 2013,	//其他业务转存到微云(给后台使用)
	VirtualDirBatchItemDeleteBackend		: 2014,	//批量删除文件(给后台使用)


	//-------------------------------------------------------------------//
	//虚拟目录第三方接入server用到的命令：范围2101~2200
	AccessVirtualDirDirList         : 2101,     //返回用户已开通的所有的应用列表
	AccessVirtualDirFileUpload      : 2102,     //通用目录第三方上传文件
	AccessVirtualDirFileDownload    : 2103,     //虚拟目录的文件下载
	AccessVirtualDirBatchFileDelete : 2104,     //批量删除文件
	AccessVirtualDirFileBatchDownload   : 2105,     //文件批量下载

	//-------------------------------------------------------------------//
	//网盘用到的命令：范围2201~3000

	//查询模块
	DiskUserInfoGet                 : 2201,     //拉取信息(系统&用户信息&创建用户)
	DiskUserInfoModify              : 2202,     //修改用户信息
	DiskUserTimeStampGet            : 2204,     //拉取时间戳
	//DiskFileQuery                 : 2205,     //    文件查询
	DiskFileBatchQuery              : 2206,     //批量文件查询
	DiskFileHistoryQuery            : 2207,     //文件历史版本信息查询

	//DiskDirList                     : 2208,     //    目录列表查询
	DiskDirBatchList                : 2209,     //批量目录列表查询
	DiskDirQuery                    : 2210,     //目录查询
	DiskDirRecurTimeStamp           : 2211,     //递归查询目录时间戳
	DiskDirBatchQuery               : 2212,     //批量目录查询, 企业网盘使用
	DiskSystemKeyQuery              : 2213,     // 查询系统目录的key，企业网盘使用


	DiskUserConfigGet               : 2225,     //查询体验券数量


	//上传模块
	DiskFileUpload                  : 2301,     //文件上传请求
	DiskFileContinueUpload          : 2302,     //文件续传请求
	DiskFileOverWriteUpload         : 2303,     //文件覆盖
	//DiskFileLenUpdate             : 2304,     //更新已上传文件大小,已无用
	DiskFileBatchUpload             : 2305,     //文件批量上传
	DiskFileDataUpload              : 2311,     //数据上传伪命令，占位用

	//下载模块
	//DiskFileDownload                  : 2401,     //    文件下载(缩略图短链)
	DiskFileBatchDownload               : 2402,     //批量文件下载(缩略图短链)
	DiskFilePackageDownload             : 2403,     //打包下载
	DiskFileWeiyunSharePackageDownload  : 2404,     //外链打包下载
	DiskFileDataDownload                : 2411,     //用户文件数据下载伪命令，占位用
	DiskPicThumbDownload                : 2412,     //图片缩略图下载伪命令，占位用
	DiskVideoThumbDownload              : 2413,     //视频缩略图下载伪命令，占位用
	DiskFileDocDownloadAbs              : 2414,     //获取文件预览

	//删除模块
	//DiskFileDelete                : 2501,     //    文件删除
	//DiskFileBatchDelete           : 2502,     //批量文件删除
	//DiskDirDelete                 : 2503,     //    目录删除
	//DiskDirBatchDelete            : 2504,     //批量目录删除
	DiskDirFileBatchDelete          : 2505,     //批量目录文件删除(同一个目录下)
	DiskUserClear                   : 2506,     //关闭网盘功能
	DiskItemBatchDelete             : 2507,     //批量目录文件删除(不同目录下):安卓用的是这个命令
	DiskTempFileBatchDelete			: 2508,		//批量temp文件删除并且还原到上一个版本(不同目录下)
	DiskDirFileBatchDeleteEx        : 2509,     //批量目录文件删除

	//修改模块
	//DiskFileMove                  : 2601,     //    文件移动
	//DiskFileBatchMove             : 2602,     //批量文件移动
	DiskFileCopy                    : 2603,     //    文件复制
	DiskFileBatchCopy               : 2604,     //批量文件复制
	//DiskFileAttrModify            : 2605,     //  文件属性修改
	DiskFileBatchRename             : 2606,     //批量文件属性修改
	DiskFileRestoreVer              : 2607,     //文件历史版本恢复
	DiskFileDeleteVer               : 2608,     //文件历史版本删除

	DiskFileCopyFromOtherBid        : 2609,     //  从其他业务复制
	DiskFileBatchCopyFromOtherBid   : 2610,     //批量从其他业务复制
	DiskFileCopyToOtherBid          : 2611,     //    复制到其他业务
	DiskFileBatchCopyToOtherBid     : 2612,     //批量复制到其他业务
	DiskFileBatchCopyToOffline      : 2613,     //批量复制到离线

	DiskDirCreate                   : 2614,     //目录创建
	DiskDirAttrModify               : 2615,     //目录属性修改
	//DiskDirMove                   : 2616,     //    目录移动
	//DiskDirBatchMove              : 2617,     //批量目录移动
	DiskDirFileBatchMove            : 2618,     //批量目录文件移动:客户端目前使用
	DiskDirCreateByParents			: 2619,		//创建多层目录
	DiskDirAttrBatchModify          : 2620,     //目录属性批量修改

	//回收站操作
	//DiskRecycleUserQuery          : 2701,     //回收站用户查询
	DiskRecycleList                 : 2702,     //回收站列表查询
	DiskRecycleClear                : 2703,     //清空回收站
	//DiskRecycleDirRestore         : 2704,     //    恢复目录（内部）
	//DiskRecycleDirBatchRestore    : 2705,     //批量恢复目录
	//DiskRecycleFileRestore        : 2706,     //    恢复文件（内部）
	//DiskRecycleFileBatcheRestore  : 2707,     //批量恢复文件
	DiskRecycleDirFileBatchRestore  : 2708,     //批量恢复目录文件
	DiskRecycleDirFileClear         : 2710,     //批量彻底删除文件

	//照片库视图特殊逻辑模块
	DiskPicUpload           : 2801, //在库视图分类中上传一个照片：该命令暂时没有应用的场景
	DiskPicGroupDelete      : 2802, //库视图中删除一个分组(同时删除分组下的照片)
	DiskPicBackup           : 2803, //备份相册中图片

	//-------------------------------------------------------------------//
	//手机后台逻辑层用到的命令：范围3001~4000
	TestCellPhoneMsg        : 3001, //这个命令号用于手机端1.6版本过渡时期，PbHead+JsonBody
	CellPhoneGetConfig      : 3011, //拉配置

	//-------------------------------------------------------------------//
	//微云收藏模块中抽取链接中的图片, 然后保存到存储图片系统中
	ExtractPicAndSave       : 4001,

	//-------------------------------------------------------------------//
	//通用目录第三方server命令：范围5001-6000
	ThirdGetListByAPP       : 5001,         //
	ThirdFilePut            : 5002,         //

	//-------------------------------------------------------------------//
	//微云文件库2.0, 范围6001-7000
	/////////////////以下关于库的命令，Server内部使用的命令，客户端不需要关注///////////////////////
	LibUserCreate           : 6001,     //创建用户
	LibDirCreate            : 6002,     //目录创建
	LibFileUpload           : 6003,     //文件上传
	LibFileDel              : 6004,     //文件删除,网盘未旁路（网盘旁路批量命令）
	LibFileMove             : 6005,     //文件移动,网盘未旁路（网盘旁路批量命令）
	LibFileNameMod          : 6006,     //文件改名,网盘未旁路（网盘旁路批量命令）
	LibFileOverwrite        : 6007,     //文件覆盖上传
	LibDirDel               : 6008,     //目录删除,网盘未旁路（网盘旁路批量命令）
	LibDirMove              : 6009,     //目录移动,网盘未旁路（网盘旁路批量命令）
	LibDirNameMod           : 6010,     //目录改名
	LibDirUndel             : 6011,     //目录恢复,网盘未旁路（网盘旁路批量命令）
	LibFileFinishedPush     : 6012,     //文件完成上传通知
	LibFileUndel            : 6013,     //文件恢复,网盘未旁路（网盘旁路批量命令）
	LibUserClear            : 6014,     //关闭用户
	LibFileNameBatchMod     : 6015, 	//文件批量改名
	LibFileBatchMove        : 6016,     //文件批量移动,网盘未旁路（网盘旁路批量命令）
	LibDirBatchCreate		: 6017,		//目录批量创建

	LibDirNameBatchMod      : 6020,     //目录批量改名

	LibFileBatchDel         : 6021,     //文件批量删除,网盘未旁路（网盘旁路批量命令）
	LibDirFileBatchMove     : 6022,     //目录文件批量移动
	LibFileBatchUndel       : 6023,     //文件批量恢复,网盘未旁路（网盘旁路批量命令）
	LibDirBatchDel          : 6024,     //目录批量删除,网盘未旁路（网盘旁路批量命令）
	LibDirBatchMove         : 6025,     //目录批量移动,网盘未旁路（网盘旁路批量命令）
	LibDirBatchUndel        : 6026,     //目录批量恢复,网盘未旁路（网盘旁路批量命令）
	LibFileCopy             : 6027,     //文件复制
	LibFileBatchCopy        : 6028,     //文件批量复制,网盘未旁路（利用单条命令实现）
	LibDirFileBatchRestore  : 6029,     //目录文件批量恢复
	LibDirFileBatchDel      : 6030,     //目录文件批量删除

	LibFileContinueUpload   : 6031,     //文件续传请求
	LibFileDownload         : 6032,     //文件下载(缩略图短链)
	LibFileBatchDownload    : 6033,     //批量文件下载
	LibFilePackageDownload  : 6034,     //打包下载
	LibFileWeiyunSharePackageDownload : 6035,     //外链打包下载
	LibFileCopyFromOtherBid         : 6036,     //文件从其他业务复制
	LibFileBatchCopyFromOtherBid    : 6037,     //文件批量其他业务复制,网盘未旁路（未实现）
	LibFileCopyToOtherBid           : 6038,     //文件从复制到其他业务,网盘未旁路（未实现）
	LibFileBatchCopyToOtherBid      : 6039,     //文件批量复制到其他业务
	LibTempFileBatchDel				: 6040,     //批量删除幽灵文件恢复到上个版本

	LibCombineBatchFileUpload           : 6041,     //文件批量上传(库内部使用)
	LibCombineBatchFileDel              : 6042,     //文件批量删除(库内部使用)


	LibPwdQuery             : 6051,     //查询独立密码
	LibPwdAdd               : 6052,     //添加独立密码
	LibPwdDelete            : 6053,     //删除独立密码
	LibPwdModify            : 6054,     //修改独立密码
	LibPwdVerify            : 6055,     //校验独立密码

	//server内部使用
	LibBatchGetPicExif      : 6061,      //批量获取图片exif信息
	LibMovePicToGroup       : 6062,      //添加相片进分组
	LibFileAddStar          : 6063,      //文件加星
	LibFileRemoveStar       : 6064,      //取消加星
	LibTransPicGroup        : 6065,      // 遷移相冊分組
	LibNotifyExifInfo       : 6066,     //bice提取万照片的exif信息，旁路给lyn
	LibRebuildLib           : 6071,      // 迁移网盘



	/////////////////以上关于库的命令，Server内部使用的命令，客户端不需要关注///////////////////////

	//以下库命令终端使用
	LibListNumGet           : 6101,     //获取各种类型的数量
	LibAllListGet           : 6102,     //拉取库全量列表
	LibDiskAllListGet       : 6103,     //拉取网盘结构的全量列表
	LibLibSearch            : 6104,     //搜索
	LibPdirKeyGet           : 6105,     //获取父目录key
	LibDiffListGet          : 6106,     //拉取库增量列表
	LibDiskDiffListGet      : 6107,     //拉取网盘结构的增量列表
	LibDiskDiffDirGet       : 6108,     //拉取一个用户变化的目录
	LibGetDiffStarFile      : 6109,     //增量拉取用户加星列表:废弃，用6106代替,libid为101
	LibPicDiffListGet       : 6110,     //拉库照片分组增量列表:废弃，用6106代替,拉取下来之后自己过滤,或者拉指定groupid
	LibPageListGet          : 26111,     //按照指令排序方式分页拉取：拍摄时间/字母序/修改时间/上传时间等
	LibGetPicGroup          : 26121,     //获取相册分类中的分组数
	LibCreatePicGroup       : 26122,     //增加相册分组
	LibModPicGroup          : 26123,     //修改相册分组
	LibDeletePicGroup       : 26124,     //删除相册分组(该命令只删除分组，不删除分组下的照片。如果需要删除分组下的照片，用2802命令)

	LibGetOneGroupInfo      : 6125,     //获取某一个照片分组下的相关信息：照片数量
	LibGetDelList           : 6126,     //获取所有刪除列表---bice調用
	LibSetGroupCover		: 26127,		//设置组的封面
	LibSetGroupOrder		: 26128,		//设置组的顺序
	LibGetAllFolderInfo     : 6129,      // 获取用户所有目录,给youngky使用
	LibDirList				: 6130,		//拉目录列表，用于oz统计:旁路系统使用，终端无需关注
	LibRecycleList			: 6131,		//回收站拉列表，用于oz统计:旁路系统使用，终端无需关注
	LibRecycleClear			: 6132,		//清空回收站，用于oz统计:旁路系统使用，终端无需关注
	LibQueryBackupPhoto     : 6133,     //查询某个照片是否备份过：给bice的照片备份server使用:旁路系统使用，终端无需关注
	LibPicBatchQuery        : 6140,     //批量查询一批照片是否已经备份过

	//需要转发请求给库Dispatch
	LibBatchMovePicToGroup  : 26201,     //添加相片进分组
	LibBatchFileAddStar     : 6202,     //批量文件加星
	LibBatchFileRemoveStar  : 6203,     //批量取消加星

	//----------------------------库3.0---------------------------------------//
	Lib3DelRecentFileList   : 26300,    ////清空最近文件列表
	Lib3LibSearch           : 224101,   //搜索
	LibDirPathGet           : 26150,    //获取目录全路径
	LibImageTagGet          : 26350,     //拉取所有标签
	LibTagFileListPageGet   : 26352,//分页拉取标签下的文件。

	//-------------------------------------------------------------------//
	// 幽灵文件svr: 范围7001-8000
	UnfinFileGetList        : 7001,        // 获取未完成文件列表
	UnfinFileAddFile        : 7002,        // 添加文件，对应文件上传:marsin旁路给1.0的
	UnfinFileFileFinish     : 7003,     // 文件完成:存储的通知
	UnfinFileOverwrite      : 7004,      // 覆盖上传:marsin旁路给1.0的

	//-------------------------------------------------------------------//
	//网盘用户cache server: 范围8001-9000
	QdiskUserCacheAdd       :   8001,       //创建用户cache
	QdiskUserCacheGet       :   8002,       //获取用户cache
	QdiskUserCacheDelete    :   8003,       //删除用户cache
	QdiskUserSpaceAdd       :   8004,       //增加用户空间
	QdiskUserQQDiskDirKeyMapGet : 8005, 	//获取QQ网盘迁移到微云的根目录映射
	QdiskUserSpaceSet		: 	8006,		//设置用户空间

	//Push2.0：范围9001-10000
	PushUserLogin           :   9001,       //用户登录
	PushUserLogout          :   9002,       //用户退出
	PushHeartBeat           :   9003,       //用户心跳
	PushRecvMsg             :   9004,       //服务器推送消息

	PushInterUserLogin      :   9101,       //内部接入和cache之间通信
	PushInterUserLogout     :   9102,
	PushInterHeartBeat      :   9103,
	PushInterRecvMsg        :   9104,
	PushInterStatusInfo     :   9105,       //UserServer把状态信息（如用户数等）通知给与其连接的WyinServer

	PushInterSendMsg        :   9201,       //供其它需要推送消息给用户的server使用，推送消息给PushNotify服务

	//oidb_proxy模块：范围10001--11000  提供访问oidb的pb协议
	OidbGetUserCustomHead           : 10001,    //获取用户自己的自定义头像
	OidbGetFriendsListAndGroupInfo  : 10002,    //请求拉取好友列表与分组信息
	OidbGetFriendsInfoAndRecordName : 10003,    //请求批量拉取好友简单资料以及备注名
	OidbGetFriendsOnlineStatus      : 10004,    //请求获取好友在线状态
	OidbPushOutlinkTips             : 10005,    //发送外链tips
	OidbPushQQNetDiskTransTips      : 10006,    //QQ网盘迁移tips
	OidbGetQuickLaunchApps          : 10007,    //读取快速启动栏应用列表
	OidbGetUserInfo                 : 10008,    //获取用户资料:昵称,头像
	OidbGetQQVipInfo                : 10030,    //获取QQ会员超级会员信息
	//pwd模块：范围11001--12000
	PwdQuery                : 11001,    //查询独立密码
	PwdAdd                  : 11002,    //添加独立密码
	PwdDelete               : 11003,    //删除独立密码
	PwdModify               : 11004,    //修改独立密码
	PwdVerify               : 11005,    //校验独立密码

	//外链模块：范围12001--13000
	WeiyunShareAdd          : 12001,    //生成外链
	WeiyunShareView         : 12002,    //打开外链
	WeiyunShareDownload     : 12003,    //下载分享资源
	WeiyunShareTransStore   : 12004,    //转存分享资源：该命令暂时没有使用，可以对外链里面的文件目录选择部分带给后台
	WeiyunShareSaveData     : 12005,    //保存外链所有数据：把一个外链保存到自己的微云里面
	WeiyunShareSetMark		: 12006,	//给外链打标记：可以给外链打失效标记等信息，有些举报的外链可以这样操作
	WeiyunShareDelete		: 12007,
	WeiyunShareList         : 12008,
	WeiyunShareClear        : 12009,
	WeiyunSharePartDownload : 12023,
	WeiyunShareBatchDownload: 12024,
	WeiyunSharePartSaveData : 12025,
	WeiyunShareDocAbs       : 12030,    //外链文件预览请求

	WeiyunSharePwdView      : 12010,
	WeiyunSharePwdVerify    : 12011,
	WeiyunSharePwdCreate    : 12012,
	WeiyunSharePwdModify    : 12013,
	WeiyunSharePwdDelete    : 12014,
	WeiyunShareDirList      : 12031,
	WeiyunShareNoteView     : 12032,

	//剪贴板模块：范围13001--14000
	ClipBoardUpload         : 13001,    //上传一条剪贴板消息到云端
	ClipBoardDownload       : 13002,    //从云端下载剪贴板消息
	ClipBoardDelete         : 13003,    //从云端删除一条剪贴板消息
	ClipBoardTrans          : 13010,    //web端呼起pc端传递的待下载的文件列表和目录列表
	ClipBoardView           : 13020,    //pc端获取web端传递的文件列表和目录列表

	//微云收藏类碎片信息：范围14001--15000
	NoteAdd                 : 14001,    //添加
	NoteDelete              : 14002,    //删除
	NoteModify              : 14003,    //修改
	NoteList                : 14004,    //获取列表
	NoteDetail              : 14005,    //获取某个具体的Item详细信息
	NoteDump                : 14006,    //笔记外链转存：后台使用，终端不关注
	NotePreUpload           : 14007,    //图片申请上传
	NoteGetSummary          : 14008,    //获取摘要信息，终端不需关注
	NoteStar                : 14009,    //加星、取消加星
	DumpColToNote           : 14010,
	NotePageListGet         : 14031,    //web侧拉取笔记，采用mtime排序

	//OZ上报代理(logger_svr_v2): 范围15001--16000 ajianzheng
	//L5:114177:131072
	//15001
	OzProxyTable25          : 15002,    //上报老的后台上报--流水信息统计/已废弃
	OzProxyTable71          : 15003,    //上报老的前台上报--运营报表/已废弃
	OzProxyTable171         : 15004,    //clog客户端日志上报表
	OzProxyTable26          : 15005,    //Oz统计客户端上报/已废弃
	OzProxyTable27          : 15006,    //Oz统计后台上报/已废弃

	//
	OzProxyClog             : 15010,    //clog日志上报/完全等同15004
	OzProxyBackend          : 15011,    //微云后台上报      ————上报到dc00056表
	OzProxyClient           : 15012,    //微云客户端上报    ————上报到dc00039/dc00040/dc00041表

	OzProxyTable39          : 15020,    //微云客户端上报(dc00039)  ————微云登录接口表
	OzProxyTable40          : 15021,    //微云客户端上报(dc00040)  ————微云客户端点击流和状态设置表
	OzProxyTable41          : 15022,    //微云客户端上报(dc00041)  ————微云客户端通用行为信息、启动时长信息、安装卸载信息表

	// qq离线文件模块 ：  范围  16001--16100
	ReqRecvList             : 16001,        //>>请求接收文件列表
	ReqSendList             : 16002,        //>>请求发送文件列表
	ReqDeleteFile           : 16003,      //>>删除文件
	ReqDownloadFile         : 16004,        //>>下载文件
	ReqDownloadFileAbs      : 16005,       // 预览
	ReqFileQuery            : 16006,       //>> 查询

	//活动server: 范围 17001 -- 17999
	//17000
	WeiyunActGetActivity    : 17001,	// 拉取活动(活动&小黄条)
	WeiyunActUserLogin      : 17002,	// 用户登录:后台使用的命令
	WeiyunActFeedBack	    : 17003,	//用户反馈
	WeiyunAdd10T      : 17006,
	WeiyunCheck10T    : 17007,
	// 目录拷贝：   范围 18001--19000
	DirSetCopy              : 18001,    // 目录拷贝命令

	// 系统reserved：   范围 19001--19999

	// 我的收藏：   范围 20000--20999
	GetCollectionList       : 20000,    // 拉取收藏列表
	GetCollectionContent    : 20001,    // 拉取收藏详情
	DelCollection           : 20002,    // 删除收藏
	AddTextCollection       : 20003,    // 添加文本收藏
	AddLinkCollection       : 20004,    // 添加链接收藏
	AddGalleryCollection    : 20005,    // 添加图片收藏
	AddAudioCollection      : 20006,    // 添加语音片段收藏
	AddFileCollection       : 20007,    // 添加文件收藏
	AddLocationCollection   : 20008,    // 添加地理位置收藏
	AddRichMediaCollection  : 20009,    // 添加混排收藏
	FastUploadResource      : 20010,    // 秒传图片和文件资源
	GetCollectionCountByCatetory: 20011,    // 获取指定类型收藏的总数
	ModCollection           : 20012,    // 修改收藏
	GetCollectionFullInfo   : 20013,    // 获取收藏完整数据Collection+CollectionContent
	ApplyDownloadFile       : 20014,    // 申请文件下载信息
	GetCollectionSummary    : 20015,    // 获取收藏摘要信息
	GetCompatibleCollectionInfo : 20016, // 获取收藏信息多终端兼容格式版本,以html5排版布局
	// 微云文章使用
	GetArticleList : 20056, //拉取文章列表
	StarCollection : 20057, //加星
	UnstarCollection : 20058, //取消加星

	//小文件打包上传 zhiwenli
	MiniBatchPreUpload        : 20301,   //批量预上传
	MiniBatchDataUpload       : 20302,   //小文件批量上传数据

	// 图片平台代理: 201000--201999
	QpicFastUpload          : 201000, //秒传(包括转存)
	QpicUploadData          : 201001, //上传图片数据
	QpicDeletePic           : 201002,  //删除图片

	// qzone代理 202000--202999
	QzoneProxyGetLocation   : 202001,   // 获取地理信息

	//自动升级模块 203000--203999
	AutoUpdateGetNewVersion : 203001,

	//微博代理模块 204001--204999
	WeiboProxyShare         : 204001,   //分享到微博

	//下载外链限制cookie生成模块	205001--205999
	GetDlskey				: 205001,	//获取cookie字段
	ParseDlskey				: 205002,	//解析cookie字段

	//tp_mini    206001~206999
	FailFileAttr       		: 206001,  	//上报上传失败文件
	FailFileList       		: 206002,  	//拉取失败文件列表
	WeiyunServerList   		: 206003,  	//获取微云拦截ip列表
	TpminiQueryFileStatus 	: 206004,	//查询文件是否在失败列表中


	///name:spp_cloud_config,port:9653,desc:配置模块
	///207000~207999
	DiskConfigGet       : 207000,   ///获取网盘相关配置:计划把微云网盘等相关配置放在这里
	CloudConfigGet		: 207001,	///读用户配置
	CloudConfigSet		: 207002,	///写用户配置

	//tp_mifi 208001~208999
	MiFiQueryUserBind    : 208001, // 查询用户绑定信息
	MiFiUserBind         : 208002, // 用户绑定
	MiFiUserLogOut       : 208003, // 用户注销
	MiFiFileUploadSwitch : 208004, // 文件上传开关请求
	MiFiQueryNetTypeSupport : 208005, // MiFi支持的网络类型查询
	MiFiSwitchNet           : 208006, // MiFi的网络开关操作
	MiFiJoinInWiFi          : 208007, // MiFi加入某一个WiFi网络
	MiFiForgetWiFi          : 208008, // MiFi忘记已经加入的某个MiFi网络

	//name spp_security_svr
	SecurityCheck					: 209001,	//接入串联，判断是否黑名单等
	SecurityCaptchaCheck			: 209002,	//验证码验证
	SecurityUinBlackListAdd			: 209003,	//添加uin黑名单
	SecurityUinBlackListDelete		: 209004,	//删除uin黑名单
	SecurityUinBlackListGet			: 209005,	//查询uin黑名单
	SecurityFileBlackListAdd		: 209006,	//添加全局file黑名单
	SecurityFileBlackListDelete		: 209007,	//删除全局file黑名单
	SecurityFileBlackListGet		: 209008,	//查询全局file黑名单
	SecurityUinFileBlackListOwnerDownloadAdd	: 209009,	//添加uin的file自己下载黑名单
	SecurityUinFileBlackListOwnerDownloadDelete	: 209010,	//删除uin的file自己下载黑名单
	SecurityUinFileBlackListOtherDownloadAdd	: 209011,	//添加uin的file其他人下载黑名单
	SecurityUinFileBlackListOtherDownloadDelete	: 209012,	//删除uin的file其他人下载黑名单
	SecurityUinFileBlackListOuterLinkerAdd		: 209013,	//添加uin的file外链黑名单
	SecurityUinFileBlackListOuterLinkerDelete	: 209014,	//删除uin的file外链黑名单
	SecurityUinFileBlackListAdd					: 209015,	//删除uin的file黑名单
	SecurityUinFileBlackListDelete				: 209016,	//删除uin的file黑名单
	SecurityUinFileBlackListGet					: 209017,	//查询uin的file黑名单
	SecurityUinFileBlackListClear				: 209018,	//清除uin的file黑名单
	SecurityFileDelete							: 209019,	//删除文件（彻底删除）
	SecurityShareKeyDelete						: 209020,	//删除sharekey（彻底删除）
	SecurityFileQuery							: 209021,	//查询文件信息
	SecurityShareKeyQuery						: 209022,	//查询外链信息

	// MailToNote 210001 - 210999
	MailWhiteList : 210001, // 邮件列表操作，添加、删除、查询
	MailPostfixChecks : 210002, // 后台使用，终端不用关注. postfix 邮件头部、实体TCP表查询

	//html parser 211000-211999
	HtmlParserCollectionToHtml : 211000, //收藏转成兼容格式html
	HtmlParserHtmlToRichMedia : 211001, //html转成收藏的RichMedia格式

	//外链安全
	ShareLinkCheck          : 213000,

	//qqaccess 协议透传   214000-214999
	QqAccessTransfer           : 214000,

	//企业网盘扩展协议    215000-215999
	CopyFromOffline      : 215000,    // 离线文件转存到企业网盘
	CopyToOffline        : 215001,   	// 企业网盘转存到离线文件

	AsycBatchCopy     : 215002,    //
	AsycBatchMove     : 215003,   	//

	//guarder门卫模块: 频率限制,黑名单管理等
	//216000 ~ 216999
	GuarderCheckIn          : 216000, //来访登记

	//docview_dispatcher模块: wopi文档预览分发模块
	//217000 ~ 217999
	DocviewDispatcherGetUrl : 217000, //获取预览url

	//wopi_server: wopi服务器模块
	WopiServerCheckFileInfo : 218000, //获取文件信息
	WopiServerGetFile : 218001, //获取文件内容

	//qmail proxy223001~223999
	QmailGetAddrList			: 223001,	//拉取邮件地址列表
	QmailSendMail   			: 223002, //发送邮件

	//small iterface set 224001~224999
	GetTreeView           : 224001,//双屏列表
	GetHomeList           : 224002,//根据第三方appid 获取该第三方主目录列表
	GetHomeDirInfo        : 224003,//批量获取第三方home目录信息

	//微信支付模块使用:220001~221000
	WxCreatePayId           : 220001,   //生成付费订单
	WxQueryPayId            : 220002,   //查询订单
	WxQueryAllPay           : 220003,   //查询所有支付订单
	WxDeliver               : 220004,   //发货

	WxQueryProductInfo      : 220501,   //查询商品信息

	SmsSend                 : 243500,   //发短信

	//=============================以下为文件中转站====================================
	TemporaryFileDiskUserInfoGet                : 242201,     //
	TemporaryFileDiskFileBatchQuery             : 242206,     // 批量文件查询
	TemporaryFileDiskDirList					: 242208,     // 拉取文件列表
	TemporaryFileDiskFileUpload                 : 242301,     // 文件上传请求
	TemporaryFileDiskFileBatchDownload          : 242402,     // 批量文件下载(缩略图短链)
	TemporaryFileDiskFilePackageDownload        : 242403,     // 打包下载
	TemporaryFileDiskDirFileBatchDeleteEx		: 242509,     // 批量目录文件删除(同一个目录下)
	TemporaryFileDiskFileBatchRename            : 242606,     // 批量文件属性修改
	TemporaryFileExpiredInfoGet                 : 242901      // 查询中转站过期信息
};

var webappMap = {
	2201: '/webapp/json/wnsWyQdiskClient/DiskUserInfoGet',
	2209: '/webapp/json/wnsWyQdisk/DiskDirBatchList',
	2402: '/webapp/json/wnsWyQdiskClient/DiskFileBatchDownload',
	2509: '/webapp/json/wnsWyQdiskClient/DiskDirFileBatchDeleteEx',
	2606: '/webapp/json/wnsWyQdiskClient/DiskFileBatchRename',
	2615: '/webapp/json/wnsWyQdiskClient/DiskDirAttrModify',
	12001: '/webapp/json/wnsWyShare/WeiyunShareAdd',
	12002: '/webapp/json/wnsWyShare/WeiyunShareView',
	12024: '/webapp/json/wnsWyShare/WeiyunShareBatchDownload',
	12025: '/webapp/json/wnsWyShare/WeiyunSharePartSaveData',
	26111: '/webapp/json/wnsWyFileLibClient/LibPageListGet'
};

module.exports = {
	get: function(cmd) {
		var cmdId = cmds[cmd], url, webapp;

		if(cmdId > 2200 && cmdId < 3000) {
			//网盘
			url = 'https://user.weiyun.com/newcgi/qdisk_get.fcg';
		} else if(cmdId > 26000 && cmdId < 27000) {
			//网盘
			url = 'https://user.weiyun.com/newcgi/user_library.fcg';
		}

		if(webappMap[cmdId]) {
			webapp = webappMap[cmdId];
		}

		return {
			cmd: cmd,
			cmdId: cmdId,
			url: url,
			webapp: webapp
		};
	}
};