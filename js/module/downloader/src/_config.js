define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/downloader/',
            all: {
                name: 'downloader.js',
                ver: '160119',
                versionControllKey:'@downloader@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/downloader/',
            all: {
                name: 'downloader.js',
                ver: '160119',
                versionControllKey:'@downloader@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
