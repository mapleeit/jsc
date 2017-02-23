define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/office_preview/',
            all: {
                name: 'office_preview.js',
                ver: '160107',
                versionControllKey:'@office_preview@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/office_preview/',
            all: {
                name: 'office_preview.js',
                ver: '160107',
                versionControllKey:'@office_preview@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});