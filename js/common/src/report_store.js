/**
 * 上传下载store.oa.ocm上报
 * @iscowei 16-01-08 下午14:43

	reportStore = common.get('./report_stort'),
	reportStore({
		t_action: 2,
		t_err_code: 0
	});

 */
define(function(require, exports, module) {
	var query_user = require('./query_user');
	var constants = require('./constants');
	var https_tool = require('./util.https_tool');

	var cgi_url = constants.HTTP_PROTOCOL + '//p.store.qq.com/weiyun?op=all';
	cgi_url = https_tool.translate_cgi(cgi_url);

	/*
	 t_terminal	string	iOS,Android	终端类型
	 t_network	int	1：wifi 2：2G 3：3G 4：4G 5：其他	网络类型
	 t_action	int	1：download 2：upload	操作类型
	 t_err_code	int		错误码
	 t_uin	int64		UID
	 t_report_time	int	时间戳，秒	上报时间
	 t_isp	int	0：未知，1：移动，2：联通，3：电信，4：wifi	运营商类型
	 t_province	string		省份
	 t_dns_ip	string		dns解析的IP地址
	 t_client_ip	string		客户端IP地址
	 t_server_ip	string		服务端IP地址
	 t_server_port	int		服务器端口
	 t_ip_srctype	string		ip来源的类型
	 t_platform_name	string		平台系统名称
	 t_platform_ver	string		平台系统版本号
	 t_device_id	string		设备ID号
	 _app_ver	string	3.1.0.800	APP版本号
	 t_idc	string		访问IDC
	 t_referer	string		访问的来源
	 t_flow_id	string		任务ID
	 t_retry_times	int		重试次数
	 t_batch_num	int		批量文件个数
	 t_batch_id	string		批次ID
	 t_total_size	int64	字节	文件大小
	 t_url	string		url地址
	 t_file_name	string		文件名称
	 t_file_id	string		文件ID
	 t_file_size	int64	字节	文件大小
	 t_file_type	int	1：文档 2：照片 3：音频 4：视频 5：其他 	文件格式
	 t_file_md5	string		文件MD5
	 t_file_sha	string		文件SHA
	 t_file_speed	int	KB/s （（sum（t_file_size）- sum（offset））/ sum（t_extend3））	上传下载速度
	 t_file_path	string		文件路径
	 t_wait_time	int	ms	排队时间
	 t_prepare_time	int	ms	直出IP域名解析时间
	 t_conn_time	int	ms	连接耗时
	 t_send_req	int	ms	发送请求的耗时
	 t_recv_rsp	int	ms	收取到首包的耗时
	 t_recv_data	int	ms	接收数据的耗时
	 t_process_time	int	ms	数据处理的耗时
	 t_conn_num	int		链接并发数
	 t_total_delay	int	ms	总的延迟
	 t_flag	int		标志位
	 t_err_msg	string		错误信息
	 t_flash_upload	int	1：秒传 0：非秒传	是否秒传
	 t_flash_upnum	int		命中秒传的个数
	 t_is_compressed	int	1：压缩 0：非压缩	是否压缩
	 t_compressed_size	int	字节	压缩之后的大小
	 t_compressed_delay	int		压缩的延迟
	 t_ctl_packet_delay	int		控制包耗时
	 t_data_packet_dalay	int		数据包耗时
	 t_ack_packet_delay	int		发送数据到第一个进度回包的耗时
	 t_nssel_ipset	string
	 t_nsconn_step	int
	 t_extend1	string	128x128  640x640	缩略图尺寸
	 t_extend2	string	byte	续传offset
	 t_extend3	string	ms	续传耗时
	 */
	var reportStore = function(obj) {
		if(typeof(obj.t_action) == 'undefined' || typeof(obj.t_err_code) == 'undefined') {
			return;
		}

		var data = $.extend({
			't_uin': query_user.get_uin_num(),
			't_report_time': new Date(),
			't_platform_ver': window.navigator.userAgent,
			t_url: window.location.href
		}, obj);

		var conf = {
			url: cgi_url,
			type: 'post',
			data: data,
			contentType: 'text/plain',
			xhrFields: {
				withCredentials : true
			}
		};

		$.ajax(conf).done(function() {
		}).fail(function() {
		});
	};

	return reportStore;
});