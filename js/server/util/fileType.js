
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
        'dmg': ['dmg'],
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
        document: ['document'],
        image: ['image'],
        video: ['video'],
        audio: ['audio'],
        compress: ['compress'],
        unknow: ['unknow'],
        sketch: ['sketch'],
        filebroken: ['filebroken']
    },
    all_map = {};


var defaults_v2 = 'nor',
    folder_type_v2 = 'file',
    type_map_v2 = {
        doc: ['doc', 'docx', 'wps', 'docm', 'dot', 'dotx', 'dotm', 'rtf'],
        xls: ['xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlam', 'xlsb', 'et'],
        ppt: ['ppt', 'pptx', 'dps', 'pptm'],
        pic: ['jpg', 'jpeg', 'tif', 'tiff', 'png', 'gif', 'webp', 'bmp', 'exif', 'raw', 'image'],
        video: ['mp4',  'mov', 'mkv', 'mpg', 'mpeg', 'dat', 'f4a', 'webm', 'mod', 'avi', 'mpe', 'mpeg4', 'wmv', 'wmf',
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
        help: ['chm' , 'hlp', 'cnt'],
        font: ['ttf', 'opt', 'fon', 'ttc'],
        pages: ['pages'],
        nor: ['unknow'],
        file: ['filebroken']
    },
    all_map_v2 = {};

var type, sub_types, i, l;

for (type in type_map) {

    sub_types = type_map[type];

    for (i = 0, l = sub_types.length; i < l; i++) {
        all_map[sub_types[i]] = type;
    }
}

for (type in type_map_v2) {

    sub_types = type_map_v2[type];

    for (i = 0, l = sub_types.length; i < l; i++) {
        all_map_v2[sub_types[i]] = type;
    }
}

module.exports = function (name, version) {
    var result;
    var ext = name.toLowerCase().split('.').pop();

    if (version === 'v2') {
        result = all_map_v2[ext] || defaults_v2;
    } else {
        result = all_map[ext] || defaults;
    }
    return result;
};

