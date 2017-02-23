define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/notification/',
            all: {
                name: 'notification.js',
                ver: '160121',
                versionControllKey:'@notification@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/notification/',
            all: {
                name: 'notification.js',
                ver: '160121',
                versionControllKey:'@notification@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
