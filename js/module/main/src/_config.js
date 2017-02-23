define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/main/',
            all: {
                name: 'main.js',
                ver: '160121',
                versionControllKey:'@main@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/main/',
            all: {
                name: 'main.js',
                ver: '160121',
                versionControllKey:'@main@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
