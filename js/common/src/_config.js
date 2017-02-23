define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../js-dist/web/common/',
            all: {
                name: 'common.js',
                ver: '160822',
                versionControllKey:'@common@',
                versionControll:['../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../js-dist/appbox/common/',
            all: {
                name: 'common.js',
                ver: '160822',
                versionControllKey:'@common@',
                versionControll:['../../../../js/server/conf/configs_appbox.js']
            }
        },
	    {
		    key: 'client',
		    dir: '../../js-dist/client/common/',
		    all: {
			    name: 'common.js',
			    ver: '160822',
			    versionControllKey:'@common@',
			    versionControll:['../../../../js/server/conf/configs_client.js']
		    }
	    }
    ];
});