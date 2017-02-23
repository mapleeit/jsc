define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/jump_path/',
            all: {
                name: 'jump_path.js',
                ver: '151106',
                versionControllKey:'@jump_path@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/jump_path/',
            all: {
                name: 'jump_path.js',
                ver: '151106',
                versionControllKey:'@jump_path@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});