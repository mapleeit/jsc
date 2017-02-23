define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/full_screen_preview/',
            all: {
                name: 'full_screen_preview.js',
                ver: '150720',
                versionControllKey:'@full_screen_preview@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/full_screen_preview/',
            all: {
                name: 'full_screen_preview.js',
                ver: '150720',
                versionControllKey:'@full_screen_preview@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});