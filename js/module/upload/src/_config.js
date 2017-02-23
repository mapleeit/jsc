define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/upload/',
            all: {
                name: 'upload.js',
                ver: '1607282',
                versionControllKey:'@upload@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/upload/',
            all: {
                name: 'upload.js',
                ver: '1607282',
                versionControllKey:'@upload@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});