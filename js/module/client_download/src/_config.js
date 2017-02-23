define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/client_download/',
            all: {
                name: 'client_download.js',
                ver: '0903',
                versionControllKey:'@client_download@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/client_download/',
            all: {
                name: 'client_download.js',
                ver: '0903',
                versionControllKey:'@client_download@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});