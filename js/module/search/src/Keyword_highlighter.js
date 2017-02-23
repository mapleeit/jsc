/**
 * 
 * @author cluezhang
 * @date 2013-9-17
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        RangeMgr = require('./Range_mgr'),
        $ = require('$');
    var emptyEncoder = function(v){ return v;};
    var escapeRe = function(s) {
        return s.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
    };
    var KeywordHighlighter = inherit(Object, {
        wrapBegin : "<span style='color:#FF0000'>",
        wrapEnd : "</span>",
        constructor : function(cfg){
            var me = this;
            $.extend(me, cfg);
            var matchers = [];
            $.each(this.keywords, function(index, keyword){
                matchers.push(new RegExp(escapeRe(keyword), "g"+(me.caseSensitive===true ? "" : "i")));
            });
            this.matchers = matchers;
        },
        highlight : function(content, encoderFn){
            content = "" + content; // 保证为字串
            var i, matcher, result, matchedStr,
                rangeMgr = new RangeMgr({
                    autoAdjacent : false
                }),
                matchers = this.matchers;
            // 遍历所有关键字匹配正则，逐一匹配
            for(i=0; i<matchers.length; i++){
                matcher = matchers[i];
                matcher.lastIndex = 0;
                // 每个关键字匹配上时，将它所处的范围添加到RangeMgr中，RangeMgr会自动进行合并
                // 这样的话"atesta"同时匹配"tes"(1~4)与"est"(2~5)时，会得到一个合并后的范围：1~5
                while( (result = matcher.exec(content)) !== null){
                    matchedStr = result[0];
                    if(matchedStr){
                        rangeMgr.addRange({
                            start : result.index,
                            end : result.index + matchedStr.length
                        });
                    }
                }
            }
            // 遍历完后，对高亮范围与外分别进行encode处理，再包装以高亮包装
            // 例如"atesta"高亮范围为1~5，则会处理为[encode("a"), "wrapBegin", encode("test"), "wrapEnd", encode("a")]
            var ranges = rangeMgr.getRanges(), range, start, end,
                outputs = [],
                cursor = 0; // 记录已经编码到哪里
            encoderFn = encoderFn || emptyEncoder;
            for(i=0; i<ranges.length; i++){
                range = ranges[i];
                start = range.start;
                end = range.end;
                // 编码高亮前的正文
                outputs.push( encoderFn( content.slice(cursor, start) ) );
                // 编码与包装高亮正文
                outputs.push(this.wrapBegin);
                outputs.push( encoderFn( content.slice(start, end) ) );
                outputs.push(this.wrapEnd);
                // 标记已编码到高亮结束处
                cursor = end;
            }
            // 收尾工作
            outputs.push( encoderFn( content.slice(cursor) ) );
            return outputs.join("");
        }
    });
    return KeywordHighlighter;
});