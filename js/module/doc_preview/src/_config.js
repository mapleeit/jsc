define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/doc_preview/',
            all: {
                name: 'doc_preview.js',
                ver: '140710',
                versionControllKey:'@doc_preview@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/doc_preview/',
            all: {
                name: 'doc_preview.js',
                ver: '140710',
                versionControllKey:'@doc_preview@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        }
    ];
});