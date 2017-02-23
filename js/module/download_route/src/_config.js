define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/download_route/',
            all: {
                name: 'download_route.js',
                ver: '150408',
                versionControllKey:'@download_route@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/download_route/',
            all: {
                name: 'download_route.js',
                ver: '150408',
                versionControllKey:'@download_route@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
