define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../js-dist/web/lib/',
            all: {
                name: 'lib.js',
                ver: '150415',
                versionControllKey:'@lib@',
                versionControll:['../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../js-dist/appbox/lib/',
            all: {
                name: 'lib.js',
                ver: '150415',
                versionControllKey:'@lib@',
                versionControll:['../../../../js/server/conf/configs_appbox.js']
            }
        },
	    {
		    key: 'client',
		    dir: '../../js-dist/client/lib/',
		    all: {
			    name: 'lib.js',
			    ver: '150415',
			    versionControllKey:'@lib@',
			    versionControll:['../../../../js/server/conf/configs_client.js']
		    }
	    }
    ];
});