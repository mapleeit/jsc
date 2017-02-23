define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/share/',
            all: {
                name: 'share.js',
                ver: '150609',
                versionControllKey:'@share@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/share/',
            all: {
                name: 'share.js',
                ver: '150609',
                versionControllKey:'@share@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
