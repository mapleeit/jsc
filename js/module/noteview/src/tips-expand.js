define(function(require, exports, module) {
    var $ = require('$');

    function getMore(obj) {
        if (obj.attr('data-mlOverflow_more') != undefined) {
            return obj.attr('data-mlOverflow_more');
        }
        else
            return "More";
    }

    function getLess(obj) {
        if (obj.attr('data-mlOverflow_less') != undefined)
            return obj.attr('data-mlOverflow_less');
        else
            return "Less";
    }

    function makeItLess(obj, resize_event_handler) {
        // 实现缩进功能
        obj.children(".mlOverflow_button").remove();
        var offset = 0;
        if (obj.children('.mlOverflow_text').outerHeight(true) > obj.outerHeight(true)) {
            obj.append('<a href="#" class="mlOverflow_button">'+getMore(obj)+'</a>');
            offset = $('.mlOverflow_button').outerHeight(true);
        }
        while ((obj.children('.mlOverflow_text').outerHeight(true) + offset) > obj.outerHeight(true)) {
            obj.children('.mlOverflow_text').text(
                obj.children('.mlOverflow_text').text().replace(/\W*\s(\S)*$/, '...')
            );
        }

        // 按钮展开与收起的绑定处理
        obj.children('.mlOverflow_button').click(function () {
            var holder = $(this).siblings('.mlOverflow_text').text();
            $(this).siblings('.mlOverflow_text').text($(this).siblings('.mlOverflow_text').data('mlOverflow_text'));
            $(this).siblings('.mlOverflow_text').data('mlOverflow_text', holder);
            if ($(this).text() == getMore(obj)) {
                $(this).text(getLess(obj));
                obj.css('max-height', 'none');
                obj.css('height', 'auto');
            }
            else {
                $(this).text(getMore(obj));
                obj.css('max-height', ''+obj.data('mlOverflow_height')+'px');
            }

            if (resize_event_handler) {
                resize_event_handler();
            }
        });
    }

    exports.UpdateTips = function(selector, height, resize_event_handler) {
        // Save the original text and height of each exOverflow div, in case they're expanded
        $(selector).each(function(){
            if ($(this).children('.mlOverflow_text').text().length < 0) {
                $(this).hide();
            }
        });

        $(selector).each(function () {
            $(this).data('mlOverflow_height', height);
            $(this).css('max-height', ''+height+'px');
            $(this).children('.mlOverflow_text').data('mlOverflow_text', $(this).children('.mlOverflow_text').text());
        });

        $(selector).each(function(){
            makeItLess($(this), resize_event_handler);
        });
    };

    exports.ResizeTips = function(selector, resize_event_handler) {
        var holder = $(selector).children('.mlOverflow_text').data('mlOverflow_text');
        if ($(selector).children(".mlOverflow_button").text() == getMore($(selector))) {
            $(selector).children('.mlOverflow_text').text(holder);
            makeItLess($(selector), resize_event_handler);
        }
    }
});