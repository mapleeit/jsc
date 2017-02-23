define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/file_qrcode/',
            all: {
                name: 'file_qrcode.js',
                ver: '150609',
                versionControllKey:'@file_qrcode@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'client',
            dir: '../../../js-dist/client/module/file_qrcode/',
            all: {
                name: 'file_qrcode.js',
                ver: '150609',
                versionControllKey:'@file_qrcode@',
                versionControll:['../../../../../js/server/conf/configs_client.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/file_qrcode/',
            all: {
                name: 'file_qrcode.js',
                ver: '150609',
                versionControllKey:'@file_qrcode@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});