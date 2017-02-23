define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/disk/',
            all: {
                name: 'disk.js',
                ver: '151223',
                versionControllKey:'@disk@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/disk/',
            all: {
                name: 'disk.js',
                ver: '151223',
                versionControllKey:'@disk@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
