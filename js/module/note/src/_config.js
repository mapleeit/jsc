define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/note/',
            all: {
                name: 'note.js',
                ver: '160106',
                versionControllKey:'@note@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/note/',
            all: {
                name: 'note.js',
                ver: '160106',
                versionControllKey:'@note@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
