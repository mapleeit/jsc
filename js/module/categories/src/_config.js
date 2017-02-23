define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/categories/',
            all: {
                name: 'categories.js',
                ver: '151223',
                versionControllKey:'@categories@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/categories/',
            all: {
                name: 'categories.js',
                ver: '151223',
                versionControllKey:'@categories@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
