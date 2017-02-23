define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module_v2/share/',
            all: {
                name: 'share.js',
                ver: '150609',
                versionControllKey:'@share@',
                versionControll:['../../../../../js/server/conf/configs_web_v2.js']
            }
        }
        // ,
        // {
        //     key: 'appbox',
        //     dir: '../../../js-dist/appbox/module/share/',
        //     all: {
        //         name: 'share.js',
        //         ver: '150609',
        //         versionControllKey:'@share@',
        //         versionControll:['../../../../../js/server/conf/configs_appbox.js']
        //     }
        // }
    ];
});
