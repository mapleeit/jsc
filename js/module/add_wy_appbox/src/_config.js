define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/add_wy_appbox/',
            all: {
                name: 'add_wy_appbox.js',
                ver: '140217',
                versionControllKey:'@add_wy_appbox@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/add_wy_appbox/',
            all: {
                name: 'add_wy_appbox.js',
                ver: '140217',
                versionControllKey:'@add_wy_appbox@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});