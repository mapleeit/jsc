define(function(require, exports, module){
    return [
        {
            key: 'mobile',
            dir: '../../../js-dist/mobile/lib/',
            all: {
                name: 'lib.js',
                ver: '150827',
                versionControllKey:'@lib@',
                versionControll:['../../../../js/server/conf/configs_mobile.js']
            }
        },
        {
            key: 'good-photo',
            dir: '../../../js-dist/good-photo/lib/',
            all: {
                name: 'lib.js',
                ver: '150827',
                versionControllKey:'@lib@',
                versionControll:['../../../../js/server/conf/configs_photo.js']
            }
        }
    ];
});