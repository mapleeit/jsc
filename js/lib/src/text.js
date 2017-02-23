/**
 * 字符串处理
 * @jameszuo 12-12-25 上午9:49
 */
define(function (require, exports, module) {

    var
        // 用于文本长度计算相关
        $ = require('$'),
        create_el = function($dom){
            var $el = $('<div></div>').css({
                                position : 'absolute',
                                top : '-1000px',
                                left : '-1000px'
                            }).hide().appendTo(document.body);
            if($dom){
                $.each( ['font-size', 'font-style', 'font-weight',
                                'font-family', 'line-height',
                                'text-transform', 'letter-spacing'],
                        function(index, cssProperty) {
                            $el.css(cssProperty, $dom.css(cssProperty));
                        });
            }
            return $el;
        },
        default_measurer,
        html_escapes = {
            '&': "&amp;",
            '<': "&lt;",
            '>': "&gt;",
            "'": "&#39;",
            '"': "&quot;",
            '/': '&#x2F;'
        },

    // 要转义的HTML字符
        re_html_escape = /[&<>'"]/g,

    // 全角字符
        re_double_words = /[^\x00-\xFF]/,

    // 全角空格
        dbc_space = String.fromCharCode(12288),

        undefined;

    var text = {
        /**
         * 格式化文本
         * text.format('Good morning {0}! This is {1}. How do you do!', ['LiLei', 'HanMeiMei']);
         *        ->    Good morning LiLei! This is HanMeiMei. How do you do!
         * @param {String} str
         * @param {Array} args
         * @return {String}
         */
        format: function (str, args) {
            return str.replace(/\{(\w+)\}/g, function (m, $1) {
                var s = args[$1];
                if (s != undefined) {
                    return s;
                } else {
                    return m;
                }
            });
        },

        /**
         * 过滤HTML文本
         * @param str 要过滤的文本
         * @type String 安全文本
         */
        text: function (str) {
            if (typeof str != 'string') return str;
            if (!str) return str;
            return str.replace(re_html_escape, function (chr) {
                return html_escapes[chr] || chr;
            });
        },

        /**
         * 按照字符数截断字符串(1个全角字符=2个半角字符, 可能会有误差)
         * Modify by cluezhang, at 2013/07/03
         * 将此函数改为长度稳定版本，例如截取4全角字符，修改前是这样：
         *   1234567    -> 1234567  (7半角字符)
         *   12345678  -> 12345678  (8..)
         *   123456789 -> 12345678..  (10..)
         * 修改后是这样：
         *   1234567    -> 1234567  (7..)
         *   12345678  -> 12345678  (8..)
         *   123456789 -> 123456..  (8..)
         * @param str
         * @param len
         */
        smart_sub: function (str, len, exceed_tail) {
            try {
                var index = 0;
                len *= 2;
                exceed_tail = typeof exceed_tail === 'string' ? exceed_tail : '..';
                // 截断符长度
                var tail_length = this.byte_len(exceed_tail);
                // 如果字串被截断，除去截断符后能显示的长度
                var exceed_max_length = len - tail_length;
                // 如果达到截断后的最大长度，记录字符位置，以便后面真要截断时快速判断
                var exceed_max_charindex;

                for (var i = 0, l = str.length; i < l; i++) {
                    if (re_double_words.test(str.charAt(i))) {
                        index += 2;
                    } else {
                        index++;
                    }
                    if(!exceed_max_charindex && index >= exceed_max_length){
                        exceed_max_charindex = i+1;
                    }
                    if (index > len) { // 要进行截断了
                        return ( str.substr(0, exceed_max_charindex) + exceed_tail );
                    }
                }
                return str;
            }
            catch (e) {
                return str;
            }
        },

        /**
         * 按照字符数截断字符串(1个全角字符=2个半角字符, 可能会有误差)

         * 将此函数改为长度稳定版本，例如截取4全角字符，修改前是这样：
         *   1234567    -> 1234567  (7半角字符)
         *   12345678  -> 12345678  
         * 修改后是这样：
         *   1234567    -> 1234567 
         *   12345678  -> 12345678 
         *   123456789 -> 12...89 
         * @param {String} str
         * @param {Number} len
         * @return {String}
         */
        smart_cut : function ( str, len ) {
            try {
                var strlen = str.length,
                    exceed_tail = '...',
                    middle = Math.floor( len/2 - 1 );

                return strlen-3 > len ? [ str.substring( 0, middle ),exceed_tail,str.substring( strlen-middle ) ].join('') : str;
                
            }
            catch (e) {
                return str;
            }
        },

        /**
         * 半角转全角
         * @param {String} str
         * @param {Object} [map] 要转换的字符白名单map
         * @returns {string}
         */
        to_dbc: function (str, map) {
            var rst = [],
                Str = String;
            for (var i = 0; i < str.length; i++) {
                var chr = str[i];
                if (chr in map) {
                    var code = str.charCodeAt(i);
                    if (code == 32) {
                        rst.push(dbc_space);
                    } else if (code < 127) {
                        rst.push(Str.fromCharCode(code + 65248));
                    }
                }
                else {
                    rst.push(chr);
                }
            }
            return rst.join('');
        },

        /**
         * 计算字符串的字节长度。全角字符unicode编码范围65281~65374
         * @param str
         * @returns {number}
         */
        byte_len: function (str) {
            if (str) {
                var len = 0;
                for (var i = 0, l = str.length; i < l; i++) {
                    var c = str.charCodeAt(i);
                    // ascii 字符，作为1个字符处理
                    if (c < 0xFF) {
                        len++;
                    }
                    // 全角字符，每个计算2长度
                    else {
                        var is_half = (0xFF61 <= c && c <= 0xFF9F) || (0xFFE8 <= c && c <= 0xFFEE);
                        len += is_half ? 1 : 2;
                    }
                }
                return len;
            }
            else {
                return 0;
            }
        },
        /**
         * 测量文本将会占用的大小
         * @{HTMLElement|jQueryElement} dom 要测量文本在哪个节点下的长度
         * @{String} str 要测量的文本内容
         * @{Number} width (optional) 是否限定宽度（用于测量固定宽度下的高度）
         * @return {Object} size 测量的结果，含width与height属性，数字。
         */
        measure : function(dom, str, width, $specify_el){
            var $measure_el = $specify_el;
            if(!$measure_el){
                $measure_el = create_el($(dom));
            }
            $measure_el.css('width', width ? ''+width+'px' : 'auto');
            $measure_el.text(str);
            var size = {
                width : $measure_el.innerWidth(),
                height : $measure_el.innerHeight()
            };
            $measure_el.text('');
            return size;
        },
        /**
         * 按实际的字符的像素宽度来进行裁剪
         * @param {String} str
         * @param {Number} width 裁剪到多宽
         * @param {String} padding (optional) 裁剪后的填充字串，默认为"..."
         * @param {Measurer} measurer 指定文本宽度测量器，见{#create_measurer}
         * @return {String} after_str
         */
        ellipsis : function(str, width, padding, measurer){
            if(!measurer){
                measurer = text.get_default_measurer();
            }
            padding = padding || '...';
            // 2分法定位合适宽度
            var dotWidth = measurer.measure(padding).width,
                fullWidth = measurer.measure(str).width,
                start, end, guess, guessValue;
            if(fullWidth < width){
                return str;
            }else{
                start = 0;
                end = str.length;
                while(end > start){
                    guess = Math.ceil((start + end)/2);
                    guessValue = measurer.measure(str.substr(0, guess) + padding).width + dotWidth;
                    if(guessValue > width){
                        end = guess-1;
                        guess--;
                    }else if(guessValue < width){
                        start = guess;
                    }else{
                        break;
                    }
                }
                return str.slice(0, guess) + padding;
            }
        },

        /**
         * 按实际的字符的像素宽度来进行裁剪
         * @param {String} str
         * @param {Number} width 裁剪到多宽
         * @param {String} padding (optional) 裁剪后的填充字串，默认为"..."
         * @param {Measurer} measurer 指定文本宽度测量器，见{#create_measurer}
         * @return {String} after_str
         * yuyanghe    从中间截取     例如  12345678  截取成    123...78
         */
        ellipsis_cut : function(str, width, padding, measurer){
            if(!measurer){
                measurer = text.get_default_measurer();
            }
            padding = padding || '...';
            // 2分法定位合适宽度
            var dotWidth = measurer.measure(padding).width,
                fullWidth = measurer.measure(str).width,
                start, end, guess, guessValue;
            if(fullWidth < width){
                return str;
            }else{
                start = 0;
                end = str.length;
                while(end > start){
                    guess = Math.ceil((start + end)/2);
                    guessValue = measurer.measure(str.substr(0, guess/2)+padding+str.substr(str.length-guess/2,str.length)).width;
                    if(guessValue > width){
                        end = guess-1;
                        guess--;
                    }else if(guessValue < width){
                        start = guess;
                    }else{
                        break;
                    }
                }
                return str.substr(0, guess/2)+padding+str.substr(str.length-guess/2,str.length);
            }
        },



        /**
         * 创建一个固定的计算器
         * @{HTMLElement|jQueryElement} $dom 要测量文本在哪个节点下的长度
         * @return {Measurer} measurer
         */
        create_measurer : function(dom){
            var $specify_el = create_el($(dom));
             var measurer = {
                measure : function(str, width){
                    return text.measure(null, str, width, $specify_el);
                },
                destroy : function(){
                    $specify_el.remove();
                },
                ellipsis : function(str, width, padding){
                    return text.ellipsis(str, width, padding, measurer);
                }
            };
            return measurer;
        },
        // private
        get_default_measurer : function(){
            if(!default_measurer){
                default_measurer = text.create_measurer(document.body);
            }
            return default_measurer;
        },
        /**
         * 以类windows风格进行路径缩略显示，规则如下：
         * 1. 默认显示全路径，如果空间不够，依次从第{keepFirstDirectoryNum}级目录开始隐藏。但至少显示最后{keepLastDirectoryNum}级的目录，
         * 2. 当前{keepFirstDirectoryNum}级和后{keepLastDirectoryNum}级目录名仍不够空间时，从前开始压缩目录，直到极限，例如"xx..."
         * 
         * 所以， level1>level2>level3>level4>level5>level6，在keepFirstDirectoryNum=1, keepLastDirectoryNum=2规则下，可能会进行以下压缩：
         * level1>...>level3>level4>level5>level6
         * level1>...>level4>level5>level6
         * level1>...>level5>level6
         * le...>...>level5>level6
         * le...>...>le..>level6
         * le...>...>le..>le..
         * 
         * @param {String[]} paths
         * @param {Object} config 配置如何进行缩略，有以下属性：
         *      keepFirstDirectoryNum 保留前多少级目录不隐藏（但仍可能压缩为“xx...”）
         *      keepLastDirectoryNum 保留后多少级目录不隐藏（同上）
         *      hideHtml 隐藏的路径及压缩的扩展字符，默认为"..."
         *      totalWidth 限定的总宽度，以此为参考进行压缩
         *      separatorWidth 分隔符的宽度，默认为12
         *      hidePathWidth 隐藏的路径的宽度，默认从hideHtml计算（为了性能，可以外面计算好了再传）
         *      ellipsisPathWidth 目录能被压缩的最小宽度，默认为50（像素）
         * @param {Measurer} measurer (optional) 参考{#create_measurer)
         * @return {String[]} paths
         */
        compact_paths : function(paths, config, measurer){
            measurer = measurer || text.get_default_measurer();
            config = config || {};
            var 
                // 保留路径前多少级
                keepFirstDirectoryNum = Math.min(paths.length, $.isNumeric(config.keepFirstDirectoryNum) ? config.keepFirstDirectoryNum : 1),
                // 保留路径后多少级
                keepLastDirectoryNum = Math.min(paths.length, $.isNumeric(config.keepLastDirectoryNum) ? config.keepLastDirectoryNum : 2),
                // 缩略时显示的文本
                hideHtml = config.ellipsisPadding || '...',
                // 总路径限定的显示宽度
                totalWidth = config.totalWidth || 200,
                // 路径分隔符宽度
                separatorWidth = config.separatorWidth || 12,
                // 缩略路径的宽度
                hidePathWidth = config.hidePathWidth || measurer.measure(hideHtml).width,
                // 压缩一层路径的最小宽度
                ellipsisPathWidth = config.ellipsisPathWidth || 40;
                // 
            var i, name;
            var widths = [];
            for(i=0; i<paths.length; i++){
                widths.push(measurer.measure(paths[i]).width);
            }
            var stateType = {
                None : 'none', // 未进行缩略
                Ellipsis : 'ellipsis', // 进行了压缩，如 abcdefg -> ab...
                Hide : 'hide' // 进行了隐藏，如 a\b\c\d -> a\...\d
            };
            var currentWidth, hiding, maxCompacted = false, i, states = [], state, width, remainWidth;
            test_compact: while(!maxCompacted){ // 如果没有压缩到极限，就一直尝试压缩
                // 计算当前的宽度
                currentWidth = -separatorWidth;
                hiding = false;
                for(i=0; i<paths.length; i++){
                    state = states[i] || stateType.None;
                    width = widths[i];
                    switch(state){
                        case stateType.Ellipsis:
                            currentWidth += separatorWidth + Math.min(width, ellipsisPathWidth);
                            hiding = false;
                            break;
                        case stateType.Hide:
                            if(!hiding){
                                currentWidth += separatorWidth + hidePathWidth;
                                hiding = true;
                            }
                            break;
                        //case stateType.None:
                        default:
                            currentWidth += separatorWidth + width;
                            hiding = false;
                            break;
                    }
                }
                // 如果当前宽度超出，尝试压缩
                if(currentWidth>totalWidth){
                    // 先尝试隐藏
                    for(i=0; i<paths.length; i++){
                        // 如果不在必显示区域，隐藏
                        state = states[i];
                        if(i >= keepFirstDirectoryNum && i < paths.length-keepLastDirectoryNum && state !== stateType.Hide){
                            states[i] = stateType.Hide;
                            continue test_compact;
                        }
                    }
                    // 再尝试压缩
                    for(i=0; i<paths.length; i++){
                        // 如果当前是全部显示
                        state = states[i];
                        if(!state || states[i] === stateType.None){
                            states[i] = stateType.Ellipsis;
                            continue test_compact;
                        }
                    }
                    // 都没生效就到极限了
                    maxCompacted = true;
                    remainWidth = 0;
                }else{ // 如果宽度符合，结束
                    // 当前仍有空余的宽度，记录，用于适当扩张Ellipsis状态的路径
                    remainWidth = totalWidth - currentWidth;
                    break;
                }
            }
            
            // 处理完毕，输出
            var htmls = [];
            // 从后往前输出
            var targetWidth, useWidth;
            hiding = false;
            for(i=paths.length-1; i>=0; i--){
                state = states[i];
                width = widths[i];
                name = paths[i];
                switch(state){
                    case stateType.Ellipsis:
                        targetWidth = ellipsisPathWidth;
                        if(targetWidth < width && remainWidth>0){
                            // 此次使用多少剩余宽度
                            useWidth = Math.min(remainWidth, width - targetWidth);
                            targetWidth += useWidth;
                            remainWidth -= useWidth;
                        }
                        htmls.push(measurer.ellipsis(name, targetWidth, hideHtml));
                        hiding = false;
                        break;
                    case stateType.Hide:
                        if(!hiding){
                            htmls.push(hideHtml);
                            hiding = true;
                        }
                        break;
                    //case stateType.None:
                    default:
                        htmls.push(name);
                        hiding = false;
                        break;
                }
            }
            htmls.reverse();
            
            return htmls;
        }
    };
    
    return text;
});