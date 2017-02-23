define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/compress_file_preview/',
            all: {
                name: 'compress_file_preview.js',
                ver: '150407',
                versionControllKey:'@compress_file_preview@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/compress_file_preview/',
            all: {
                name: 'compress_file_preview.js',
                ver: '150407',
                versionControllKey:'@compress_file_preview@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
