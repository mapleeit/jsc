define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/noteview/',
            all: {
                name: 'noteview.js',
                ver: '160106',
                versionControllKey:'@noteview@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/noteview/',
            all: {
                name: 'noteview.js',
                ver: '160106',
                versionControllKey:'@noteview@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
