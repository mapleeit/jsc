"use strict";

var global = (getApp() || {}).global || {};
global.Wns = require('../../common/wns.js');
global.Wns.init({
	appid: 1000269,
	appName: 'weiyun',
	qua: 'V1_WXA_WY_1.0.0_0_WX_A',
	domain: 'www.weiyun.com'
});

var md = require('../../common/md.js'),
	base = require('../../common/base.js'),
	user = require('../../common/user.js'),
	request = require('../../common/request.js'),
	file = require('../../module/disk/file.js');

var	navIcon = ['all', 'doc', 'img', 'video', 'audio'],
	navTitle = ['微云', '文档', '图片', '视频', '音乐'],
	filterType = ['全部', 'DOC', 'XLS', 'PPT', 'PDF'],
	filterCurrent = 0,
    fetchDataType = 'dir',  //是拉取文件夹列表数据；或者='file'是读取文件列表
	fileBlank = [
		{ img: '../../img/status/icon-noall.png', title: '下载手机客户端添加文件', subTitle: '' },
		{ img: '../../img/status/icon-nodoc.png', title: '文档列表为空', subTitle: '分门别类查看自己的文档' },
		{ img: '../../img/status/icon-noimg.png', title: '图片列表为空', subTitle: '分门别类查看自己的图片' },
		{ img: '../../img/status/icon-novideo.png', title: '视频列表为空', subTitle: '从电脑上传视频，手机也可以播放' },
		{ img: '../../img/status/icon-noaudio.png', title: '音乐列表为空', subTitle: '从电脑上传音乐，手机也可以播放' },
		{ img: '../../img/status/icon-nodir.png', title: '文件夹是空的', subTitle: '' }
	],
	dir_key_array = [],
	windowWidth = 320,
	windowHeight = 600,
	mainVideo,
	//保存面包屑列表数据
	breadcrumbsList,
	current = 0,
    pageNum = 0,
    pageCount = 50,
	pageMax = 10,   //允许加载的最大页数，因为scroll-view底层最大只能渲染16000个节点，超过会白屏，所以要有个上限，超过不加载给提示
	//保存当前所有图片的数据，图片预览时，左右切换图片要用到
	images = [],
	//用来判断滚动加载的参照高度
	listHeight = 600,
	//防止下拉时频繁触发滚动加载
	loadMoreLock = false,
	//预览文档、播放音乐的大小限制
	documentLimitSize = 10 * Math.pow(2, 20),
	audioLimitSize = 20 * Math.pow(2, 20),
	dialogTimeout = null,
	dialogCallback = null,
	//重命名
	renameInputValue = '',
	//页面是否已完成初始化，0-未启动，1-
	pageInited = 0;

//用来保存分页中，老的数据列表；
var fileListObj = {
    '0' : {},
	'1' : {},
    '2' : {},
	'3' : {},
	'4' : {}
};

//处理加载更多，每个栏目的page记录，文档有不同的类型
var pageNumAry = {};
var hasMore = [true, true, true, true, true];

const WX_CACHE_PREFIX = 'cache_';

//Page()是页面的入口
Page({
	onLoad: function() {
		md.log('[main page]: index onLoad');
	},
	onReady: function() {
		md.log('[main page]: index onReady');

		var me = this;
		mainVideo = wx.createVideoContext('mainVideo');

		wx.showToast({title: '加载中...', icon: 'loading', duration: 10000, mask: true});
		wx.getSystemInfo({
			success: function(res) {
				windowWidth = res.windowWidth;
				windowHeight = res.windowHeight;
				me.setData({
					videoHeight: parseInt(windowWidth * 0.75)
				});

				//用户信息webapp请求
				request.webapp({
					'cmd': 'DiskUserInfoGet',
					'data': {
						'show_qqdisk_migrate': true,
						'is_get_qzone_flag': true,
						'is_get_upload_flow_flag': true,
						'is_get_weiyun_flag': true
					}
				}).then(function(data) {
					md.log('[main page]: DiskUserInfoGet success');

					global.userInfo = data;
					dir_key_array.push(data.root_dir_key);
					dir_key_array.push(data.main_dir_key);
					pageInited = 2;
					//默认进入第一个tab
					me.loader().then(function() {
						me.render();
						wx.hideToast();
					}, function() {
						md.log('[main page]: onReady loader fail');
					});
				}, function(res, code) {
					//拉取用户数据失败
					pageInited = 1;
					wx.hideToast();
					me.showDialog('数据加载失败，请稍侯重试。【拒绝授权】将无法获取微云数据，可尝试从您的小程序列表中删除微云，重新搜索进入微云并授权');
					md.log('[main page]: DiskUserInfoGet fail');
					md.write();
				});
			},
			fail: function(res) {
				md.log('[main page]: wx.getSystemInfo fail: ' + res);
				md.write();
			}
		});

		//pv上报
		global.mta.rptMain();
	},
	onShow: function() {
		md.log('[main page]: index onShow');
		if(pageInited === 1) {
			this.onReady();
		}
	},
	onPullDownRefresh: function() {
		md.log('[main page]: index onPullDownRefresh');
		wx.stopPullDownRefresh();
	},
	onHide: function() {
		wx.stopBackgroundAudio();
		this.setData({
			audioDisplay: false,
			audioName: '',
			audioStatus: false,
			videoDisplay: false,
			videoName: '',
			videoSrc: '',
			renameKey: '',
			renameDisplay: false,
			renameFocus: false,
			renameName: ''
		});
		md.log('[main page]: index onHide');
		md.write();
	},
	onUnload: function() {
		wx.stopBackgroundAudio();
		this.setData({
			audioDisplay: false,
			audioName: '',
			audioStatus: false,
			videoDisplay: false,
			videoName: '',
			videoSrc: '',
			renameKey: '',
			renameDisplay: false,
			renameFocus: false,
			renameName: ''
		});
		md.log('[main page]: index onUnload');
	},
	/*onShareAppMessage: function () {
		return {
			title: '腾讯微云',
			desc: '',
			path: '/page/index/index'
		};
	},*/
    onScroll: function (e) {
        console.info('[main page]: onScroll');
	    if(e.detail.scrollHeight - e.detail.scrollTop < listHeight * 2) {
		    this.loadMore();
	    }
    },
	//这里需要确认是否需要加载更多；比如对于图片，需要加载更多图片列表信息；
    loadMore: function () {
        var me = this,
            pageNum = 0;

        if (hasMore[current] === false || loadMoreLock) {
	        !loadMoreLock && me.setData({ loadStatus: 2 });
            return;
        }
	    console.info('[main page]: onLoadMore');

	    pageNum = me.getPageNum();
	    if(pageNum >= pageMax) {
		    me.showDialog('当前列表长度超过限制，请用微云APP查看更多文件');
		    console.info('[main page]: onloadmore pageNum limit, pageNum: ' + pageNum);
		    return;
	    }
	    loadMoreLock = true;
	    me.setData({ loadStatus: 1 });
        me.loader({
            key: current,
            start: (pageNum + 1) * pageCount,
            pageNum: pageNum + 1,
	        silence: true   //不显示toast
        }).then(function () {
	        loadMoreLock = false;
	        pageNum++;
	        me.setPageNum(pageNum);
	        me.setData({ loadStatus: 0 });
            me.render({
                more: true,
                pageNum: pageNum
            });
        }, function () {
	        loadMoreLock = false;
	        md.log('[main page]: loadMore loader fail');
        });

	    var param = {};
	    if(current.toString().length === 1) {
		    param[navIcon[current]] = 'true';
		    global.mta.eventStat('loadmore', param);
	    }
    },
	//设置当前页码
	setPageNum: function(pageNum) {
		//这里current有时候会是某个文件夹的key，不一定是nav；
		pageNumAry[current] = pageNum;
	},
	//获取当前页码
	getPageNum: function() {
		var pageNum;
		//这里current有时候会是某个文件夹的key，不一定是nav；
		if (pageNumAry[current] !== undefined) {
			pageNum = pageNumAry[current];
		} else {
			pageNum = pageNumAry[current] = 0;
		}
		return pageNum;
	},
    //@todo: 如果是有filter，如何处理分页加载更多呢？
	loader: function(opt) {
		opt = opt || {};
		var me = this;
		var option, name = '';
		var key = opt.key || current,
            start = opt.start || 0,
            count = opt.count || pageCount,
			pageNum = opt.pageNum || 0;

		md.log('[main page]: loader request, current page: ' + current + ' start: ' + start + ', count: ' + count + ', pageNum: ' + pageNum);
		switch(key) {
			case 0:
				//网盘
				option = {
					cmd: 'DiskDirBatchList',
					data: {
						dir_list: [{
							get_type: 0,            // int,拉取列表类型：0:所有,1:目录2:文件,其他所有
							start: start,           // int,偏移量
							count: count,           // int,分页大小, 最大1000个（但如果要返回摘要文件url, 则最大只能100个）
							sort_field: 2,          // int,排序类型，默认采用名字字母排序
							reverse_order: false,   // bool,true=逆序)
							get_abstract_url: true  // 返回图片/视频的缩略图url
						}]
					}
				};
				fetchDataType = 'dir';
				break;
			case 1:
			case 'filter_0':
			case 'filter_1':
			case 'filter_2':
			case 'filter_3':
			case 'filter_4':
				//文档
				option = {
					cmd: 'LibPageListGet',
					data: {
						offset: start,
						count: count,
						sort_type: 1,
						group_id: (key === 1 || key === 'filter_0') ? 0 : parseInt(key.substr(-1)),
						lib_id: 1
					}
				};
                fetchDataType = 'file';
				break;
			case 2:
				//图片
				option = {
					cmd: 'LibPageListGet',
					data: {
						offset: start,
						count: count,
						sort_type: 1,
						group_id: 0,
						lib_id: 2,
						get_abstract_url: true
					}
				};
                fetchDataType = 'file';
				break;
			case 3:
				//视频
				option = {
					cmd: 'LibPageListGet',
					data: {
                        offset: start,
                        count: count,
						sort_type: 1,
						group_id: 0,
						lib_id: 4
					}
				};
                fetchDataType = 'file';
				break;
			case 4:
				//音乐
				option = {
					cmd: 'LibPageListGet',
					data: {
                        offset: start,
                        count: count,
						sort_type: 1,
						group_id: 0,
						lib_id: 3
					}
				};
                fetchDataType = 'file';
				break;
			default:
				//文件夹
				option = {
					cmd: 'DiskDirBatchList',
					data: {
						dir_list: [{
							get_type: 0,            // int,拉取列表类型：0:所有,1:目录2:文件,其他所有
							start: start,               // int,偏移量
							count: count,             // int,分页大小, 最大1000个（但如果要返回摘要文件url, 则最大只能100个）
							sort_field: 1,          // int,排序类型，默认采用名字字母排序
							reverse_order: true,   // bool,true=逆序)
							get_abstract_url: true,  // 2016.07.04 add by iscowei 返回图片/视频的缩略图url
							dir_key: key,
							dir_name: name
						}]
					}
				};
                fetchDataType = 'dir';
				break;
		}

		return new global.Promise(function(resolve, reject) {
			!opt.silence && wx.showToast({title: '加载中...', icon: 'loading', duration: 10000, mask: true});
			request.webapp(option).then(function(res) {
				var data = me.handleData(res);
                if (pageNum) {   //用来拉取新分页的数据
                    global['navData']['new_' + key] = data;
                } else {
                    global['navData'][key] = data;
                }
				resolve(data);
			}, function(res) {
				md.log('[main page]: get nav[' + key + '] data fail');
				md.write();
				wx.hideToast();
				!opt.silence && me.showDialog('数据加载失败');
				reject(res);
			});
		});
	},

    /**
     * 处理webapp返回的数据；总体思路是返回文件列表，文件夹列表；
     * 和文件夹总数及文件总数;
     * 经过分析了2个webapp请求的结构体，总体发现了某个文件的数据结构是一致的；
     * 拉取某个文件夹：结构体如下：
     *      {
     *          dir_list : [{
     *              dir_list            : [item, item...],
     *              file_list           : [fileObj, fileObj...],
     *              total_dir_count     : xxx,
     *              total_file_count    : xxx,
     *              hide_dir_count      : xxx,
     *              hide_file_count     : xxx,
     *          }]
     *      }
     *
     *  拉取某个文件列表：结构体如下：
     *      {
     *          FileItem_items  : [fileObj, fileObj...],
     *          total_number    : xxx
     *      }
     *
     * @param res
     * @return array
     */
    handleData: function(res) {
        var data,
	        dirList = [], fileList = [],
	        dirCount, fileCount,
	        pdir_key, ppdir_key;

        if (fetchDataType == 'dir') {
            data        = (res.dir_list || [])[0] || {};
	        for(var i=0, len=dir_key_array.length; i<len; i++) {
		        if(dir_key_array[i] !== data.pdir_key) {
			        if(i + 1 >= len) {
				        pdir_key = data.pdir_key;
				        ppdir_key = dir_key_array[i];
				        dir_key_array.push(data.pdir_key);
			        }
		        } else {
			        pdir_key = dir_key_array[i];
			        ppdir_key = dir_key_array[i-1];
			        break;
		        }
	        }
            dirList     = file.format(data.dir_list || [], 'dir', pdir_key, ppdir_key);
            fileList    = file.format(data.file_list || [], 'file', pdir_key, ppdir_key);
            dirCount    = data.total_dir_count;
            fileCount   = data.total_file_count;
        } else if (fetchDataType == 'file') {
            dirList   = [];
            fileList  = file.format(res.FileItem_items || [], 'file');
            dirCount  = 0;
            fileCount = res.total_number;
        }

        return {
            dirList: dirList,
            fileList: fileList,  //这里为了测试加载更多
            dirLength : dirCount,
            fileLength : fileCount
        };
    },

    /**
     *
     * @param @opt
     *  type 拉取列表类型：0:所有,1:目录 2:文件,其他所有
     *  more 是否为拉取更多的数据；这样需要合并数据
     */
	render: function(opt) {
	    var me = this;
	    opt = opt || {};
        var extend = opt.extend || {},
	        filter,
            needFilter = false,
	        breadcrumbsDisplay,
            filterObj = {
                dirList : [],
                fileList : [],
                dirLength : 0,
                fileLength : 0
            };

        var pageNum = opt.pageNum || 0,
	        pageData = global.navData[current] || {},    //默认是首页
	        currentPageData = {},
	        i, len;

        //判断是否要做文档过滤
        if(me.isNav(1) && filterCurrent > 0 && pageData.fileList && pageData.fileList.length) {
            needFilter = true;
	        filter = filterType[filterCurrent];
        }

	    md.log('[main page]: render, current: ' + current + ', pageNum: ' + pageNum + ', filterCurrent: ' + filterCurrent + ', needFilter: ' + needFilter + ', more: ' + !!opt.more);

	    //判断是否增量更新
        if (opt.more) {
            currentPageData = global.navData['new_' + current] || {};
            pageData = {
                dirList     : pageData.dirList.concat(currentPageData.dirList || []),
                fileList    : pageData.fileList.concat(currentPageData.fileList || []),
                dirLength   : pageData.dirLength,
                fileLength  : pageData.fileLength
            };

            //分页数据上面处理合并后，在这里写入缓存
            global.navData[current] = pageData;
        }

	    if (pageData.dirList.length == pageData.dirLength && pageData.fileList.length == pageData.fileLength) {
		    hasMore[current] = false;
		    extend.loadStatus = 2;
	    } else {
		    hasMore[current] = true;
		    extend.loadStatus = 0;
	    }

	    //更新面包屑
	    var newBreadcrumbsList = [{name: '微云', unique: 'root'}];
	    if(current.toString().length === 1) {
		    //tab只有首页展示面包屑
		    breadcrumbsDisplay = me.isNav(0);
		    breadcrumbsList = [{name: '微云', unique: 'root'}];
	    } else if(current.toString().search('filter_') === -1) {
		    //文件夹都要展示
		    breadcrumbsDisplay = true;
		    for(i=0, len=breadcrumbsList.length; i<len; i++) {
			    if(breadcrumbsList[i].unique === current) {
				    newBreadcrumbsList.push(breadcrumbsList[i]);
				    break;
			    } else {
				    if(i > 0) {
					    newBreadcrumbsList.push(breadcrumbsList[i]);
				    }
				    if(i >= len-1) {
					    newBreadcrumbsList.push({ name: opt.breadcrumb, unique: current });
				    }
			    }
		    }
		    breadcrumbsList = newBreadcrumbsList;
	    }

	    listHeight = windowHeight - ((me.isNav(0) || current.toString().length === 32) ? 133 : (me.isNav(1) ? 148 : 107));
	    var param = {
		    dialogDisplay: false,
		    breadcrumbsDisplay: breadcrumbsDisplay,
		    breadcrumbsList: breadcrumbsList,
		    filterDisplay: me.isNav(1),
		    height: listHeight  //顶部高度为50px；
	    };

	    if (needFilter) {
		    //过滤文档数据
		    filterObj['fileList'] = file.filter(pageData['fileList'], filter);
		    filterObj['fileLength'] = filterObj['fileList'].length;
	    } else {
		    //生成图片数据
		    images = file.filter(pageData.fileList, 'image');
	    }

	    base.extend(param, pageData);
	    base.extend(param, extend);
	    me.setData(param);
	    wx.hideToast();
	},
	isNav: function(index) {
		if(current.toString().length === 32) {
			return false;
		}
		if(current.toString().search('filter') >= 0 && index === 1) {
			return true;
		}
		return parseInt(current) === index;
	},
	bindNavTap: function(e) {
		var me = this;
		var dataset = (e.currentTarget || {}).dataset || {},
			index = parseInt(dataset.index),
			param = {},
			navList = [],
			navItem,
			filterList = [],
			filterItem,
			extend = { scrollTop: 0 },
			i;
		if(current !== index && typeof index !== undefined) {
			current = index;
			for(i=0; i<5; i++) {
				navItem = {
					unique: 'nav_' + i,
					act: index === i ? 'act' : '',
					img: '../../img/nav-' + navIcon[i] + (index === i ? '-act' : '') + '@2x.png',
					border: index === i
				};
				navList.push(navItem);
			}
			extend.navList = navList;

			if(current === 1) {
				for(i = 0; i < 5; i++) {
					filterItem = {
						unique: 'filter_' + i,
						act: i === 0 ? 'act' : '',
						type: filterType[i]
					};
					filterList.push(filterItem);
				}
				extend.filterList = filterList;
			}

			wx.setNavigationBarTitle({ title: navTitle[current] || navTitle[0] });   //更新标题栏
			me.setPageNum(0);
			me.loader().then(function() {
				me.render({
					extend: extend,
					type: 2
				});
			}, function() {
				md.log('[main page]: bindNavTap loader fail');
			});

			param[navIcon[current]] = 'true';
			global.mta.eventStat('navtap', param);
		}
	},
	bindFilterTap: function(e) {
		var dataset = (e.currentTarget || {}).dataset || {},
			index = parseInt(dataset.index),
			filterList = [],
			filterItem;

		var me = this;

		if(typeof index !== undefined && index !== filterCurrent) {
			filterCurrent = index;
			for(var i=0; i<5; i++) {
				filterItem = {
					unique: 'filter_' + i,
					act: index === i ? 'act' : '',
					type: filterType[i]
				};
				filterList.push(filterItem);
			}
			current = 'filter_' + filterCurrent;
			me.setData({ loadStatus: 1, filterList: filterList });
			me.loader().then(function () {
				me.setData({ loadStatus: 0 });
				me.render({
					extend: { scrollTop: 0 }
				});
			}, function () {
				md.log('[main page]: bindFilterTap loader fail');
			});
		}
	},
	catchOpTap: function(e) {
		var me = this;
		var dataset = (e.currentTarget || {}).dataset || {},
			index = dataset.index,
			key = dataset.key,
			data = file.getStore(key),
			animation = wx.createAnimation({
				duration: 300,
				timingFunction: 'linear'
			}),
			animation2 = wx.createAnimation({
				duration: 300,
				timingFunction: 'linear'
			}),
			pageData = {
				dirList: me.data.dirList,
				fileList: me.data.fileList
			},
			nodeList, node, i, len;

		if(!data) {
			return;
		}

		animation2.height(56).step();
		for(i=0, len=pageData.dirList.length; i<len; i++) {
			node = pageData.dirList[i];
			//判断是交互的文件结点，就改变操作栏的状态; 不是交互结点，并且操作栏是展开的，就隐藏掉
			if(data.type === 'dir' && node.dir_key === key) {
				if(node.opStatus) {
					animation.height(56).step();
					node.opStatus = false;
				} else {
					animation.height(92).step();
					node.opStatus = true;
				}
				node.opAnimationData = animation.export();
				file.setStore(node);
				md.log('[main page]: catchOpTap, key: ' + key + ', index: ' + index + ', opStatus: ' + node.opStatus);
			} else if(node.opStatus) {
				node.opStatus = false;
				node.opAnimationData = animation2.export();
				file.setStore(node);
			}
		}

		for(i=0, len=pageData.fileList.length; i<len; i++) {
			node = pageData.fileList[i];
			//判断是交互的文件结点，就改变操作栏的状态; 不是交互结点，并且操作栏是展开的，就隐藏掉
			if(data.type !== 'dir' && node.file_id === key) {
				if(node.opStatus) {
					animation.height(56).step();
					node.opStatus = false;
				} else {
					animation.height(92).step();
					node.opStatus = true;
				}
				node.opAnimationData = animation.export();
				file.setStore(node);
				md.log('[main page]: catchOpTap, key: ' + key + ', index: ' + index + ', opStatus: ' + node.opStatus);
			} else if(node.opStatus) {
				node.opStatus = false;
				node.opAnimationData = animation2.export();
				file.setStore(node);
			}
		}

		me.setData(pageData);
		global.navData[current].dirList = pageData.dirList;
		global.navData[current].fileList = pageData.fileList;
	},
	bindItemTap: function(e) {
		var me = this;
		var dataset = (e.currentTarget || {}).dataset || {},
			key = dataset.key,
			data = file.getStore(key),
			type, pdir, name, size, imageSrc, image, doc, video, audio;

		if(!data) {
			return;
		}

		type = data.type;
		pdir = data.pdir_key;
		name = data.dir_name || data.filename;
		size = data.file_size;
		image = data.is_image;
		doc = data.is_doc;
		video = data.is_video;
		audio = data.is_audio;

		if(type === 'dir') {
			current = key;      //修改了当前的current
			wx.setNavigationBarTitle({ title: name || navTitle[0] });   //更新标题栏
			me.loader().then(function() {
				me.render({ breadcrumb: name });
			}, function() {
				md.log('[main page]: bindItemTap dir loader fail');
			});
			global.mta.eventStat('preview', {'dir': 'true'});
		} else if(image) {
			imageSrc = ((data.ext_info || {}).https_url || '') + '&size=1024*1024';
			if(images && images.length) {
				md.log('[main page]: preview image: ' + imageSrc);
				wx.previewImage({
					current: imageSrc, // 当前显示图片的https链接
					urls: images // 需要预览的图片https链接列表
				});
				global.mta.eventStat('preview', {'img': 'true'});
			}
		} else if(video || audio || doc) {
			if(video && !file.isPreviewVideo(data.ext)) {
				me.showDialog('微信小程序暂不支持' + data.ext + '视频文件，请用微云APP播放');
				global.mta.eventStat('preview', {'videoerror': 'true'});
				return;
			}
			if(audio && size > audioLimitSize) {
				me.showDialog('防止内存占用，大于20M的音乐请用微云APP播放');
				global.mta.eventStat('preview', {'audiolimit': 'true'});
				return;
			}
			if(doc && size > documentLimitSize) {
				me.showDialog('微信小程序暂不支持大于10M的文档预览，请用微云APP查看');
				global.mta.eventStat('preview', {'doclimit': 'true'});
				return;
			}
			if(doc && data.ext === 'txt') {
				me.showDialog('微信暂不支持txt文件预览，请用微云APP查看');
				global.mta.eventStat('preview', {'docerror': 'true'});
				return;
			}
			wx.showToast({title: '加载中...', icon: 'loading', duration: 10000, mask: true});
			request.webapp({
				cmd: 'DiskFileBatchDownload',
				data: {
					download_type: 1,
					file_list: [{
						file_id: key,
						filename: name,
						pdir_key: pdir
					}]
				}
			}).then(function(res) {
				var fileInfo = ((res || {}).file_list || [])[0] || {},
					download_url;
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
						md.log('[main page]: document download: ' + download_url);
						wx.downloadFile({
							url: download_url,
							success: function(res) {
								var filePath = res.tempFilePath;
								if(filePath) {
									wx.openDocument({
										filePath: filePath,
										success: function(res) {
											wx.hideToast();
											md.log('[main page]: wx.openDocument success: ' + res);
										},
										fail: function(res) {
											wx.hideToast();
											me.showDialog('文档打开失败');
											md.log('[main page]: wx.openDocument fail: ' + res);
										}
									});
									global.mta.eventStat('preview', {'doc': 'true'});
								}
							},
							fail: function(res) {
								wx.hideToast();
								if(res.errMsg.search('exceed max file size') >= 0) {
									me.showDialog('超过支持预览的文档大小（10M），请用微云APP查看');
								} else {
									me.showDialog('文档下载失败');
								}
								md.log('[main page]: wx.downloadFile fail: ' + (res.errMsg || res));
							}
						});
					} else if(audio) {
						wx.playBackgroundAudio({
							title: name,
							dataUrl: download_url,
							success: function(res) {
								wx.hideToast();
								//显示音乐播放栏
								me.setData({
									audioDisplay: true,
									audioName: name,
									audioStatus: true,
									videoDisplay: false,
									videoName: '',
									videoSrc: ''
								});
								md.log('[main page]: wx.playBackgroundAudio success: ' + res);
							},
							fail: function(res) {
								wx.hideToast();
								me.showDialog('音乐播放失败');
								md.log('[main page]: wx.playBackgroundAudio fail: ' + res);
							}
						});
						global.mta.eventStat('preview', {'audio': 'true'});
					} else if(video) {
						wx.hideToast();
						me.setData({
							videoDisplay: true,
							videoName: name,
							videoSrc: download_url,
							audioDisplay: false,
							audioName: '',
							audioStatus: false
						});
						md.log('[main page]: play video: ' + download_url);
						global.mta.eventStat('preview', {'video': 'true'});
					}
				} else {
					wx.hideToast();
					me.showDialog('下载链接获取失败，请重试');
					md.log('[main page]: https_download_url empty, key: ' + key + ', name: ' + name + ', size: ' + size + ', pdir: ' + pdir);
					md.write();
				}
			}, function(res) {
				wx.hideToast();
				me.showDialog('下载链接获取失败，请重试');
				md.log('[main page]: https_download_url request fail, key: ' + key + ', name: ' + name + ', size: ' + size + ', pdir: ' + pdir);
				md.write();
			});
		}
	},
	bindVideoMaskTap: function(e) {
		this.setData({
			videoDisplay: false,
			videoName: '',
			videoSrc: ''
		});
		wx.stopBackgroundAudio();
	},
	bindVideoError: function(e) {
		this.setData({
			videoDisplay: false,
			videoName: '',
			videoSrc: ''
		});
		this.showDialog('微信小程序不支持该视频格式，请用微云APP播放');
	},
	audioStop: function(e) {
		wx.stopBackgroundAudio();
		this.setData({
			audioDisplay: false,
			audioName: '',
			audioStatus: false
		});
		global.mta.eventStat('audioplay', {'stop': 'true'});
	},
	audioChangeStatus: function(e) {
		var me = this;
		wx.getBackgroundAudioPlayerState({
			success: function(res) {
				if(res.status === 1) {
					wx.pauseBackgroundAudio();
					global.mta.eventStat('audioplay', {'pause': 'true'});
				} else {
					wx.playBackgroundAudio();
					global.mta.eventStat('audioplay', {'continue': 'true'});
				}
				me.setData({
					audioStatus: !res.status
				});
			},
			fail: function(res) {}
		})
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
	imageError: function(e) {
		md.log('[main page]: image error: ' + e.detail.errMsg);
	},
	bindBreadcrumbTap: function(e) {
		var me = this;
		var dataset = (e.currentTarget || {}).dataset || {},
			key = dataset.key,
			name = dataset.name;
		if((key === 'root' && current !== 0) || (key !== 'root' && key !== current)) {
			current = key === 'root' ? 0 : key;
			wx.setNavigationBarTitle({ title: name || navTitle[0] });   //更新标题栏

			if(current.toString().length === 1) {
				me.setPageNum(0);
				me.loader().then(function() {
					me.render({
						breadcrumb: name,
						extend: { scrollTop: 0 }
					});
				}, function() {
					md.log('[main page]: bindBreadcrumbTap loader fail');
				});
			} else {
				me.loader().then(function() {
					me.render({
						breadcrumb: name,
						extend: { scrollTop: 0 }
					});
				}, function() {
					md.log('[main page]: bindBreadcrumbTap loader fail');
				});
			}
			global.mta.eventStat('breadcrumbtap', {});
		}
	},
	catchShareTap: function(e) {
		var me = this;
		var dataset = (e.currentTarget || {}).dataset || {},
			key = dataset.key,
			data = file.getStore(key),
			type, pdir, name, dir_key, file_id;

		if(!data) {
			return;
		}

		type = data.type;
		pdir = data.pdir_key;
		name = data.dir_name || data.filename;
		if(type === 'dir') {
			dir_key = [key];
			file_id = [];
		} else {
			dir_key = [];
			file_id = [key];
		}

		wx.showToast({title: '创建分享页...', icon: 'loading', duration: 10000, mask: true});

		request.webapp({
			cmd: 'WeiyunShareAdd',
			data: {
				pdir_key: pdir,
				dir_key: dir_key,
				file_id: file_id,
				share_name: name,
				//0表示原始外链，2表示笔记分享，3表示单文件临时外链分享（外链有效期5分钟）
				//4表示笔记临时外链分享，5表示收藏分享, 6表示临时收藏分享, 11表示不同目录多个文件批量分享
				share_type: 0
			}
		}).then(function(res) {
			var url;
			//share_key, share_name
			wx.hideToast();
			if(res && res.share_key && res.share_name) {
				url = '../share/index?share_key=' + encodeURIComponent(res.share_key) + '&share_name=' + encodeURIComponent(res.share_name);
				md.log('[main page]: navigate to share page: ' + url);
				wx.navigateTo({
					url: url
				});
			} else {
				me.showDialog('创建分享页失败，请稍候重试');
			}
		}, function(res) {
			wx.hideToast();
			me.showDialog('分享请求失败，请稍候重试');
		});

		global.mta.eventStat('share', {});
	},
	catchMoveTap: function(e) {
		var me = this;
		var dataset = (e.currentTarget || {}).dataset || {},
			key = dataset.key,
			data = file.getStore(key),
			name;

		if(!data) {
			return;
		}

		global.mta.eventStat('move', {});
	},
	catchRenameTap: function(e) {
		var me = this;
		var dataset = (e.currentTarget || {}).dataset || {},
			key = dataset.key,
			data = file.getStore(key),
			name;

		if(!data) {
			return;
		}

		name = data.dir_name || data.filename;

		this.setData({
			renameKey: key,
			renameDisplay: true,
			renameFocus: true,
			renameName: name
		});

		global.mta.eventStat('rename', {'tap': 'true'});
	},
	catchRemoveTap: function(e) {
		var me = this;
		var dataset = (e.currentTarget || {}).dataset || {},
			key = dataset.key,
			data = file.getStore(key),
			option = {};

		if(!data) {
			return;
		}

		if(data.type === 'dir') {
			option = {
				dir_list: [{
					ppdir_key: data.ppdir_key,
					pdir_key: data.pdir_key,
					dir_key: data.dir_key,
					dir_name: data.dir_name
				}]
			};
		} else {
			option = {
				file_list: [{
					ppdir_key: data.ppdir_key,
					pdir_key: data.pdir_key,
					file_id: data.file_id,
					filename: data.filename
				}]
			};
		}

		me.showDialog('确定要删除' + (data.type === 'dir' ? '文件夹' : '文件') + '吗？', '确定', '取消', function() {
			wx.showToast({title: '正在删除...', icon: 'loading', duration: 10000, mask: true});
			request.webapp({
				cmd: 'DiskDirFileBatchDeleteEx',
				data: option
			}).then(function(res) {
				wx.hideToast();
				//更新数据
				me.loader().then(function() {
					me.render();
				}, function() {
					md.log('[main page]: catchRemoveTap reload fail');
				});
			}, function(res) {
				wx.hideToast();
				me.showDialog('删除请求失败，请稍候重试');
				renameInputValue = '';
			});

			global.mta.eventStat('remove', {'confirm': 'true'});
		});

		global.mta.eventStat('remove', {'tap': 'true'});
	},
	bindReNameInput: function(e) {
		renameInputValue = e.detail.value;
	},
	bindReNameConfirm: function(e) {
		var me = this;
		var dataset = (e.currentTarget || {}).dataset || {},
			key = dataset.key,
			data = file.getStore(key),
			pageData = global.navData[current],
			node, cmd, option = {}, i, len;

		this.setData({
			renameKey: '',
			renameDisplay: false,
			renameFocus: false,
			renameName: ''
		});

		if(!data) {
			return;
		}

		if(!renameInputValue || renameInputValue === data.dir_name) {
			return;
		}

		if(data.type === 'dir') {
			cmd = 'DiskDirAttrModify';
			option = {
				ppdir_key: data.ppdir_key,
				pdir_key: data.pdir_key,
				dir_key: data.dir_key,
				dst_dir_name: renameInputValue,
				src_dir_name: data.dir_name
			};
			for(i=0, len=pageData.dirList.length; i<len; i++) {
				node = pageData.dirList[i];
				if(node.dir_key === data.dir_key) {
					break;
				}
			}
		} else {
			cmd = 'DiskFileBatchRename';
			option = {
				ppdir_key: data.ppdir_key,
				pdir_key: data.pdir_key,
				file_list: [{
					file_id: data.file_id,
					filename: renameInputValue,
					src_filename: data.filename
				}]
			};
			for(i=0, len=pageData.fileList.length; i<len; i++) {
				node = pageData.fileList[i];
				if(node.file_id === data.file_id) {
					break;
				}
			}
		}

		wx.showToast({title: '重命名文件...', icon: 'loading', duration: 10000, mask: true});

		request.webapp({
			cmd: cmd,
			data: option
		}).then(function(res) {
			wx.hideToast();
			//更新数据
			if(data.type === 'dir') {
				node.dir_name = renameInputValue;
				data.dir_name = renameInputValue;
			} else {
				node.filename = renameInputValue;
				data.filename = renameInputValue;
			}
			file.setStore(data);
			renameInputValue = '';
			me.render();
		}, function(res) {
			wx.hideToast();
			me.showDialog('重命名请求失败，请稍候重试');
			renameInputValue = '';
		});

		global.mta.eventStat('rename', {'confirm': 'true'});
	},
	bindReNameMaskTap: function(e) {
		this.setData({
			renameKey: '',
			renameDisplay: false,
			renameFocus: false,
			renameName: ''
		});
	},
	data: {
		//导航
		navList: [
			{ unique: 'nav_0', act: 'act', img: '../../img/nav-all-act@2x.png', border: true },
			{ unique: 'nav_1', act: '', img: '../../img/nav-doc@2x.png', border: false },
			{ unique: 'nav_2', act: '', img: '../../img/nav-img@2x.png', border: false },
			{ unique: 'nav_3', act: '', img: '../../img/nav-video@2x.png', border: false },
			{ unique: 'nav_4', act: '', img: '../../img/nav-audio@2x.png', border: false }
		],
		//面包屑
		breadcrumbsDisplay: true,
		breadcrumbsList: breadcrumbsList,
		//文档类型过滤
		filterDisplay: false,
		filterList: [
			{ unique: 'filter_0', act: 'act', type: '全部' },
			{ unique: 'filter_1', act: '', type: 'DOC' },
			{ unique: 'filter_2', act: '', type: 'XLS' },
			{ unique: 'filter_3', act: '', type: 'PPT' },
			{ unique: 'filter_4', act: '', type: 'PDF' }
		],
		//文件列表
		fileListDisplay: false,
		dirList: [],
		fileList: [],
		//重命名
		renameKey: '',
		renameDisplay: false,
		renameFocus: false,
		renameName: '',
		//视频
		videoDisplay: false,
		videoName: '',
		videoSrc: '',
		videoHeight: 240,
		//音乐
		audioDisplay: false,
		audioName: '',
		audioStatus: false,
		//空页面
		fileBlankDisplay: true,
		fileBlankData: { img: '../../img/status/icon-noall.png', title: '下载手机客户端添加文件', subTitle: '' },
		//dialog提示
		dialogDisplay: false,
		dialogText: '',
		dialogButtonComfirm: '确定',
		dialogButtonCancel: '',
		//加载更多的状态提示
		loadStatus: 0
	}
});