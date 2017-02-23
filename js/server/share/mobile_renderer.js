/**
 * 渲染模块
 * @type {exports}
 */
var tmpl = require('./tmpl');

module.exports = {

    collector: function(data) {
        return this.baseHeader({
            title: 'QQ收藏',
            klass: 'weiyun-note'
        }) + tmpl.collector(data);
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
        var html = tmpl.note({
            title: title,
            time: time,
            content: content
        });
        data.type = 'note';

        return this.baseHeader({
            title: '微云笔记',
            klass: 'weiyun-note'
        }) + html + this.baseBottom(data);

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
            });

            return html;
        } else {
            html = tmpl.article({
                title: title,
                time: time,
                content: content
            });
            data.type = 'note';
            return this.baseHeader({
                title: '微云文章收藏',
                klass: 'weiyun-note'
            }) + html + this.baseBottom(data);
        }
    },

    group: function(data) {
        var html = tmpl.group(data);
        data.type = 'group';
        return this.baseHeader(data) + html + this.baseBottom(data);
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
                if(!fileList[i].thumb_url && !this.isVideo(fileList[i].file_name)) {
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

    isAllVideo: function(data) {
        if(data['dir_list'] && data['dir_list'].length) {
            return false;
        }

        if(data['note_list'] && data['note_list'].length) {
            return false;
        }
        var fileList = data['file_list'];
        if(!fileList) {
            return false;
        }
        if(fileList && !data['dir_list']) {
            for(var i = 0, len = fileList.length; i < len; i++) {
                if(!this.isVideo(fileList[i].file_name)) {
                    return false;
                }
            }
        }
        return true;
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

        data.type = isImage ? 'photo' : 'file_list';
        return this.baseHeader(data) + this.banner(data) + html + this.baseBottom(data);
    },

    isVideo: function(fileName) {
        var EXT_VIDEO_TYPES = { swf: 1, dat: 1, mov: 1, mp4: 1, '3gp': 1, avi: 1, wma: 1, rmvb: 1, wmf: 1, mpg: 1, rm: 1, asf: 1, mpeg: 1, mkv: 1, wmv: 1, flv: 1, f4a: 1, webm: 1},
            fileType = this.getExt(fileName),
            is_video = fileType in EXT_VIDEO_TYPES;
        if(is_video && !this._isVideo) {
            this._isVideo = true;
        }
        return is_video;
    },

    getExt: function(_name) {
        var EXT_REX = /\.([^\.]+)$/;
        var m = (_name || '').match(EXT_REX);
        return m ? m[1].toLowerCase() : null;
    },

    hasVideo: function() {
        return !!this._isVideo;
    },

    imgList: function(data) {
        if(data['file_list'].length === 1 && data['file_list'][0].thumb_url) {
            var file = data['file_list'][0];
            var raw = file['file_name'].toLowerCase().indexOf('.gif') > -1;
            return tmpl.oneImg({
                url: file['thumb_url'] + (raw ? '' : '&size=1024*1024'),
                file_id: file['file_id'],
                file_size: file['file_size'],
                temporary: data['temporary'],
	            isQQ: data['isQQ']
            });
        } else {
            return tmpl.bigImgList(data);
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
        html = tmpl.fileList({
            has_folder: data['dir_list'] && data['dir_list'].length > 0,
            list: dirList.concat(fileList),
            noteList: noteList,
            temporary: data['temporary'],
	        isQQ: data['isQQ']
        });

        return html;
    },

    secret: function(data) {
        var html = tmpl.secret(data);
        return this.baseHeader({
            title: '微云分享'
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
        var html = tmpl.fail({
            msg: msg || '链接已失效，请联系文件所有者重新分享。',
            type: type
        });

        return this.baseHeader({
            title: '微云分享'
        }) + html + this.baseBottom(data);
    },

    baseHeader: function(data) {
        return tmpl.chunkOne() + tmpl.baseHeader(data);
    },

    baseBottom: function(data) {
        return tmpl.baseBottom({
            syncData: JSON.stringify(data)
        });
    },

    banner: function(data) {
        return tmpl.banner({
            share_nick_name: data.share_nick_name,
            share_head_image_url: data.share_head_image_url,
            has_dir: data.dir_list && data.dir_list.length,
            is_all_image: this.isAllImage(data) && !this.hasVideo(),
            is_all_note: this.isAllNote(data),
            is_all_video: this.isAllVideo(data),
            is_one_image: this.isAllImage(data) && data.file_list.length === 1 && data.file_list[0].thumb_url,
	        weiyun_vip: data.weiyun_vip_flag || 0,
            share_cnt: (data.dir_list ? data.dir_list.length : 0) + (data.file_list ? data.file_list.length : 0) + (data.note_list ? data.note_list.length : 0)
        });
    },

    getResponseChunk: function(opt) {
        if(opt.index == 0) {
            return tmpl.chunkOne();
        }
    }
}