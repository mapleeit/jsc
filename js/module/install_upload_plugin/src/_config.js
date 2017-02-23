define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/install_upload_plugin/',
            all: {
                name: 'install_upload_plugin.js',
                ver: '160104',
                versionControllKey:'@install_upload_plugin@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/install_upload_plugin/',
            all: {
                name: 'install_upload_plugin.js',
                ver: '160104',
                versionControllKey:'@install_upload_plugin@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});