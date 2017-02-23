/**
 * Created by maplemiao on 2016/9/26.
 */

"use strict";

define(function(require, exports, module){
    return [
        {
            key: 'mobile',
            dir: '../../../../js-dist/mobile/module/share_trace/',
            all: {
                name: 'share_trace.js',
                ver: '160926',
                versionControllKey:'@share_trace@',
                versionControll:['../../../../../js/server/conf/configs_mobile.js']
            }
        }
    ];
});