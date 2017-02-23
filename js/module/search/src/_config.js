define(function(require, exports, module){
    return [
        {
            dir: '../../../js-dist/web/module/search/',
            all: {
                name: 'search.js',
                ver: '151015',
                versionControllKey:'@search@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            dir: '../../../js-dist/appbox/module/search/',
            all: {
                name: 'search.js',
                ver: '151015',
                versionControllKey:'@search@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});