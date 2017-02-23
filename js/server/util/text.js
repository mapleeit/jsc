/**
 * 字符串相关操作
 * @type {{}}
 */
var exports = {
    cut: function(text, showLen, ellipsis) {
        ellipsis = ellipsis || '...';
        var curLen = 0,
            part1 = '',
            part2 = '',
            shoutCut = false;
        showLen = showLen - ellipsis.length;
        for(var i = 0, len = text.length; i < len; i++) {
            var code = text.charCodeAt(i);
            if(code < 128) {
                curLen++;
            } else {
                curLen+=2;
            }
            if(curLen >= showLen) {
                part1 = text.slice(0, i);
                part2 = text.slice(-3);
                shoutCut = true;
                break;
            }
        }

        if(shoutCut) {
            return part1 + ellipsis + part2;
        } else {
            return text;
        }
    },
    /**
     * 尾截断，
     * 例如：我很长很长 -> 我很长...
     * @param text
     * @param showLen 总共展示的长度，包括尾部省略符的长度
     * @param ellipsis 尾部省略符，默认值为'...'
     */
    tailCut: function (text, showLen, ellipsis) {
        ellipsis = ellipsis || '...';

        if (text.length <= showLen) {
            return text;
        }

        return text.slice(0, showLen - ellipsis.length) + ellipsis;
    }
};

module.exports = exports;