define(function (require, exports, module) {

    var defaults = 'file',
        folder_type = 'folder',
        type_map = {
            doc: ['doc', 'docm', 'dot', 'dotx', 'dotm', 'rtf'],
            xls: ['xls', 'xlsm', 'xltx', 'xltm', 'xlam', 'xlsb'],
            ppt: ['ppt', 'pptm'],
            bmp: ['bmp', 'exif', 'raw'],
            '3gp': ['3gp', '3g2', '3gp2', '3gpp'],
            mpe: ['mpe', 'mpeg4'],
            asf: ['asf', 'ram', 'm1v', 'm2v', 'mpe', 'm4b', 'm4p', 'm4v', 'vob', 'divx', 'ogm', 'ass', 'srt', 'ssa'],
            wav: ['wav', 'ram', 'ra', 'au'],
            c: ['c', 'cpp', 'h', 'cs', 'plist'],
            '7z': ['7z', 'z', '7-zip'],
            ace: ['ace', 'lzh', 'arj', 'gzip', 'bz2'],
            jpg: ['jpg', 'jpeg', 'tif', 'tiff', 'webp'],
            rmvb: ['rmvb'],
            rm: ['rm'],
            hlp: ['hlp', 'cnt'],
            code: ['ini', 'css', 'js', 'java', 'as', 'py', 'php'],
            exec: ['exec', 'dll'],
            pdf: ['pdf'],
            txt: ['txt', 'text'],
            msg: ['msg'],
            rp: ['rp'],
            vsd: ['vsd'],
            ai: ['ai'],
            eps: ['eps'],
            log: ['log'],
            xmin: ['xmin'],
            psd: ['psd'],
            png: ['png'],
            gif: ['gif'],
            mod: ['mod'],
            mov: ['mov'],
            avi: ['avi'],
            swf: ['swf'],
            flv: ['flv'],
            wmv: ['wmv'],
            wma: ['wma'],
            mp3: ['mp3'],
            mp4: ['mp4'],
            ipa: ['ipa'],
            apk: ['apk'],
            ipe: ['ipe'],
            exe: ['exe'],
            msi: ['msi'],
            bat: ['bat'],
            fla: ['fla'],
            html: ['html'],
            htm: ['htm'],
            asp: ['asp'],
            xml: ['xml'],
            chm: ['chm'],
            rar: ['rar'],
            zip: ['zip'],
            tar: ['tar'],
            cab: ['cab'],
            uue: ['uue'],
            jar: ['jar'],
            iso: ['iso'],
            dmg: ['dmg'],
            bak: ['bak'],
            tmp: ['tmp'],
            ttf: ['ttf'],
            otf: ['opt'],
            old: ['old'],
            docx: ['docx'],
            wps: ['wps'],
            xlsx: ['xlsx'],
            pptx: ['pptx'],
            dps: ['dps'],
            et:  ['et'],
            key: ['key'],
            numbers: ['numbers'],
            pages: ['pages'],
            keynote: ['keynote'],
            mkv: ['mkv'],
            mpg: ['mpg'],
            mpeg: ['mpeg'],
            dat: ['dat'],
            f4a: ['f4a'],
            webm: ['webm'],
            ogg: ['ogg'],
            acc: ['acc'],
            m4a: ['m4a'],
            wave: ['wave'],
            midi: ['midi'],
            ape: ['ape'],
            aac: ['aac'],
            aiff: ['aiff'],
            mid: ['mid'],
            xmf: ['xmf'],
            rtttl: ['rtttl'],
            flac: ['flac'],
            amr: ['amr'],
            ttc: ['ttc'],
            fon: ['fon'],
            dmg: ['dmg'],
            sketch: ['sketch'],
            document: ['document'],
            image: ['image'],
            video: ['video'],
            audio: ['audio'],
            compress: ['compress'],
            unknow: ['unknow'],
            filebroken: ['filebroken']
        },
        all_map = {},
        can_ident = {},
        _can_ident = [ // revert to map later
            'doc', 'xls', 'ppt', 'bmp', '3gp', 'mpe', 'asf', 'wav', 'c',
            '7z', 'zip', 'ace', 'jpg', 'rmvb', 'rm', 'hlp', 'pdf', 'txt', 'msg', 'rp', 'vsd', 'ai',
            'eps', 'log', 'xmin', 'psd', 'png', 'gif', 'mod', 'mov', 'avi', 'swf', 'flv', 'wmv',
            'wma', 'mp3', 'mp4', 'ipa', 'apk', 'exe', 'msi', 'bat', 'fla', 'html', 'htm', 'asp',
            'xml', 'chm', 'rar', 'tar', 'cab', 'uue', 'jar', 'iso', 'dmg', 'bak', 'tmp', 'ttf', 'otf',
            'docx', 'wps', 'xlsx', 'pptx', 'dps', 'et', 'key', 'numbers', 'pages', 'keynote', 'mkv', 'mpg',
            'mpeg', 'dat', 'f4a', 'webm', 'ogg', 'acc', 'm4a', 'wave', 'midi', 'ape', 'aac', 'aiff', 'mid',
            'xmf', 'rtttl', 'flac', 'amr', 'ttc', 'fon', 'dmg'
        ];

    for (var type in type_map) {

        var sub_types = type_map[type];

        for (var i = 0, l = sub_types.length; i < l; i++) {
            all_map[sub_types[i]] = type;
        }
    }

    for (var i = 0, l = _can_ident.length; i < l; i++) {
        var sub_types = type_map[_can_ident[i]];
        if (!sub_types || !sub_types.length) {
            try {
                console.error(_can_ident[i] + ' "can_ident" types must included in the keys of "type_map"');
            } catch (e) {
            }
        }
        for (var j = 0, k = sub_types.length; j < k; j++) {
            can_ident[sub_types[j]] = 1;
        }
    }



    var defaults_v2 = 'nor',
        folder_type_v2 = 'file',
        type_map_v2 = {
            doc: ['doc', 'docx', 'wps', 'docm', 'dot', 'dotx', 'dotm', 'rtf'],
            xls: ['xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlam', 'xlsb', 'et'],
            ppt: ['ppt', 'pptx', 'dps', 'pptm'],
            pic: ['jpg', 'jpeg', 'tif', 'tiff', 'png', 'gif', 'webp', 'bmp', 'exif', 'raw', 'image'],
            video: ['mp4',  'mov', 'mkv', 'mpg', 'mpeg', 'dat', 'f4a', 'webm', 'mod', 'avi', 'mpe', 'mpeg4', 'wmv', 'wmf',
                    'asf', 'ram', 'm1v', 'm2v', 'mpe', 'm4b', 'm4p', 'm4v', 'vob', 'divx', 'ogm', 'ass', 'ssa',
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
            sketch: ['sketch'],
            ps: ['psd', 'psb'],
            ai: ['ai', 'eps', 'svg'],
            numbers: ['numbers'],
            settings: ['asp', 'bak', 'bat', 'exe', 'exec', 'dll', 'xmin', 'log', 'msi', 'old', 'tmp', 'key'],
            help: ['chm' , 'hlp', 'cnt'],
            font: ['ttf', 'opt', 'fon', 'ttc'],
            pages: ['pages'],
            nor: ['unknow', 'srt'],
            file: ['filebroken']
        },
        all_map_v2 = {},
        can_ident_v2 = {},
        _can_ident_v2 = [ // revert to map later
            'doc', 'xls', 'ppt', 'note', 'vsd', 'pages', 'keynote', 'numbers',
            'msg', 'zip', 'pic', 'video', 'flv', 'audio', 'apk', 'pdf', 'txt', 'ipa',
            'settings', 'help', 'ps', 'ai', 'font', 'code'
        ];

    for (var type in type_map_v2) {

        var sub_types = type_map_v2[type];

        for (var i = 0, l = sub_types.length; i < l; i++) {
            all_map_v2[sub_types[i]] = type;
        }
    }

    for (var i = 0, l = _can_ident_v2.length; i < l; i++) {
        var sub_types = type_map_v2[_can_ident_v2[i]];
        if (!sub_types || !sub_types.length) {
            try {
                console.error(_can_ident_v2[i] + ' "can_ident" types must included in the keys of "type_map"');
            } catch (e) {
            }
        }
        for (var j = 0, k = sub_types.length; j < k; j++) {
            can_ident_v2[sub_types[j]] = 1;
        }
    }


    var getWords = function (str, num) {
        try {
            var index = 0;
            for (var i = 0, l = str.length; i < l; i++) {
                if ((/[^\x00-\xFF]/).test(str.charAt(i))) {
                    index += 2;
                } else {
                    index++;
                }
                if (index > num) {
                    return ( str.substr(0, i) + '..' );
                }
            }
            return str;
        } catch (e) {
            return str;
        }
    };

    return {
        get_type_by_ext: function (type) {
            return all_map[type] || defaults;
        },
        get_folder_type: function () {
            return folder_type;
        },
        can_identify: function (type) {
            return !!can_ident[type];
        },

        /*
        * 新版UI的文件类型，与旧版不太兼容，这里用v2来区分
        * */
        get_type_by_ext_v2: function (type) {
            return all_map_v2[type] || defaults_v2;
        },
        get_folder_type_v2: function () {
            return folder_type_v2;
        },
        can_identify_v2: function (type) {
            return !!can_ident_v2[type];
        },


        /**
         * 修复长文件名，如 「这是一个很长很长很长的文件名.txt」会被修复为「这是一个...文件名.txt」
         * @param {String} file_name
         * @param {Number} type
         * @returns {*}
         */
        revise_file_name: function (file_name, type) {
            switch (type) {
                case 1 :
                    return file_name.length > 24 ? [ file_name.substring(0, 8), '...', file_name.substring(file_name.length - 13) ].join('') : file_name;
                case 2 :
                    return file_name.length > 17 ? [ file_name.substring(0, 7), '...', file_name.substring(file_name.length - 7) ].join('') : file_name;
            }

        }
    };

});