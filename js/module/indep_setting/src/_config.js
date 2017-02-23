define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/indep_setting/',
            all: {
                name: 'indep_setting.js',
                ver: '140722',
                versionControllKey:'@indep_setting@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/indep_setting/',
            all: {
                name: 'indep_setting.js',
                ver: '140722',
                versionControllKey:'@indep_setting@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
