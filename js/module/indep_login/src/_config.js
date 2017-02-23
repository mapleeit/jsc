define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/indep_login/',
            all: {
                name: 'indep_login.js',
                ver: '141016',
                versionControllKey:'@indep_login@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/indep_login/',
            all: {
                name: 'indep_login.js',
                ver: '141016',
                versionControllKey:'@indep_login@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
