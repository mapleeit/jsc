/**
 * Created by maplemiao on 2016/10/12.
 */

"use strict";
define(function(require, exports, module) {
    var defaults_v2 = 'nor',
        folder_type_v2 = 'file',
        type_map_v2 = {
            doc: ['doc', 'docx', 'wps', 'docm', 'dot', 'dotx', 'dotm', 'rtf'],
            xls: ['xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlam', 'xlsb', 'et'],
            ppt: ['ppt', 'pptx', 'dps', 'pptm'],
            pic: ['jpg', 'jpeg', 'tif', 'tiff', 'png', 'gif', 'webp', 'bmp', 'exif', 'raw', 'image'],
            video: ['mp4', 'mov', 'mkv', 'mpg', 'mpeg', 'dat', 'f4a', 'webm', 'mod', 'avi', 'mpe', 'mpeg4', 'wmv', 'wmf',
                'asf', 'ram', 'm1v', 'm2v', 'mpe', 'm4b', 'm4p', 'm4v', 'vob', 'divx', 'ogm', 'ass', 'srt', 'ssa',
                'rmvb', 'rm', '3gp', '3g2', '3gp2', '3gpp'],
            audio: ['mp3', 'wav', 'wave', 'acc', 'aac', 'aiff', 'amr', 'ape', 'flac', 'm4a', 'mid', 'midi', 'ogg',
                'rtttl', 'wma', 'ram', 'ra', 'au', 'xmf'],
            flv: ['fla', 'flv', 'swf'],
            zip: ['zip', 'rar', 'tar', 'jar', '7z', 'z', '7-zip', 'ace', 'lzh', 'arj', 'gzip', 'bz2', 'cab', 'compress',
                'uue', 'iso', 'dmg'],
            code: ['ini', 'css', 'js', 'java', 'as', 'py', 'php', 'c', 'cpp', 'h', 'cs', 'plist', 'html', 'htm', 'xml', 'ipe'],
            note: ['note'],
            keynote: ['keynote'],
            ipa: ['ipa'],
            pdf: ['pdf'],
            txt: ['txt', 'text', 'rp', 'document'],
            msg: ['msg', 'oft'],
            apk: ['apk'],
            vsd: ['vsd', 'vsdx'],
            ps: ['psd', 'psb'],
            ai: ['ai', 'eps', 'svg'],
            numbers: ['numbers'],
            settings: ['asp', 'bak', 'bat', 'exe', 'exec', 'dll', 'xmin', 'log', 'msi', 'old', 'tmp', 'key'],
            help: ['chm', 'hlp', 'cnt'],
            font: ['ttf', 'opt', 'fon', 'ttc'],
            pages: ['pages'],
            nor: ['unknow'],
            file: ['filebroken']
        },
        all_map_v2 = {};

    var type, sub_types, i, l;

    for (type in type_map_v2) {

        sub_types = type_map_v2[type];

        for (i = 0, l = sub_types.length; i < l; i++) {
            all_map_v2[sub_types[i]] = type;
        }
    }

    module.exports = function (name, version) {
        var result;
        var ext = name.toLowerCase().split('.').pop();

        result = all_map_v2[ext] || defaults_v2;

        return result;
    };
});
