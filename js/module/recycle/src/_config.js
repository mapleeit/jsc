define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/recycle/',
            all: {
                name: 'recycle.js',
                ver: '150915',
                versionControllKey:'@recycle_v2@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/recycle/',
            all: {
                name: 'recycle.js',
                ver: '150915',
                versionControllKey:'@recycle_v2@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});