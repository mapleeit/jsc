define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/ftn_dns_detect/',
            all: {
                name: 'ftn_dns_detect.js',
                ver: '141016',
                versionControllKey:'@ftn_dns_detect@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/ftn_dns_detect/',
            all: {
                name: 'ftn_dns_detect.js',
                ver: '141016',
                versionControllKey:'@ftn_dns_detect@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});
