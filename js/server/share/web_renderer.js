/**
 * 渲染模块
 * @type {exports}
 */
var tmpl = require('./tmpl');
module.exports = {

    collector: function(data, raw) {
        var headerInfo = this.getHeaderInfo(raw);
        headerInfo.title = 'QQ收藏';
        data.type = 'collector';
        return this.baseHeader(headerInfo) + tmpl.webCollector(data) + this.baseBottom(raw);
    },

    note: function(data) {
        var noteInfo = data['item'] && data['item']['item_htmltext'],
            notebBaseInfo = data['item'] && data['item']['note_basic_info'],
            title = data['share_name'],
            time = notebBaseInfo['note_mtime'],
            content = '';


        if(notebBaseInfo['note_type'] == 1) {
            var artitleInfo = data.item && data.item['item_article'];
            content = artitleInfo['note_comment'] && artitleInfo['note_comment']['note_html_content'] || '';
        } else {
            content = noteInfo['note_html_content'];
        }
        var html = tmpl.webNote({
            title: title,
            time: time,
            content: content
        });
        var headerInfo = this.getHeaderInfo(data);
        headerInfo.title = '微云笔记';
        data.type = 'note';
        return this.baseHeader(headerInfo) + html + this.baseBottom(data);

    },

    article: function(data) {
        var title = data['share_name'],
            artitleInfo = data['collection'],
            time = artitleInfo['modify_time'],
            content = data['html_content'],
            html = '';
        //qq收藏直接新页面，后续直接Location到qq收藏那边
        if(artitleInfo['bid'] && artitleInfo['bid'] === 1) {
            html = this.collector({
                title: title,
                time: time,
                content: content
            }, data);

            return html;
        } else {
            html = tmpl.webArticle({
                title: title,
                time: time,
                content: content
            });
            var headerInfo = this.getHeaderInfo(data);
            headerInfo.title = '微云文章收藏';
            data.type = 'note';
            return this.baseHeader(headerInfo) + html + this.baseBottom(data);
        }
    },

    /*
    * web暂不支持查看，提示去手机查看
    * */
    group: function(data) {
         return this.fail({
             msg: '仅支持手机访问本页面',
             ret: 0
         });
    },

    isAllImage: function(data) {
        if(data['dir_list'] && data['dir_list'].length) {
            return false;
        }

        if(data['note_list'] && data['note_list'].length) {
            return false;
        }

        var fileList = data['file_list'],
            isAllImage = true;
        if(!fileList) {
            return false;
        }
        if(fileList && !data['dir_list']) {
            for(var i = 0, len = fileList.length; i < len; i++) {
                if(!fileList[i].thumb_url) {
                    isAllImage = false;
                    break;
                }
            }
        }
        return isAllImage;
    },

    isAllNote: function(data) {
        if(data['dir_list'] && data['dir_list'].length) {
            return false;
        }

        if(data['file_list'] && data['file_list'].length) {
            return false;
        }

        if(data['note_list'] && data['note_list'].length) {
            return true;
        }

        return false;
    },

    normal: function(data) {
        var html = '';
        var isImage = true;
        if(this.isAllImage(data)) {
            html = this.imgList(data);
        } else {
            isImage = false;
            html = this.fileList(data);
        }
        var headerInfo = this.getHeaderInfo(data);
        headerInfo.title = isImage ? '微云图片' : '微云文件';
        data.type = isImage ? 'photo' : 'file_list';
        return this.baseHeader(headerInfo)  + html + this.baseBottom(data);
    },

    imgList: function(data) {
        if(data['file_list'].length === 1) {
            var file = data['file_list'][0];
            var raw = file['file_name'].toLowerCase().indexOf('.gif') > -1;
            return tmpl.webOneImg({
                url: file['thumb_url'] + (raw ? '' : '&size=640*640'),
                file_id: file['file_id'],
                file_size: file['file_size']
            });
        } else {
            return tmpl.webImgList(data);
        }
    },

    fileList: function(data) {
        var dirList,
            fileList,
            noteList,
            html = '';

        dirList = data['dir_list'] || [];
        fileList = data['file_list'] || [];
        noteList = data['note_list'] || [];

        html = tmpl.webFileList({
            list: dirList.concat(fileList),
            noteList: noteList
        });

        return html;
    },

    secret: function(data) {
        var html = tmpl.webSecret(data);
        return this.baseHeader({
            title: '微云分享',
            secret: true
        }) + html + this.baseBottom(data);
    },

    fail: function(data) {
        var ret = data.ret,
            msg = data.msg,
            type = 'err';

        if(ret == 20002) {
            type = 'out';
        } else if(ret == 20003) {
            type = 'count';
        }
        var html = tmpl.webFail({
            msg: msg || '链接已失效，请联系文件所有者重新分享。',
            type: type
        });

        return this.baseHeader({
            title: '微云分享',
            fail: true
        }) + html + this.baseBottom(data);
    },

    baseHeader: function(data) {
        return tmpl.webBaseHeader(data);
    },

    baseBottom: function(data) {
        return tmpl.webBaseBottom(JSON.stringify(data));
    },

    banner: function(data) {
        return tmpl.webBanner({
            share_nick_name: data.share_nick_name,
            share_head_image_url: data.share_head_image_url,
            has_dir: data.dir_list && data.dir_list.length,
            is_all_image: this.isAllImage(data),
            share_cnt: (data.dir_list ? data.dir_list.length : 0) + (data.file_list ? data.file_list.length : 0) + (shareInfo.note_list ? shareInfo.note_list.length : 0)
        });
    },

    getHeaderInfo: function(shareInfo) {
        var shareFlag = parseInt(shareInfo['share_flag'], 10),
            msg = '',
            cnt,
            enableDownload = true,
            enableStore = true,
            enablePath = true;
        if(shareFlag == 5 || shareFlag == 6 || shareFlag == 7 || shareFlag == 8) {
            msg = '分享了一篇文章';
            enableStore = false;
            enableDownload = false;
            enablePath = false;
        } else if(shareFlag == 2 || shareFlag == 4){
            msg = '分享了一篇笔记';
            enableDownload = false;
            enablePath = false;
        } else {
            cnt = (shareInfo.dir_list ? shareInfo.dir_list.length : 0) + (shareInfo.file_list ? shareInfo.file_list.length : 0) + (shareInfo.note_list ? shareInfo.note_list.length : 0);
            var isImages = this.isAllImage(shareInfo);
            var isNotes = this.isAllNote(shareInfo);
            var txt = isImages ? '图片' : (isNotes ? '笔记' : '文件');
            msg = '分享了' + cnt + '个' + txt;
            if(cnt === 1 && isImages) {
                enablePath = false;
            }
        }
        return {
            nickname: shareInfo.share_nick_name,
            avatar: shareInfo.share_head_image_url,
	        weiyun_vip: shareInfo.weiyun_vip_flag,
            msg: msg,
            enableDownload: enableDownload && !isNotes,
            enableStore: enableStore,
            enablePath: enablePath,
            isTemporary: shareFlag == 12
        };
    }
}