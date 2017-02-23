"use strict";

var global = (getApp() || {}).global || {};
var request = require('../../common/request.js'),
	file = require('../../module/disk/file.js'),
	md = require('../../common/md.js');

var query = {},
	windowWidth = 0,
	windowHeight =  0,
	dialogTimeout = null,
	dialogCallback = null,
	shareItem,
	shareInfo,
	isHost = '',
	type = 1,
	userInfo;

	//预览文档、图片的大小限制
var	previewLimitSize = 20 * Math.pow(2, 20);

//Page()是页面的入口
Page({
	onLoad: function(option) {
		md.log("share onLoad");
		query = {
			share_key: decodeURIComponent((option || {}).share_key),
			share_name: decodeURIComponent((option || {}).share_name)
		};
	},
	onReady: function() {
		md.log('share onReady');

		var me = this;

		wx.setNavigationBarTitle({ title: '微云分享' });   //更新标题栏
		wx.getSystemInfo({
			success: function(res) {
				windowWidth = res.windowWidth;
				windowHeight = res.windowHeight;
			},
			fail: function(res) {
				windowWidth = 320;
				windowHeight = 600;	//兜底逻辑
			}
		});

		if(query.share_key && query.share_name) {
			request.webapp({
				cmd: 'WeiyunShareView',
				data: {
					os_info: 'wxa_wy',
					browser: 'wxa',
					share_key: query.share_key
				}
			}).then(function(res) {
				shareInfo = res;
				if(res.code === 0) {
					global.Wns.getUserInfo().then(function(info) {
						userInfo = info;
						me.render();
					}, function(res) {
						wx.hideToast();
						me.setData({
							shareBlankDisplay: true,
							shareBlankData: { img: '../../img/status/icon-nodir.png', title: '用户数据请求失败，请稍候重试' }
						});
					});
				} else {
					wx.hideToast();
					me.setData({
						shareBlankDisplay: true,
						shareBlankData: { img: '../../img/status/icon-nodir.png', title: res.msg }
					});
				}
			}, function(res) {
				wx.hideToast();
				me.setData({
					shareBlankDisplay: true,
					shareBlankData: { img: '../../img/status/icon-nodir.png', title: '分享页面数据请求失败，请稍候重试' }
				});
			});
		} else {
			me.setData({
				shareBlankDisplay: true,
				shareBlankData: { img: '../../img/status/icon-nodir.png', title: '分享页面无效' }
			});
		}

		//pv上报
		global.mta.rptMain();
	},
	onShow: function() {
		md.log('share onShow');
	},
	onPullDownRefresh: function() {
		wx.stopPullDownRefresh();
	},
	onShareAppMessage: function () {
		return {
			title: '微云分享',
			desc: query.share_name || '',
			path: '/page/share/index?share_key=' + encodeURIComponent(query.share_key || '') + '&share_name=' + encodeURIComponent(query.share_name || '')
		};
	},
	render: function() {
		var item,
			itemList,
			shareCount;

		var self = this;

		if(shareInfo.file_list.length) {
			itemList = file.format(shareInfo.file_list, 'file', shareInfo.pdir_key || '');
			shareCount = '分享了1个文件';
		} else if(shareInfo.dir_list.length) {
			itemList = file.format(shareInfo.dir_list, 'dir', shareInfo.pdir_key || '');
			shareCount = '分享了1个文件夹';
		}
		item = itemList[0];
		isHost = shareInfo.share_uin === userInfo.uin;
		if(item) {
			shareItem = item;
			var timeString = '00:00:00';
			if (item.is_video) {
				var totalSeconds = item.long_time / 1000,
					hourCount = 0,
					minuteCount = 0;
				if (totalSeconds >= 3600) {	//小时
					hourCount = Math.floor(totalSeconds / 3600);
					totalSeconds = totalSeconds - hourCount * 3600;
				}
				if (totalSeconds > 60) {	//分钟
					minuteCount = Math.floor(totalSeconds / 60);
					totalSeconds = totalSeconds - minuteCount * 60;	
				}
				totalSeconds = totalSeconds - 1;//实际视频长度比后台返回的少一秒
				timeString = (hourCount ? ((hourCount < 10 ? '0' + hourCount : hourCount) + ':') : '') +
							 (minuteCount < 10 ? '0' + minuteCount : minuteCount) + ':' +
							 (totalSeconds < 10 ? '0' + totalSeconds : totalSeconds);
			}

			self.setData({
				isDir: shareItem.type === 'dir',
				item : shareItem,
				shareButtonDisplay: !isHost,
				videoTimeDurning : timeString,
				shareAvator: shareInfo.share_head_image_url,
				shareNickname: shareInfo.share_nick_name,
				shareCount: shareCount,
				shareIcon: item.is_image ? item.https_thumb_url : ('../../img/ico_' + item.icon + '_small@2x.png'),
				shareName: shareInfo.share_name || '',
				shareSize: item.file_read_size || '',
				shareThumb: item.https_thumb_url ? (item.https_thumb_url + '&size=1024*1024') : item.video_thumb ? (item.video_thumb.replace(/^http:\/\/|^https:\/\//, 'https://') + '/1024') : '',
				isHost : isHost,
				width : windowWidth || 320
			});
		}
	},
	backToHome : function() {
		var url = '../index/index';
		if (isHost) {
			wx.showModal({
				title : '返回首页',
				content : '返回首页后此分享页不再保留',
				confirmText : '确定',
				cancelText : '取消',
				success : function(res) {
					if (res.confirm) {
						wx.redirectTo({	//关闭当前页面，回到首页
							url: url
						});
					}
				}
			});
		} else {
			wx.redirectTo({	//关闭当前页面，回到首页
				url: url
			});
		}
		
	},
	bindSaveTap: function() {
		var me = this;
		var dir_list = [],
			file_list = [];
		if(shareItem.type === 'dir') {
			dir_list = [{
				dir_key: shareItem.dir_key,
				pdir_key: shareItem.pdir_key
			}];
		} else {
			file_list = [{
				file_id: shareItem.file_id,
				pdir_key: shareItem.pdir_key
			}];
		}
		request.webapp({
			cmd: 'WeiyunSharePartSaveData',
			data: {
				share_key: shareInfo.share_key,
				pwd: '',
				dir_list: dir_list,
				file_list: file_list,
				note_list: []
			}
		}).then(function(res) {
			var url = '../index/index';
			if(res.code === 0) {
				wx.showModal({
					title : '保存成功',
					confirmText : '返回首页',
					cancelText : '留在此页',
					success : function(res){
						if (res.confirm) {
							wx.redirectTo({	//关闭当前页面，回到首页
								url: url
							});
						} else {
							me.setData({ type : 2 });
						}
					}
				})
				
			} else {
				me.showDialog(res.msg);
			}
		}, function(res) {
			wx.hideToast();
			me.showDialog('保存失败，请稍候重试');
		});

		global.mta.eventStat('sharesave', {});
	},
	bindThumbTap: function() {
		var self = this;
		var me   = this;
		var data = shareItem,name, size, imageSrc, image, doc, video, audio;

		name  = data.dir_name || data.filename || data.file_name;
		size  = data.file_size;
		image = data.is_image;
		doc   = data.is_doc;
		video = data.is_video;
		audio = data.is_audio;
		
		if (image) {
			var url = shareItem.https_thumb_url + '&size=1024*1024';
			wx.previewImage({
				current: url, // 当前显示图片的https链接
				urls: [url] // 需要预览的图片https链接列表
			});
		} else if (video || audio || doc) {
			if(video && !file.isPreviewVideo(data.ext)) {
				self.showDialog('微信小程序暂不支持' + data.ext + '视频文件，请安装APP播放');
				global.mta.eventStat('preview', {'videoerror': 'true'});
				return;
			}
			if(audio && size > previewLimitSize) {
				self.showDialog('防止内存占用，大于20M的音乐请安装APP播放');
				global.mta.eventStat('preview', {'audiolimit': 'true'});
				return;
			}
			if(doc && size > previewLimitSize) {
				self.showDialog('防止内存占用，大于20M的文档请安装APP查看');
				global.mta.eventStat('preview', {'doclimit': 'true'});
				return;
			}
			if(doc && data.ext === 'txt') {
				self.showDialog('微信暂不支持txt文件预览，请安装APP查看');
				global.mta.eventStat('preview', {'docerror': 'true'});
				return;
			}
			wx.showToast({title: '加载中...', icon: 'loading', duration: 10000, mask: true});
			request.webapp({
				cmd: 'WeiyunShareBatchDownload',
				data: {
					download_type: 1,
					share_key: query.share_key,
					file_list: [{
						file_id: data.file_id,
						pdir_key: data.pdir_key
					}]
				}
			}).then(function(shareDownload) {
				var fileInfo = ((shareDownload || {}).file_list || [])[0],
					download_url;
				if(shareDownload.code === 0) {
					if(fileInfo.https_download_url) {
						//如果已经有downproxy就不用再加代理域名了
						if(fileInfo.https_download_url.search('downproxy.weiyun.com') >= 0) {
							download_url = fileInfo.https_download_url.replace(/^http:\/\//, 'https://');
						} else {
							download_url = 'https://proxy.gtimg.cn/tx_tls_gate=' + fileInfo.https_download_url.replace(/^http:\/\/|^https:\/\//, '');
						}
						//打开文档要保证url最后是文件后缀名，并且后缀名是doc, xls, ppt, pdf, docx, xlsx, pptx
						download_url = download_url.replace(/(fname=[^&]+)&*(.*)/, function($0, $1, $2) {
							return ($2 === '' ? '' : $2 + '&') + $1;
						});
						if(doc) {
							//打开文档要先下载文件
							wx.downloadFile({
								url: download_url,
								success: function(res) {
									var filePath = res.tempFilePath;
									if(filePath) {
										wx.openDocument({
											filePath: filePath,
											success: function(res) {
												md.log(res);
												wx.hideToast();
											},
											fail: function(res) {
												md.log(res);
												wx.hideToast();
												me.showDialog('文档打开失败');
											}
										});
										global.mta.eventStat('preview', {'doc': 'true'});
									}
								},
								fail: function(res) {
									md.log(res);
									wx.hideToast();
									if(res.errMsg.search('exceed max file size') >= 0) {
										me.showDialog('超过支持预览的文档大小，请安装APP查看');
									} else {
										me.showDialog('文档下载失败');
									}
								}
							});
						} else if(audio) {
							wx.playBackgroundAudio({
								title: name,
								dataUrl: download_url,
								success: function(res) {
									md.log(res);
									wx.hideToast();
									//显示音乐播放栏
									me.setData({
										audioDisplay: true,
										audioName: name,
										audioStatus: true
									});
								},
								fail: function(res) {
									md.log(res);
									wx.hideToast();
									me.showDialog('音乐播放失败');
								}
							});
							global.mta.eventStat('preview', {'audio': 'true'});
						} else if(video) {
							wx.hideToast();
							md.log(download_url);
							var callback = function() {
								wx.getNetworkType({
									success: function(res){
										var network = res.networkType;
										if (network != 'wifi') {	//非wifi就需要提示用户；
											self.showDialog('确定要在非wifi下播放吗？', '确定', '取消', function() {
												me.setData({
													videoDisplay: true,
													shareThumb: false,
													show: false,
													videoName: name,
													videoSrc: download_url,
													videoWidth: windowWidth,
													videoHeight: parseInt(windowWidth * 0.75)
												});
											});
										} else {
											me.setData({
												videoDisplay: true,
												shareThumb: false,
												show: false,
												videoName: name,
												videoSrc: download_url,
												videoWidth: windowWidth,
												videoHeight: parseInt(windowWidth * 0.75)
											});
										}
									},
									fail: function() {
										me.setData({
											videoDisplay: true,
											shareThumb: false,
											show: false,
											videoName: name,
											videoSrc: download_url,
											videoWidth: windowWidth,
											videoHeight: parseInt(windowWidth * 0.75)
										});
									}
								});
							};
							if(windowWidth && windowHeight) {
								callback();
							} else {
								wx.getSystemInfo({
									success: function(res) {
										windowWidth = res.windowWidth;
										windowHeight = res.windowHeight;
										setTimeout(function() {
											callback();
										}, 200);
									}
								});
							}
							global.mta.eventStat('preview', {'video': 'true'});
						}
					} else {
						wx.hideToast();
						self.showDialog('获取资源下载链接失败');
					}
				} else {
					self.showDialog(shareDownload.msg);
				}
			}, function(res) {
				wx.hideToast();
				self.showDialog('获取分享资源下载链接失败');
			});
		}
		global.mta.eventStat('sharethumb', {});
	},
	imgLoaded : function(event){
		var imgStatus = event.detail;
		var naturalWidth = imgStatus.width,
			naturalHeight = imgStatus.height;

		if (windowHeight && windowWidth) {

		}
	},
	showDialog: function(msg, confirm, cancel, callback, timeout) {
		var me = this;
		dialogTimeout !== null && clearTimeout(dialogTimeout);
		if(callback) {
			dialogCallback = callback;
		}
		me.setData({ dialogDisplay: true, dialogText: msg, dialogButtonComfirm: confirm, dialogButtonCancel: cancel });
		if(timeout) {
			dialogTimeout = setTimeout(function() {
				me.setData({ dialogDisplay: false, dialogText: '', dialogButtonComfirm: '确定', dialogButtonCancel: '' });
			}, timeout);
		}
	},
	bindDialogConfirmTap: function(e) {
		if(dialogCallback) {
			dialogCallback();
			dialogCallback = null;
		}
		this.setData({ dialogDisplay: false, dialogText: '', dialogButtonComfirm: '确定', dialogButtonCancel: '' });
	},
	bindDialogCancelTap: function(e) {
		dialogCallback = null;
		this.setData({ dialogDisplay: false, dialogText: '', dialogButtonComfirm: '确定', dialogButtonCancel: '' });
	},
	data: {
		shareAvator: '',
		shareCount: '',
		shareIcon: '',
		shareName: '',
		shareSize: '',
		shareButtonDisplay: false,
		//dialog提示
		dialogDisplay: false,
		dialogText: '',
		dialogButtonComfirm: '确定',
		dialogButtonCancel: '',
		//空页面提示
		shareBlankDisplay: false,
		isHost : isHost,
		type : type,
		shareBlankData: { img: '../../img/status/icon-nodir.png', title: '', subTitle: '' }
	}
});