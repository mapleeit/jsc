define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/ftn_preview/',
            all: {
                name: 'ftn_preview.js',
                ver: '151020',
                versionControllKey:'@ftn_preview@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/ftn_preview/',
            all: {
                name: 'ftn_preview.js',
                ver: '151020',
                versionControllKey:'@ftn_preview@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
