define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/compress_file_iframe/',
            all: {
                name: 'compress_file_iframe.js',
                ver: '141016',
                versionControllKey:'@compress_file_iframe@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/compress_file_iframe/',
            all: {
                name: 'compress_file_iframe.js',
                ver: '141016',
                versionControllKey:'@compress_file_iframe@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});