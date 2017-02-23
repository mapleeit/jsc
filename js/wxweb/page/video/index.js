"use strict";

var md = require('../../common/md.js');
var query,
	windowWidth,
	windowHeight,
	dialogTimeout = null,
	dialogCallback = null;

Page({
	onLoad: function(option) {
		md.log("media onLoad");
		option = option || {};
		query = {
			video_src: decodeURIComponent(option.video_src),
			video_name: decodeURIComponent(option.video_name),
			video_cover: decodeURIComponent(option.video_cover),
			long_time: option.long_time
		};
	},
	onReady: function() {
		md.log('video onReady');
		var me = this;
		var videoHeight = 300;

		if(query && query.video_name) {
			wx.setNavigationBarTitle({ title: query.video_name });   //更新标题栏
		}

		var timeString = '00:00:00';
		if (query.long_time) {
			var totalSeconds = query.long_time / 1000,
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

		wx.getSystemInfo({
			success: function(res) {
				windowWidth = res.windowWidth;
				windowHeight = res.windowHeight;
				videoHeight = parseInt(windowWidth * 0.75);
				me.setData({
					videoCover: query.video_cover,
					videoHeight: parseInt(windowWidth * 0.75),
					videoMargin: parseInt(-videoHeight / 2),
					videoTimeDurning: timeString
				});
			},
			fail: function(res) {
				md.log('[main page]: wx.getSystemInfo fail: ' + res);
				md.write();
			}
		});
	},
	onShow: function() {
		md.log('video onShow');
	},
	onPullDownRefresh: function() {
		wx.stopPullDownRefresh();
	},
	bindThumbTap: function() {
		var me = this;
		if(!this.data.videoPlay) {
			md.log('[video page]: bindThumbTap');
			wx.getNetworkType({
				success: function(res){
					var network = res.networkType;
					md.log('[video page]: network: ' + network);
					if (network != 'wifi') {	//非wifi就需要提示用户；
						me.showDialog('确定要在非wifi下播放吗？', '确定', '取消', function() {
							me.playVideo();
						});
					} else {
						me.playVideo();
					}
				},
				fail: function() {
					me.playVideo();
				}
			});
		}
	},
	playVideo: function() {
		md.log('[video page]: playVideo: ' + query.video_src);
		this.setData({
			videoPlay: true,
			videoSrc: query.video_src
		});
	},
	bindVideoError: function() {

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
		videoSrc: '',
		videoCover: '',
		videoName: '',
		videoTimeDurning: '12:34',
		videoHeight: 300,
		videoMargin: 150,
		videoPlay: false
	}
});