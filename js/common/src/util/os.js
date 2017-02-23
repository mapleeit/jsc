/**
 * 操作系统信息
 * @author jameszuo
 * @date 13-8-5
 */
define(function (require, exports, module) {
    var lib = require('lib'),

        collections = lib.get('./collections'),

        nav = navigator.userAgent.toLowerCase(),
        mappings = [ // 请勿随意调整顺序
            ['ipad', 'ipad'],
            ['iphone', 'iphone'],
            ['mac', 'mac os,macintosh'],
            ['windows phone', 'windows phone'],
            ['windows', 'windows'],
            ['android', 'android'],
            ['linux', 'linux'],
            ['unix', 'unix'],
            ['symbian', 'symbian'],
            ['blackberry', 'bb10,blackberry,playbook']
        ],
        os_name,
        undef;

    for (var i = 0, l = mappings.length; i < l; i++) {
        var map = mappings[i],
            name = map[0],
            uas = map[1].split(',');

        if (collections.any(uas, function (ua) {
            return nav.indexOf(ua) !== -1;
        })) {
            os_name = name;
            break;
        }
    }

    return {
        name: os_name || 'unknown os'
    };

});