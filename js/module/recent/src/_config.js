define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/recent/',
            all: {
                name: 'recent.js',
                ver: '151015',
                versionControllKey:'@recent@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/recent/',
            all: {
                name: 'recent.js',
                ver: '151015',
                versionControllKey:'@recent@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});