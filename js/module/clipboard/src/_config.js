define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/clipboard/',
            all: {
                name: 'clipboard.js',
                ver: '140826',
                versionControllKey:'@clipboard@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/clipboard/',
            all: {
                name: 'clipboard.js',
                ver: '140826',
                versionControllKey:'@clipboard@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
