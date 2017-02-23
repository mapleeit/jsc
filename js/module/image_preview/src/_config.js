define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/image_preview/',
            all: {
                name: 'image_preview.js',
                ver: '151013',
                versionControllKey:'@image_preview@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/image_preview/',
            all: {
                name: 'image_preview.js',
                ver: '151013',
                versionControllKey:'@image_preview@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
