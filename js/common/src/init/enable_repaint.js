/**
 * 引用ExtJs中的repaint方法，以应对IE的各种奇葩渲染bug。
 * @author cluezhang
 * @date 2013/05/09
 */
define(function(require, exports, module){
	var $ = require("$");
	$.fn.extend({
		repaint : function(){
			var el = $(this);
			el.addClass("x-repaint");
			// 原Ext用的是setTimeout，使用中发现可能会导致有快速闪现，就直接读取计算使浏览器强制重绘
			el.height();
			//setTimeout(function(){
				el.removeClass("x-repaint");
			//}, 1);
		}
	});
});