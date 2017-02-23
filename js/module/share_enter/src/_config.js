define(function(require, exports, module){
    return [
        {
            key: 'web',
            dir: '../../../js-dist/web/module/share_enter/',
            all: {
                name: 'share_enter.js',
                ver: '151225',
                versionControllKey:'@share_enter@',
                versionControll:['../../../../../js/server/conf/configs_web.js']
            }
        },
        {
            key: 'appbox',
            dir: '../../../js-dist/appbox/module/share_enter/',
            all: {
                name: 'share_enter.js',
                ver: '151225',
                versionControllKey:'@share_enter@',
                versionControll:['../../../../../js/server/conf/configs_appbox.js']
            }
        },
	    {
		    key: 'client',
		    dir: '../../../js-dist/client/module/share_enter/',
		    all: {
			    name: 'share_enter.js',
			    ver: '151225',
			    versionControllKey:'@share_enter@',
			    versionControll:['../../../../../js/server/conf/configs_client.js']
		    }
	    }
    ];
});
