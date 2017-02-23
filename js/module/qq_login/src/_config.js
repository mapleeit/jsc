define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/qq_login/',
            all: {
                name: 'qq_login.js',
                ver: '160222',
                versionControllKey:'@qq_login@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/qq_login/',
            all: {
                name: 'qq_login.js',
                ver: '160222',
                versionControllKey:'@qq_login@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});