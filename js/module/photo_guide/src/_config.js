define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/photo_guide/',
            all: {
                name: 'photo_guide.js',
                ver: '140313',
                versionControllKey:'@photo_guide@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/photo_guide/',
            all: {
                name: 'photo_guide.js',
                ver: '140313',
                versionControllKey:'@photo_guide@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});