define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/station/',
            all: {
                name: 'station.js',
                ver: '151223',
                versionControllKey:'@station@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/station/',
            all: {
                name: 'station.js',
                ver: '151223',
                versionControllKey:'@station@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});