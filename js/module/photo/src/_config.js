define(function(require, exports, module){
    return [
        {
            dir: '../../../js-dist/web/module/photo/',
            all: {
                name: 'photo.js',
                ver: '151223',
                versionControllKey:'@photo@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            dir: '../../../js-dist/appbox/module/photo/',
            all: {
                name: 'photo.js',
                ver: '151223',
                versionControllKey:'@photo@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});