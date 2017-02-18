//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define("club/weiyun/js-dist/web/module_v2/image_preview/image_preview.r160810",["$","lib","common","downloader"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//image_preview/src/idrag.js
//image_preview/src/image_preview.js
//image_preview/src/mode.js
//image_preview/src/store.js
//image_preview/src/view.js
//image_preview/src/image_preview.tmpl.html

//js file list:
//image_preview/src/idrag.js
//image_preview/src/image_preview.js
//image_preview/src/mode.js
//image_preview/src/store.js
//image_preview/src/view.js
/**
 * Interface Elements for jQuery
 * Draggable
 *
 * http://interface.eyecon.ro
 *
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 */
 
/**
 * Create a draggable element with a number of advanced options including callback, Google Maps type draggables,
 * reversion, ghosting, and grid dragging.
 * 
 * @name Draggable
 * @descr Creates draggable elements that can be moved across the page.
 * @param Hash hash A hash of parameters. All parameters are optional.
 * @option String handle (optional) The jQuery selector matching the handle that starts the draggable
 * @option DOMElement handle (optional) The DOM Element of the handle that starts the draggable
 * @option Boolean revert (optional) When true, on stop-drag the element returns to initial position
 * @option Boolean ghosting (optional) When true, a copy of the element is moved
 * @option Integer zIndex (optional) zIndex depth for the element while it is being dragged
 * @option Float opacity (optional) A number between 0 and 1 that indicates the opacity of the element while being dragged
 * @option Integer grid (optional) (optional) A number of pixels indicating the grid that the element should snap to
 * @option Array grid (optional) A number of x-pixels and y-pixels indicating the grid that the element should snap to
 * @option Integer fx (optional) Duration for the effect (like ghosting or revert) applied to the draggable
 * @option String containment (optional) Define the zone where the draggable can be moved. 'parent' moves it inside parent
 *                           element, while 'document' prevents it from leaving the document and forcing additional
 *                           scrolling
 * @option Array containment An 4-element array (left, top, width, height) indicating the containment of the element
 * @option String axis (optional) Set an axis: vertical (with 'vertically') or horizontal (with 'horizontally')
 * @option Function onStart (optional) Callback function triggered when the dragging starts
 * @option Function onStop (optional) Callback function triggered when the dragging stops
 * @option Function onChange (optional) Callback function triggered when the dragging stop *and* the element was moved at least
 *                          one pixel
 * @option Function onDrag (optional) Callback function triggered while the element is dragged. Receives two parameters: x and y
 *                        coordinates. You can return an object with new coordinates {x: x, y: y} so this way you can
 *                        interact with the dragging process (for instance, build your containment)
 * @option Boolean insideParent Forces the element to remain inside its parent when being dragged (like Google Maps)
 * @option Integer snapDistance (optional) The element is not moved unless it is dragged more than snapDistance. You can prevent
 *                             accidental dragging and keep regular clicking enabled (for links or form elements, 
 *                             for instance)
 * @option Object cursorAt (optional) The dragged element is moved to the cursor position with the offset specified. Accepts value
 *                        for top, left, right and bottom offset. Basically, this forces the cursor to a particular
 *                        position during the entire drag operation.
 * @option Boolean autoSize (optional) When true, the drag helper is resized to its content, instead of the dragged element's sizes
 * @option String frameClass (optional) When is set the cloned element is hidden so only a frame is dragged
 * @type jQuery
 * @cat Plugins/Interface
 * @author Stefan Petre
 */

define.pack("./idrag",["$"],function (require, exports, module) {
	var jQuery = require('$');
	jQuery.iUtil = {
		getPosition : function(e)
		{
			var x = 0;
			var y = 0;
			var restoreStyle = false;
			var es = e.style;
			if (jQuery(e).css('display') == 'none') {
				oldVisibility = es.visibility;
				oldPosition = es.position;
				es.visibility = 'hidden';
				es.display = 'block';
				es.position = 'absolute';
				restoreStyle = true;
			}
			var el = e;
			while (el){
				x += el.offsetLeft + (el.currentStyle && !jQuery.browser.opera ?parseInt(el.currentStyle.borderLeftWidth)||0:0);
				y += el.offsetTop + (el.currentStyle && !jQuery.browser.opera ?parseInt(el.currentStyle.borderTopWidth)||0:0);
				el = el.offsetParent;
			}
			el = e;
			while (el && el.tagName  && el.tagName.toLowerCase() != 'body')
			{
				x -= el.scrollLeft||0;
				y -= el.scrollTop||0;
				el = el.parentNode;
			}
			if (restoreStyle) {
				es.display = 'none';
				es.position = oldPosition;
				es.visibility = oldVisibility;
			}
			return {x:x, y:y};
		},
		getPositionLite : function(el)
		{
			var x = 0, y = 0;
			while(el) {
				x += el.offsetLeft || 0;
				y += el.offsetTop || 0;
				el = el.offsetParent;
			}
			return {x:x, y:y};
		},
		getSize : function(e)
		{
			var w = jQuery.css(e,'width');
			var h = jQuery.css(e,'height');
			var wb = 0;
			var hb = 0;
			var es = e.style;
			if (jQuery(e).css('display') != 'none') {
				wb = e.offsetWidth;
				hb = e.offsetHeight;
			} else {
				oldVisibility = es.visibility;
				oldPosition = es.position;
				es.visibility = 'hidden';
				es.display = 'block';
				es.position = 'absolute';
				wb = e.offsetWidth;
				hb = e.offsetHeight;
				es.display = 'none';
				es.position = oldPosition;
				es.visibility = oldVisibility;
			}
			return {w:w, h:h, wb:wb, hb:hb};
		},
		getSizeLite : function(el)
		{
			return {
				wb:el.offsetWidth||0,
				hb:el.offsetHeight||0
			};
		},
		getClient : function(e)
		{
			var h, w, de;
			if (e) {
				w = e.clientWidth;
				h = e.clientHeight;
			} else {
				de = document.documentElement;
				w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
				h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
			}
			return {w:w,h:h};
		},
		getScroll : function (e)
		{
			var t, l, w, h, iw, ih;
			if (e && e.nodeName.toLowerCase() != 'body') {
				t = e.scrollTop;
				l = e.scrollLeft;
				w = e.scrollWidth;
				h = e.scrollHeight;
				iw = 0;
				ih = 0;
			} else  {
				if (document.documentElement && document.documentElement.scrollTop) {
					t = document.documentElement.scrollTop;
					l = document.documentElement.scrollLeft;
					w = document.documentElement.scrollWidth;
					h = document.documentElement.scrollHeight;
				} else if (document.body) {
					t = document.body.scrollTop;
					l = document.body.scrollLeft;
					w = document.body.scrollWidth;
					h = document.body.scrollHeight;
				}
				iw = self.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0;
				ih = self.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0;
			}
			return { t: t, l: l, w: w, h: h, iw: iw, ih: ih };
		},
		getMargins : function(e, toInteger)
		{
			var el = jQuery(e);
			var t = el.css('marginTop') || '';
			var r = el.css('marginRight') || '';
			var b = el.css('marginBottom') || '';
			var l = el.css('marginLeft') || '';
			if (toInteger)
				return {
					t: parseInt(t)||0,
					r: parseInt(r)||0,
					b: parseInt(b)||0,
					l: parseInt(l)
				};
			else
				return {t: t, r: r,	b: b, l: l};
		},
		getPadding : function(e, toInteger)
		{
			var el = jQuery(e);
			var t = el.css('paddingTop') || '';
			var r = el.css('paddingRight') || '';
			var b = el.css('paddingBottom') || '';
			var l = el.css('paddingLeft') || '';
			if (toInteger)
				return {
					t: parseInt(t)||0,
					r: parseInt(r)||0,
					b: parseInt(b)||0,
					l: parseInt(l)
				};
			else
				return {t: t, r: r,	b: b, l: l};
		},
		getBorder : function(e, toInteger)
		{
			var el = jQuery(e);
			var t = el.css('borderTopWidth') || '';
			var r = el.css('borderRightWidth') || '';
			var b = el.css('borderBottomWidth') || '';
			var l = el.css('borderLeftWidth') || '';
			if (toInteger)
				return {
					t: parseInt(t)||0,
					r: parseInt(r)||0,
					b: parseInt(b)||0,
					l: parseInt(l)||0
				};
			else
				return {t: t, r: r,	b: b, l: l};
		},
		getPointer : function(event)
		{
			var x = event.pageX || (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)) || 0;
			var y = event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop)) || 0;
			return {x:x, y:y};
		},
		traverseDOM : function(nodeEl, func)
		{
			func(nodeEl);
			nodeEl = nodeEl.firstChild;
			while(nodeEl){
				jQuery.iUtil.traverseDOM(nodeEl, func);
				nodeEl = nodeEl.nextSibling;
			}
		},
		purgeEvents : function(nodeEl)
		{
			jQuery.iUtil.traverseDOM(
				nodeEl,
				function(el)
				{
					for(var attr in el){
						if(typeof el[attr] === 'function') {
							el[attr] = null;
						}
					}
				}
			);
		},
		centerEl : function(el, axis)
		{
			var clientScroll = $.iUtil.getScroll();
			var windowSize = $.iUtil.getSize(el);
			if (!axis || axis == 'vertically')
				$(el).css(
					{
						top: clientScroll.t + ((Math.max(clientScroll.h,clientScroll.ih) - clientScroll.t - windowSize.hb)/2) + 'px'
					}
				);
			if (!axis || axis == 'horizontally')
				$(el).css(
					{
						left:	clientScroll.l + ((Math.max(clientScroll.w,clientScroll.iw) - clientScroll.l - windowSize.wb)/2) + 'px'
					}
				);
		},
		fixPNG : function (el, emptyGIF) {
			var images = $('img[@src*="png"]', el||document), png;
			images.each( function() {
				png = this.src;
				this.src = emptyGIF;
				this.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + png + "')";
			});
		}
	};

	// Helper function to support older browsers!
	[].indexOf || (Array.prototype.indexOf = function(v, n){
		n = (n == null) ? 0 : n;
		var m = this.length;
		for (var i=n; i<m; i++)
			if (this[i] == v)
				return i;
		return -1;
	});
	jQuery.iDrag =	{
		helper : null,
		dragged: null,
		destroy : function()
		{
			return this.each(
				function ()
				{
					if (this.isDraggable) {
						this.dragCfg.dhe.unbind('mousedown', jQuery.iDrag.draginit);
						this.dragCfg = null;
						this.isDraggable = false;
						if(jQuery.browser.msie) {
							this.unselectable = "off";
						} else {
							this.style.MozUserSelect = '';
							this.style.KhtmlUserSelect = '';
							this.style.userSelect = '';
						}
					}
				}
			);
		},
		draginit : function (e)
		{
			if (jQuery.iDrag.dragged != null) {
				jQuery.iDrag.dragstop(e);
				return false;
			}
			var elm = this.dragElem;
			jQuery(document)
				.bind('mousemove', jQuery.iDrag.dragmove)
				.bind('mouseup', jQuery.iDrag.dragstop);
			elm.dragCfg.pointer = jQuery.iUtil.getPointer(e);
			elm.dragCfg.currentPointer = elm.dragCfg.pointer;
			elm.dragCfg.init = false;
			elm.dragCfg.fromHandler = this != this.dragElem;
			jQuery.iDrag.dragged = elm;
			if (elm.dragCfg.si && this != this.dragElem) {
					parentPos = jQuery.iUtil.getPosition(elm.parentNode);
					sliderSize = jQuery.iUtil.getSize(elm);
					sliderPos = {
						x : parseInt(jQuery.css(elm,'left')) || 0,
						y : parseInt(jQuery.css(elm,'top')) || 0
					};
					dx = elm.dragCfg.currentPointer.x - parentPos.x - sliderSize.wb/2 - sliderPos.x;
					dy = elm.dragCfg.currentPointer.y - parentPos.y - sliderSize.hb/2 - sliderPos.y;
					jQuery.iSlider.dragmoveBy(elm, [dx, dy]);
			}
			return jQuery.selectKeyHelper||false;
		},

		dragstart : function(e)
		{
			var elm = jQuery.iDrag.dragged;
			elm.dragCfg.init = true;

			var dEs = elm.style;

			elm.dragCfg.oD = jQuery.css(elm,'display');
			elm.dragCfg.oP = jQuery.css(elm,'position');
			if (!elm.dragCfg.initialPosition)
				elm.dragCfg.initialPosition = elm.dragCfg.oP;

			elm.dragCfg.oR = {
				x : parseInt(jQuery.css(elm,'left')) || 0,
				y : parseInt(jQuery.css(elm,'top')) || 0
			};
			elm.dragCfg.diffX = 0;
			elm.dragCfg.diffY = 0;
			if (jQuery.browser.msie) {
				var oldBorder = jQuery.iUtil.getBorder(elm, true);
				elm.dragCfg.diffX = oldBorder.l||0;
				elm.dragCfg.diffY = oldBorder.t||0;
			}

			elm.dragCfg.oC = jQuery.extend(
				jQuery.iUtil.getPosition(elm),
				jQuery.iUtil.getSize(elm)
			);
			if (elm.dragCfg.oP != 'relative' && elm.dragCfg.oP != 'absolute') {
				dEs.position = 'relative';
			}

			jQuery.iDrag.helper.empty();
			var clonedEl = elm.cloneNode(true);

			jQuery(clonedEl).css(
				{
					display:	'block',
					left:		'0px',
					top: 		'0px'
				}
			);
			clonedEl.style.marginTop = '0';
			clonedEl.style.marginRight = '0';
			clonedEl.style.marginBottom = '0';
			clonedEl.style.marginLeft = '0';
			jQuery.iDrag.helper.append(clonedEl);

			var dhs = jQuery.iDrag.helper.get(0).style;

			if (elm.dragCfg.autoSize) {
				dhs.width = 'auto';
				dhs.height = 'auto';
			} else {
				dhs.height = elm.dragCfg.oC.hb + 'px';
				dhs.width = elm.dragCfg.oC.wb + 'px';
			}

			dhs.display = 'block';
			dhs.marginTop = '0px';
			dhs.marginRight = '0px';
			dhs.marginBottom = '0px';
			dhs.marginLeft = '0px';

			//remeasure the clone to check if the size was changed by user's functions
			jQuery.extend(
				elm.dragCfg.oC,
				jQuery.iUtil.getSize(clonedEl)
			);

			if (elm.dragCfg.cursorAt) {
				if (elm.dragCfg.cursorAt.left) {
					elm.dragCfg.oR.x += elm.dragCfg.pointer.x - elm.dragCfg.oC.x - elm.dragCfg.cursorAt.left;
					elm.dragCfg.oC.x = elm.dragCfg.pointer.x - elm.dragCfg.cursorAt.left;
				}
				if (elm.dragCfg.cursorAt.top) {
					elm.dragCfg.oR.y += elm.dragCfg.pointer.y - elm.dragCfg.oC.y - elm.dragCfg.cursorAt.top;
					elm.dragCfg.oC.y = elm.dragCfg.pointer.y - elm.dragCfg.cursorAt.top;
				}
				if (elm.dragCfg.cursorAt.right) {
					elm.dragCfg.oR.x += elm.dragCfg.pointer.x - elm.dragCfg.oC.x -elm.dragCfg.oC.hb + elm.dragCfg.cursorAt.right;
					elm.dragCfg.oC.x = elm.dragCfg.pointer.x - elm.dragCfg.oC.wb + elm.dragCfg.cursorAt.right;
				}
				if (elm.dragCfg.cursorAt.bottom) {
					elm.dragCfg.oR.y += elm.dragCfg.pointer.y - elm.dragCfg.oC.y - elm.dragCfg.oC.hb + elm.dragCfg.cursorAt.bottom;
					elm.dragCfg.oC.y = elm.dragCfg.pointer.y - elm.dragCfg.oC.hb + elm.dragCfg.cursorAt.bottom;
				}
			}
			elm.dragCfg.nx = elm.dragCfg.oR.x;
			elm.dragCfg.ny = elm.dragCfg.oR.y;

			if (elm.dragCfg.insideParent || elm.dragCfg.containment == 'parent') {
				parentBorders = jQuery.iUtil.getBorder(elm.parentNode, true);
				elm.dragCfg.oC.x = elm.offsetLeft + (jQuery.browser.msie ? 0 : jQuery.browser.opera ? -parentBorders.l : parentBorders.l);
				elm.dragCfg.oC.y = elm.offsetTop + (jQuery.browser.msie ? 0 : jQuery.browser.opera ? -parentBorders.t : parentBorders.t);
				jQuery(elm.parentNode).append(jQuery.iDrag.helper.get(0));
			}
			if (elm.dragCfg.containment) {
				jQuery.iDrag.getContainment(elm);
				elm.dragCfg.onDragModifier.containment = jQuery.iDrag.fitToContainer;
			}

			if (elm.dragCfg.si) {
				jQuery.iSlider.modifyContainer(elm);
			}

			dhs.left = elm.dragCfg.oC.x - elm.dragCfg.diffX + 'px';
			dhs.top = elm.dragCfg.oC.y - elm.dragCfg.diffY + 'px';
			//resize the helper to fit the clone
			dhs.width = elm.dragCfg.oC.wb + 'px';
			dhs.height = elm.dragCfg.oC.hb + 'px';

			jQuery.iDrag.dragged.dragCfg.prot = false;

			if (elm.dragCfg.gx) {
				elm.dragCfg.onDragModifier.grid = jQuery.iDrag.snapToGrid;
			}
			if (elm.dragCfg.zIndex != false) {
				jQuery.iDrag.helper.css('zIndex', elm.dragCfg.zIndex);
			}
			if (elm.dragCfg.opacity) {
				jQuery.iDrag.helper.css('opacity', elm.dragCfg.opacity);
				if (window.ActiveXObject) {
					jQuery.iDrag.helper.css('filter', 'alpha(opacity=' + elm.dragCfg.opacity * 100 + ')');
				}
			}

			if(elm.dragCfg.frameClass) {
				jQuery.iDrag.helper.addClass(elm.dragCfg.frameClass);
				jQuery.iDrag.helper.get(0).firstChild.style.display = 'none';
			}
			if (elm.dragCfg.onStart)
				elm.dragCfg.onStart.apply(elm, [clonedEl, elm.dragCfg.oR.x, elm.dragCfg.oR.y]);
			if (jQuery.iDrop && jQuery.iDrop.count > 0 ){
				jQuery.iDrop.highlight(elm);
			}
			if (elm.dragCfg.ghosting == false) {
				dEs.display = 'none';
			}
			return false;
		},

		getContainment : function(elm)
		{
			if (elm.dragCfg.containment.constructor == String) {
				if (elm.dragCfg.containment == 'parent') {
					elm.dragCfg.cont = jQuery.extend(
						{x:0,y:0},
						jQuery.iUtil.getSize(elm.parentNode)
					);
					var contBorders = jQuery.iUtil.getBorder(elm.parentNode, true);
					elm.dragCfg.cont.w = elm.dragCfg.cont.wb - contBorders.l - contBorders.r;
					elm.dragCfg.cont.h = elm.dragCfg.cont.hb - contBorders.t - contBorders.b;
				} else if (elm.dragCfg.containment == 'document') {
					var clnt = jQuery.iUtil.getClient();
					elm.dragCfg.cont = {
						x : 0,
						y : 0,
						w : clnt.w,
						h : clnt.h
					};
				}
			} else if (elm.dragCfg.containment.constructor == Array) {
				elm.dragCfg.cont = {
					x : parseInt(elm.dragCfg.containment[0])||0,
					y : parseInt(elm.dragCfg.containment[1])||0,
					w : parseInt(elm.dragCfg.containment[2])||0,
					h : parseInt(elm.dragCfg.containment[3])||0
				};
			}
			elm.dragCfg.cont.dx = elm.dragCfg.cont.x - elm.dragCfg.oC.x;
			elm.dragCfg.cont.dy = elm.dragCfg.cont.y - elm.dragCfg.oC.y;
		},

		hidehelper : function(dragged)
		{
			if (dragged.dragCfg.insideParent || dragged.dragCfg.containment == 'parent') {
				jQuery('body', document).append(jQuery.iDrag.helper.get(0));
			}
			jQuery.iDrag.helper.empty().hide().css('opacity', 1);
			if (window.ActiveXObject) {
				jQuery.iDrag.helper.css('filter', 'alpha(opacity=100)');
			}
		},

		dragstop : function(e)
		{

			jQuery(document)
				.unbind('mousemove', jQuery.iDrag.dragmove)
				.unbind('mouseup', jQuery.iDrag.dragstop);

			if (jQuery.iDrag.dragged == null) {
				return;
			}
			var dragged = jQuery.iDrag.dragged;

			jQuery.iDrag.dragged = null;

			if (dragged.dragCfg.init == false) {
				return false;
			}
			if (dragged.dragCfg.so == true) {
				jQuery(dragged).css('position', dragged.dragCfg.oP);
			}
			var dEs = dragged.style;

			if (dragged.si) {
				jQuery.iDrag.helper.css('cursor', 'move');
			}
			if(dragged.dragCfg.frameClass) {
				jQuery.iDrag.helper.removeClass(dragged.dragCfg.frameClass);
			}

			if (dragged.dragCfg.revert == false) {
				if (dragged.dragCfg.fx > 0) {
					if (!dragged.dragCfg.axis || dragged.dragCfg.axis == 'horizontally') {
						var x = new jQuery.fx(dragged,{duration:dragged.dragCfg.fx}, 'left');
						x.custom(dragged.dragCfg.oR.x,dragged.dragCfg.nRx);
					}
					if (!dragged.dragCfg.axis || dragged.dragCfg.axis == 'vertically') {
						var y = new jQuery.fx(dragged,{duration:dragged.dragCfg.fx}, 'top');
						y.custom(dragged.dragCfg.oR.y,dragged.dragCfg.nRy);
					}
				} else {
					if (!dragged.dragCfg.axis || dragged.dragCfg.axis == 'horizontally')
						dragged.style.left = dragged.dragCfg.nRx + 'px';
					if (!dragged.dragCfg.axis || dragged.dragCfg.axis == 'vertically')
						dragged.style.top = dragged.dragCfg.nRy + 'px';
				}
				jQuery.iDrag.hidehelper(dragged);
				if (dragged.dragCfg.ghosting == false) {
					jQuery(dragged).css('display', dragged.dragCfg.oD);
				}
			} else if (dragged.dragCfg.fx > 0) {
				dragged.dragCfg.prot = true;
				var dh = false;
				if(jQuery.iDrop && jQuery.iSort && dragged.dragCfg.so) {
					dh = jQuery.iUtil.getPosition(jQuery.iSort.helper.get(0));
				}
				jQuery.iDrag.helper.animate(
					{
						left : dh ? dh.x : dragged.dragCfg.oC.x,
						top : dh ? dh.y : dragged.dragCfg.oC.y
					},
					dragged.dragCfg.fx,
					function()
					{
						dragged.dragCfg.prot = false;
						if (dragged.dragCfg.ghosting == false) {
							dragged.style.display = dragged.dragCfg.oD;
						}
						jQuery.iDrag.hidehelper(dragged);
					}
				);
			} else {
				jQuery.iDrag.hidehelper(dragged);
				if (dragged.dragCfg.ghosting == false) {
					jQuery(dragged).css('display', dragged.dragCfg.oD);
				}
			}

			if (jQuery.iDrop && jQuery.iDrop.count > 0 ){
				jQuery.iDrop.checkdrop(dragged);
			}
			if (jQuery.iSort && dragged.dragCfg.so) {
				jQuery.iSort.check(dragged);
			}
			if (dragged.dragCfg.onChange && (dragged.dragCfg.nRx != dragged.dragCfg.oR.x || dragged.dragCfg.nRy != dragged.dragCfg.oR.y)){
				dragged.dragCfg.onChange.apply(dragged, dragged.dragCfg.lastSi||[0,0,dragged.dragCfg.nRx,dragged.dragCfg.nRy]);
			}
			if (dragged.dragCfg.onStop)
				dragged.dragCfg.onStop.apply(dragged);
			return false;
		},

		snapToGrid : function(x, y, dx, dy)
		{
			if (dx != 0)
				dx = parseInt((dx + (this.dragCfg.gx * dx/Math.abs(dx))/2)/this.dragCfg.gx) * this.dragCfg.gx;
			if (dy != 0)
				dy = parseInt((dy + (this.dragCfg.gy * dy/Math.abs(dy))/2)/this.dragCfg.gy) * this.dragCfg.gy;
			return {
				dx : dx,
				dy : dy,
				x: 0,
				y: 0
			};
		},

		fitToContainer : function(x, y, dx, dy)
		{
			dx = Math.min(
					Math.max(dx,this.dragCfg.cont.dx),
					this.dragCfg.cont.w + this.dragCfg.cont.dx - this.dragCfg.oC.wb
				);
			dy = Math.min(
					Math.max(dy,this.dragCfg.cont.dy),
					this.dragCfg.cont.h + this.dragCfg.cont.dy - this.dragCfg.oC.hb
				);

			return {
				dx : dx,
				dy : dy,
				x: 0,
				y: 0
			}
		},

		dragmove : function(e)
		{
			if (jQuery.iDrag.dragged == null || jQuery.iDrag.dragged.dragCfg.prot == true) {
				return;
			}

			var dragged = jQuery.iDrag.dragged;

			dragged.dragCfg.currentPointer = jQuery.iUtil.getPointer(e);
			if (dragged.dragCfg.init == false) {
				distance = Math.sqrt(Math.pow(dragged.dragCfg.pointer.x - dragged.dragCfg.currentPointer.x, 2) + Math.pow(dragged.dragCfg.pointer.y - dragged.dragCfg.currentPointer.y, 2));
				if (distance < dragged.dragCfg.snapDistance){
					return;
				} else {
					jQuery.iDrag.dragstart(e);
				}
			}

			var dx = dragged.dragCfg.currentPointer.x - dragged.dragCfg.pointer.x;
			var dy = dragged.dragCfg.currentPointer.y - dragged.dragCfg.pointer.y;

			for (var i in dragged.dragCfg.onDragModifier) {
				var newCoords = dragged.dragCfg.onDragModifier[i].apply(dragged, [dragged.dragCfg.oR.x + dx, dragged.dragCfg.oR.y + dy, dx, dy]);
				if (newCoords && newCoords.constructor == Object) {
					dx = i != 'user' ? newCoords.dx : (newCoords.x - dragged.dragCfg.oR.x);
					dy = i != 'user' ? newCoords.dy : (newCoords.y - dragged.dragCfg.oR.y);
				}
			}

			dragged.dragCfg.nx = dragged.dragCfg.oC.x + dx - dragged.dragCfg.diffX;
			dragged.dragCfg.ny = dragged.dragCfg.oC.y + dy - dragged.dragCfg.diffY;

			if (dragged.dragCfg.si && (dragged.dragCfg.onSlide || dragged.dragCfg.onChange)) {
				jQuery.iSlider.onSlide(dragged, dragged.dragCfg.nx, dragged.dragCfg.ny);
			}

			if(dragged.dragCfg.onDrag)
				dragged.dragCfg.onDrag.apply(dragged, [dragged.dragCfg.oR.x + dx, dragged.dragCfg.oR.y + dy]);

			if (!dragged.dragCfg.axis || dragged.dragCfg.axis == 'horizontally') {
				dragged.dragCfg.nRx = dragged.dragCfg.oR.x + dx;
				jQuery.iDrag.helper.get(0).style.left = dragged.dragCfg.nx + 'px';
			}
			if (!dragged.dragCfg.axis || dragged.dragCfg.axis == 'vertically') {
				dragged.dragCfg.nRy = dragged.dragCfg.oR.y + dy;
				jQuery.iDrag.helper.get(0).style.top = dragged.dragCfg.ny + 'px';
			}

			if (jQuery.iDrop && jQuery.iDrop.count > 0 ){
				jQuery.iDrop.checkhover(dragged);
			}
			return false;
		},

		build : function(o)
		{
			if (!jQuery.iDrag.helper) {
				jQuery('body',document).append('<div id="dragHelper"></div>');
				jQuery.iDrag.helper = jQuery('#dragHelper');
				var el = jQuery.iDrag.helper.get(0);
				var els = el.style;
				els.position = 'absolute';
				els.display = 'none';
				els.cursor = 'move';
				els.listStyle = 'none';
				els.overflow = 'hidden';
				if (window.ActiveXObject) {
					el.unselectable = "on";
				} else {
					els.mozUserSelect = 'none';
					els.userSelect = 'none';
					els.KhtmlUserSelect = 'none';
				}
			}
			if (!o) {
				o = {};
			}
			return this.each(
				function()
				{
					if (this.isDraggable || !jQuery.iUtil)
						return;
					if (window.ActiveXObject) {
						this.onselectstart = function(){return false;};
						this.ondragstart = function(){return false;};
					}
					var el = this;
					var dhe = o.handle ? jQuery(this).find(o.handle) : jQuery(this);
					if(jQuery.browser.msie) {
						dhe.each(
							function()
							{
								this.unselectable = "on";
							}
						);
					} else {
						dhe.css('-moz-user-select', 'none');
						dhe.css('user-select', 'none');
						dhe.css('-khtml-user-select', 'none');
					}
					this.dragCfg = {
						dhe: dhe,
						revert : o.revert ? true : false,
						ghosting : o.ghosting ? true : false,
						so : o.so ? o.so : false,
						si : o.si ? o.si : false,
						insideParent : o.insideParent ? o.insideParent : false,
						zIndex : o.zIndex ? parseInt(o.zIndex)||0 : false,
						opacity : o.opacity ? parseFloat(o.opacity) : false,
						fx : parseInt(o.fx)||null,
						hpc : o.hpc ? o.hpc : false,
						onDragModifier : {},
						pointer : {},
						onStart : o.onStart && o.onStart.constructor == Function ? o.onStart : false,
						onStop : o.onStop && o.onStop.constructor == Function ? o.onStop : false,
						onChange : o.onChange && o.onChange.constructor == Function ? o.onChange : false,
						axis : /vertically|horizontally/.test(o.axis) ? o.axis : false,
						snapDistance : o.snapDistance ? parseInt(o.snapDistance)||0 : 0,
						cursorAt: o.cursorAt ? o.cursorAt : false,
						autoSize : o.autoSize ? true : false,
						frameClass : o.frameClass || false

					};
					if (o.onDragModifier && o.onDragModifier.constructor == Function)
						this.dragCfg.onDragModifier.user = o.onDragModifier;
					if (o.onDrag && o.onDrag.constructor == Function)
						this.dragCfg.onDrag = o.onDrag;
					if (o.containment && ((o.containment.constructor == String && (o.containment == 'parent' || o.containment == 'document')) || (o.containment.constructor == Array && o.containment.length == 4) )) {
						this.dragCfg.containment = o.containment;
					}
					if(o.fractions) {
						this.dragCfg.fractions = o.fractions;
					}
					if(o.grid){
						if(typeof o.grid == 'number'){
							this.dragCfg.gx = parseInt(o.grid)||1;
							this.dragCfg.gy = parseInt(o.grid)||1;
						} else if (o.grid.length == 2) {
							this.dragCfg.gx = parseInt(o.grid[0])||1;
							this.dragCfg.gy = parseInt(o.grid[1])||1;
						}
					}
					if (o.onSlide && o.onSlide.constructor == Function) {
						this.dragCfg.onSlide = o.onSlide;
					}

					this.isDraggable = true;
					dhe.each(
						function(){
							this.dragElem = el;
						}
					);
					dhe.bind('mousedown', jQuery.iDrag.draginit);
				}
			)
		}
	};

	/**
	 * Destroy an existing draggable on a collection of elements
	 *
	 * @name DraggableDestroy
	 * @descr Destroy a draggable
	 * @type jQuery
	 * @cat Plugins/Interface
	 * @example $('#drag2').DraggableDestroy();
	 */

	jQuery.fn.extend(
		{
			DraggableDestroy : jQuery.iDrag.destroy,
			Draggable : jQuery.iDrag.build
		}
	);
});/**
 * 图片预览
 * @author trumpli
 * @date 14-1-03
 */
define.pack("./image_preview",["lib","common","./mode","./view","./store"],function (require, exports, module) {
    var console = require('lib').get('./console'),
        common = require('common'),

        img_ready = common.get('./imgReady').get_instance({ns: 'image_preview'}),
        user_log = common.get('./user_log'),

        mode = require('./mode'),
        view = require('./view'),
        store = require('./store'),
        options,
        undefined;
    //记录缩略图加载情况->重试三次加载
    var thumbs = {
        _tid: null,
        init: function (total) {
            var me = this;
            me.total = total;
            me.len = 0;
            me.ok = {len: 0};
            me.er = {len: 0};
            if (me._tid) {
                clearTimeout(me._tid);
                me._tid = null;
            }
            me.load_time = 0;
        },
        add: function (is_ok, index ,src) {
            var me = this;
            if (is_ok) {
                me.ok[index] = true;
                me.ok.len += 1;
            } else {
                me.er[index] = src;
                me.er.len += 1;
            }
            me.len += 1;
            //缩略图加载完成，出现超过3次加载失败，重新加载这些失败的图片  ; 重复加载次数为2次
            if (me.len === me.total && me.load_time <= 2) {
                if (me.er.len > 0) {
                    if(!options.disable_reload_thumb){//禁止自动重试加载缩略图
                        console.debug('reload');
                        me.reload();
                    }
                }
            }
        },
        reload: function () {
            this._tid = setTimeout(function () {
                var me = thumbs;
                for(var key in me.er){
                    if(key !== 'len'){
                        img_ready.add_thumb(me.er[key] + '&reload=' + me.load_time, key);
                    }
                }
                me.len -= me.er.len;
                me.er = {len:0};
                me.load_time += 1;
                img_ready.start_load();
            }, 1500);
        }
    };
    var image_preview = new mode({
        watch_ns: ['view', 'store'],
        /**
         * 开始预览
         * @param o
         */
        start: function (o) {
            o.total = o.total || 1;
            options = o;
            store.invoke('init', [ o.total, o.index || 0, view.get_visible_size() , ( !o.hasOwnProperty('complete') || o.complete === true), o.images]);
            view.invoke('spec', [
                { remove: !!o.remove, share: !!o.share, download: !!o.download, code: !!o.code, zoomin: o.zoomin !== 'false', zoomout: o.zoomout !== 'false', match: o.match !== 'false', back: !!o.back, close: true }
            ]);
        },
        //图片加载
        loader: {
            //图片加载成功
            on_ok: function (img, index, width, height) {
                //大图
                if (index.indexOf('_big') > 0) {
                    view.invoke('image_state.done', [index.replace('_big', '') - 0, img, width, height]);//开始预览指定图片
                }
                //缩略图
                else {
                    thumbs.add(true, index);
                    view.invoke('thumb_state.done', [img, index]);//开始预览指定图片
                }
            },
            //图片加载失败
            on_er: function (img, index) {
                //大图预览失败
                if (index.indexOf('_big') > 0) {
                    view.invoke('image_state.error');
                }
                //缩略图预览失败
                else {
                    thumbs.add(false, index , img.src);
                }
            },
            //加载大图
            // 恶心了一把离线文件比较特殊，目前还没有拉缩略图接口，所以还得使用老的方法以方法参数get_url,get_thumb_url传入
            image: function (index, src, is_gif) {
                var me = this,
                    id = index + '_big';
                view.invoke('image_state.start', [index]);//开始预览指定图片
                if(!src && options.get_url) {
                    src = options.get_url.call(me, index, options)
                } else {
                    src = src ? src + (is_gif ? '': (src.indexOf('?') > -1 ? '&' : '?') + 'size=1024*1024') : '';
                }
                if (src) {
                    img_ready.add_thumb(src, id);
                    img_ready.priority_sort(id);
                    img_ready.start_load();
                } else {
                    me.on_er(null, id);
                }
            },
            //加载缩略图
            thumb: function (index, src) {
                if(!src && options.get_thumb_url) {
                    src = options.get_thumb_url.call(this, index, options, 64);
                } else {
                    src = src + (src.indexOf('?') > -1 ? '&' : '?') + 'size=64*64';
                }
                src && img_ready.add_thumb(src, index + '');
            }
        },
        store_watch: {
            //预览靠近边界时，执行回调
            touch_border: function () {
                var me = this;
                if (!me._request_border) {
                    me._request_border = true;
                    options.load_more(function (ret) {
                        me._request_border = false;
                        if (!ret.fail) {
                            store.invoke('adjust_entry', [ ret.complete , ret.total, ret.images ]);
                            options.images = ret.images;
                        } else {
                            console.debug('image_preview touch_border callback fail')
                        }
                    });
                }
            },
            //加载大图
            load_image: function (index, url, is_gif) {
                this.loader.image(index, url, is_gif);
            },
            //加载缩略图
            load_thumb: function (o, urls) {
                thumbs.init(o.max - o.min + 1);
                for (var i = o.min; i < (o.max + 1); i++) {
                    if(options.get_thumb_url) {
                        this.loader.thumb(i);
                    } else {
                        var file = options.images[i];
                        this.loader.thumb(i, urls[file.get_id()]);
                    }
                }
                img_ready.start_load();

            },
            //开始加载
            load_start: function () {
                img_ready.destroy();
                img_ready.render(this.loader.on_ok, this.loader.on_er);
            }
        },
        view_watch: {
            //销毁
            destroy: function () {
                user_log('IMAGE_PREVIEW_CLOSE');
	            view.invoke('image_state.close', [function() {
		            store.invoke('destroy');
		            options.close && options.close.call();
		            options = null;
                }]);
            },
            //返回
            back: function () {
                user_log('IMAGE_PREVIEW_CLOSE');
                store.invoke('destroy');
                options.back && options.back.call();
                options = null;
            },
            //分享
            share: function (e) {
                if (options.share) {
                    user_log('IMAGE_PREVIEW_SHARE');
                    options.share.call(this, store.get_index(), e);
                }
            },
            //删除
            remove: function (e) {
                if (options.remove) {
                    user_log('IMAGE_PREVIEW_REMOVE');
                    var index = store.get_index();
                    options.remove.call(this, index, function () {
                        store.invoke('remove', [index]);
                    }, e);
                }
            },
            //下载
            download: function (e) {
                if (options.download) {
                    user_log('IMAGE_PREVIEW_DOWNLOAD');
                    options.download.call(this, store.get_index(), e);
                }
            },
            //二维码
            code: function (e) {
                if (options.code) {
                    user_log('IMAGE_PREVIEW_CODE');
                    options.code.call(this, store.get_index(), e);
                }
            },
	        //放大
	        zoomin: function (e) {
		        if (typeof options.zoomin === 'function') {
			        options.zoomin.call(this, store.get_index(), e);
		        } else {
			        view.invoke('image_state.zoomin');
		        }
	        },
	        //缩小
	        zoomout: function (e) {
		        if (typeof options.zoomout === 'function') {
			        options.zoomout.call(this, store.get_index(), e);
		        } else {
			        view.invoke('image_state.zoomout');
		        }
	        },
	        //自适应
	        match: function (e) {
		        if (typeof options.match === 'function') {
			        options.match.call(this, store.get_index(), e);
		        } else {
			        view.invoke('image_state.match');
		        }
	        },
            //选中
            pick: function (index) {
                user_log('IMAGE_PREVIEW_THUMB_PICK');
                store.invoke('pick', [index]);
            },
            //前一个图
            prev: function () {
                user_log('IMAGE_PREVIEW_NAV_PREV');
                store.invoke('prev');
            },
            //下一个图
            next: function () {
                user_log('IMAGE_PREVIEW_NAV_NEXT');
                store.invoke('next');
            },
            //前一个组
            prev_group: function () {
                user_log('IMAGE_PREVIEW_THUMB_PREV');
                store.invoke('prev_group');
            },
            //后一个组
            next_group: function () {
                user_log('IMAGE_PREVIEW_THUMB_NEXT');
                store.invoke('next_group');
            },
            //收起
            expansion_up: function () {
                user_log('IMAGE_PREVIEW_EXPANSION_UP');
            },
            //展开
            expansion_down: function () {
                user_log('IMAGE_PREVIEW_EXPANSION_DOWN');
            },
            //窗口宽度调整
            window_resize: function () {
                store.invoke('adjust_area', [view.get_visible_size(), true]);
            }
        }
    });
    return image_preview;
});/**
 * 图片预览
 * @author trumpli
 * @date 14-1-03
 */
define.pack("./mode",["$","lib","common"],function (require, exports, module) {
    var $ = require('$'),
        events = require('lib').get('./events'),
        event = require('common').get('./global.global_event').namespace('image_preview_event'),
        sub_mode = function (o) {
            var me = this;
            $.extend(me, o, events);
            if (me.watch_ns) {
                var len = me.watch_ns.length;
                while (len) {
                    len -= 1;
                    sub_mode.watch.call(me, me.watch_ns[len]);
                }
            }
        };
    sub_mode.watch = function (ns) {
        this.listenTo(event, ns, function () {
            var fn_name = Array.prototype.shift.call(arguments),
                match_name = ns + '_watch';
            if (this[match_name][fn_name]) {
                this[match_name][fn_name].apply(this, arguments);
            }
        });
    };
    $.extend(sub_mode.prototype, {
        get_ctx: function () {
            return this;
        },
        invoke: function (ns, args) {
            ns = ns.split('.');
            var ctx = this.get_ctx()[ns[0]];
            if (ctx) {
                args = args || [];
                if (typeof ctx === 'function') {
                    ctx.apply(this, args);
                } else if (ns[1] && typeof ctx[ns[1]] === 'function') {
                    ctx[ns[1]].apply(this, args);
                }
            }
        },
        happen: function () {
            Array.prototype.unshift.call(arguments, this.ns);
            event.trigger.apply(event, arguments);
        }
    });
    return sub_mode;
});/**
 * 图片预览 Store
 * @author trumpli
 * @date 14-01-03
 */
define.pack("./store",["lib","./mode","downloader"],function (require, exports, module) {
    var console = require('lib').get('./console'),
        mode = require('./mode'),
        thumb_url_loader = require('downloader').get('./thumb_url_loader'),
        history = {
            update: function (area) {
                this.from = area.min;
                this.to = area.max;
            },
            get_from: function () {
                return this.from;
            },
            get_to: function () {
                return this.to;
            },
            changed: function (area) {
                return (this.from !== area.min || this.to !== area.max);
            }
        },
        action = {
            destroy: function () {
                var me = this;
                me.entry = {};
                me.area = {};
                me.images = null;
                me.urls = null;
                me.happen('destroy');
            },
            /**
             * @param total 总数
             * @param curr 当前位置
             * @param area_size 显示区域大小
             * @param complete 是否已加载完成
             */
            init: function (total, curr, area_size, complete, images) {
                var me = this,
                    entry = me.entry = { max: total - 1, cur: curr, min: 0, complete: complete },
                    size = Math.min(entry.max, area_size - 1),
                    area = me.area = { min: entry.min, max: entry.min + Math.max(size, 0), size: size };
                if (curr > size) {
                    area.min = curr;
                    area.max = Math.min((curr + Math.max(size, 0) - (entry.complete ? 0 : 1)), entry.max);
                    if (area.max - area.min < size) {
                        area.min = Math.max(area.max - size, entry.min);
                    }
                }

                me.images = images;
                me.urls = {};
                history.update(area);
                me.happen('init', area);
                action.get_thumb_urls.call(me).done(function() {
                    me.change({ thumb: true, image: true });
                });
            },
            /**
             * 调整实体对象 外部触发
             * @param complete
             * @param total
             */
            adjust_entry: function (complete, total, images) {
                this.entry.complete = complete;
                this.entry.max = total - 1;
                this.fresh_ok = true;
                this.images = images;

                var me = this;
                //预先加载后面的100个url
                action.get_thumb_urls.call(me).done(function(urls) {
                    me.change({ thumb: true, urls: urls});
                });
            },
            /**
             * 窗口重置改变缩略图显示区域宽度
             * @param size
             */
            adjust_area: function (size) {
                var me = this, E = me.entry , max = E.max, min = E.min,
                    new_size = Math.min(max, size - 1), diff = new_size - me.area.size;
                //不具备伸缩性( 列表长度为1 or 新size和旧size一致 )
                if (max === min || diff === 0)
                    return;
                //以当前预览大图为中心点，左右伸缩/扩展，以entry为边界通过左右互补的方式处理溢出问题，
                var from = history.get_from(), to = history.get_to(), rate = (E.cur - from) / (to - from);
                from -= rate * diff;
                to += (1 - rate) * diff;

                if (from < min) {
                    to += min - from;
                    from = min;
                }
                if (to > max) {
                    diff = max - to;
                    to = max;
                    diff > from ? (from = min) : (from -= diff);
                }

                me.area = {
                    max: parseInt(to),
                    min: parseInt(from),
                    size: new_size
                };
                history.update(me.area);
                me.change({ thumb: true });
            },
            /**
             * 同步历史
             */
            _sync: function () {
                var me = this, area = me.area;
                if (history.changed(area)) {
                    area.max = history.get_to();
                    area.min = history.get_from();
                    me.change({ thumb: true});
                }

            },
            /**
             * prev
             */
            prev: function () {
                var me = this, entry = me.entry, is_prev_group = false;
                action._sync.call(me);
                if (entry.cur === history.get_from()) {
                    action.prev_group.call(me);
                    is_prev_group = true;
                }
                entry.cur -= 1;
                me.change({ image: true });
                if(!is_prev_group) {
                    action.load_more_thumb_urls_if.call(me);
                }
                history.update(me.area);
            },
            /**
             * next
             */
            next: function () {
                var me = this, entry = me.entry, is_next_group = false;
                if(this.loading_urls) {
                    return;
                }
                //不同时满足： 1:达到最大边界,2:数据还有更多,3:异步请求中
                if (entry.cur !== entry.max || entry.complete || me.fresh_ok) {
                    action._sync.call(me);
                    if (entry.cur === history.get_to()) {
                        action.next_group.call(me);
                        is_next_group = true;
                    }
                    entry.cur += 1;
                    me.change({ image: true });
                    if(!is_next_group) {
                        action.load_more_thumb_urls_if.call(me);
                    }
                    history.update(me.area);
                }
            },
            /**
             * 选中某个数据项
             * @param index
             */
            pick: function (index) {
                var me = this, entry = me.entry , area = me.area, is_next_group = false;
                //同一个位置，重新加载图片
                if (index === entry.cur) {
                    me.change({ image: true });
                } else {
                    //达到缩略图显示边界 : 移动到下一组，选中当前index
                    if (index > area.max) {
                        action.next_group.call(me);
                        is_next_group = true;
                    }
                    entry.cur = index;
                    if(!is_next_group) {
                        me.change({ image: true, thumb: true});
                        action.load_more_thumb_urls_if.call(me);
                    }

                }
                history.update(area);
            },
            /**
             * 上一组
             */
            prev_group: function () {
                var me = this, entry = me.entry, area = me.area;
                area.min = Math.max(area.min - area.size - 1, entry.min);
                area.max = Math.min(area.min + area.size, entry.max);
                action.get_thumb_urls.call(me).done(function() {
                    me.change({ thumb: true, image: true});
                });
            },
            /**
             * 下一组
             */
            next_group: function () {
                var me = this, entry = me.entry, area = me.area, size = area.size;
                //不同时满足： 1:达到最大边界,2:数据还有更多,3:异步请求中
                if (area.max !== entry.max || entry.complete || me.fresh_ok) {
                    area.max = Math.min(area.max + size + 1, entry.max);
                    area.min = Math.max(area.max - size, entry.min);
                    //可视区域已经达到边界,并且总数加载不全-->显示区域最大边界加1，并触发边界touch : 向前要一个位置，用于提醒用户，后面还有数据
                    if (area.max === entry.max && !entry.complete) {
                        area.min = Math.max(area.max - size - 1, entry.min);
                        area.max = entry.max - 1;
                        me.fresh_ok = false;
                        me.happen('touch_border');
                    } else {
                        action.get_thumb_urls.call(me).done(function() {
                            me.change({ thumb: true, image: true});
                        });
                    }

                }
            },
            /**
             * remove
             */
            remove: function (index) {
                var me = this, area = me.area, entry = me.entry;
                entry.max -= 1;
                if (area.max >= entry.max) {
                    area.max = entry.max;
                    area.min -= (area.min !== entry.min) ? 1 : 0;
                }
                entry.cur -= entry.cur > area.max ? 1 : 0;
                if (area.max < 0) {//没有任何图片
                    me.invoke('destroy');
                } else {
                    me.happen('remove', index);
                    action.get_thumb_urls.call(me).done(function() {
                        me.change({ thumb: true, image: true});
                    });

                }
                history.update(me.area);
            },
            /**
             * 判断是否可以去先加载url
             */
            load_more_thumb_urls_if: function() {
                var entry = this.entry,
                    area = this.area,
                    me = this;

                if(entry.cur + 4 > area.max || entry.cur - 4 < area.min) {
                    action.get_thumb_urls.call(this).done(function(urls) {
                        me.change({ thumb: true, image: true});
                    });
                }
            },

            /**
             * 加载url
             * @returns {*}
             */
            get_thumb_urls: function() {
                var area = this.area,
                    min = Math.max(area.min-20, 0),
                    max = area.max + 30,
                    def = $.Deferred(),
                    me = this;
                if(!this.images) {//离线文件不在这里加载缩略图url
                    def.resolve();
                    return def;
                }
                this.loading_urls = true;
                var images = this.images.slice(min, max);

                thumb_url_loader.get_urls(images).done(function(urls) {
                    $.extend(me.urls, urls);
                    def.resolve(urls);
                    me.loading_urls = false;
                });

                return def;
            }
        };

    return new mode({
        ns: 'store',
        /**
         * @override
         */
        get_ctx: function () {
            return action;
        },
        change: function (o) {
            var me = this, entry = me.entry , cur = entry.cur , area = me.area, urls = me.urls;
            //-->1:加载大图
            if (o.image) {
                var file_id = me.images && me.images[me.entry.cur].get_id();
                var is_gif = me.images && me.images[me.entry.cur].get_type() === 'gif';
	            me.happen('load_start');
                me.happen('load_image', me.entry.cur, urls[file_id], is_gif);
            }
            //-->2:缩略图html结构,加载缩略图
            if (o.thumb) {
                me.happen('load_html', me.get_area());
                me.happen('load_start');
                me.happen('load_thumb', me.get_area(), urls);
            }

            //-->3:选中预览的图片/view页面限制条件
            me.happen('selected', {
                index: cur,
                max: entry.max,
                has_prev: cur !== entry.min,
                has_next: cur !== entry.max || !entry.complete,
                has_prev_group: area.min > entry.min,
                has_next_group: (area.max < entry.max) || !entry.complete,
                complete: entry.complete
            });

        },
        /**
         * view可视区域
         * @returns {{min: int, max: int}}
         */
        get_area: function () {
            var area = this.area, entry = this.entry;
            return {
                min: area.min,
                max: area.max >= entry.max ? area.max : area.max + 1
            };
        },
        /**
         * 当前正在预览的位置
         * @returns {int}
         */
        get_index: function () {
            return this.entry.cur;
        }
    });
});/**
 * 图片预览 Store
 * @author trumpli
 * @date 14-01-03
 */
define.pack("./view",["$","common","lib","./tmpl","./mode","./idrag"],function (require, exports, module) {
    var $ = require('$'),
	    common = require('common'),

        console = require('lib').get('./console'),
        functional = common.get('./util.functional'),
        widgets = common.get('./ui.widgets'),
        constants = common.get('./constants'),

        tmpl = require('./tmpl'),
        mode = require('./mode'),
	    idrag = require('./idrag'),
        $win = $(window),
        $doc = $(document),
        wheel_event = $.browser.msie || $.browser.webkit ? 'mousewheel' : 'DOMMouseScroll',
        isIe6 = !-[1, ] && !('minWidth' in document.documentElement.style),
        undefined;
    var view = new mode({
        ns: 'view',
        watch_ns: ['store'],
        //可以展示的缩略图数目
        get_visible_size: function () {
            return Math.floor(( $win.width() - 2 * 71 ) / 58);
        },
        //show遮盖
        show_mask: function () {
            widgets.mask.always_styles({
                opacity: 0.9,//透明度
                bg_color: '#000'//背景色
            });
            widgets.mask.show('image_previewer', this.$view);
        },
        //hide遮盖
        hide_mask: function () {
            widgets.mask.remove_styles();
            widgets.mask.hide('image_previewer');
        },
        //渲染(ui、event)
        _render: {
            ie6: function () {
                if (isIe6) {
                    this.$view.repaint();
                }
            },
            activate: function () {
                var me = this;
                //只渲染一次
                if (!me._run_once) {
                    me._run_once = true;
                    me._render.once.call(me);
                }
                //监听重置窗口-->宽度变化，影响缩略图显示个数 / 调整预览图位置
                $win.on('resize.image_preview_view', functional.throttle(function () {
                    me.happen('window_resize');
                    me.image_state.location.call(me);
                    me._render.ie6.call(me);
                }, 100));
                //键盘快捷按键-->37:前,39:后,46:删除
                $doc.on('keyup.image_preview_view', function (e) {
                    e.preventDefault();
                    switch (e.which) {
                        case 37:
                            if (!me.children.$prev.hasClass('disable')) {
                                me.happen('prev');
                            }
                            break;
                        case 39:
                            if (!me.children.$next.hasClass('disable')) {
                                me.happen('next');
                            }
                            break;
                        case 46:
                            me.happen('remove');
                            break;
                        case 27:
                            me.happen('destroy');
                            break;
                    }
                });
                //滚动快捷键-->向上：向前翻 ; 向下： 向后翻
                $doc.on(wheel_event + '.image_preview_view', function (e) {
                    if (!me._scroll_time || (+new Date() - me._scroll_time > 50)) {
                        if (((e.originalEvent.wheelDelta || -e.originalEvent.detail) > 0 ? -1 : 1) === 1) {
                            if (!me.children.$next.hasClass('disable')) {
                                me.happen('next');
                            }
                        } else {
                            if (!me.children.$prev.hasClass('disable')) {
                                me.happen('prev');
                            }
                        }
                    }
                    me._scroll_time = +new Date();
                });
            },
            deactivate: function () {
                $win.off('resize.image_preview_view');
                $doc.off('keyup.image_preview_view');
                $doc.off(wheel_event + '.image_preview_view');
            },
            once: function () {
                var me = this, $view = me.$view = $(tmpl.image_preview_box()).appendTo($('body')),
                    m = me.children = {
	                    $bd: $view.find('.j-preview-bd'),//头容器
	                    $ft: $view.find('.j-preview-ft'),//底容器
                        $big_img: $view.find('[data-id="big_img"]'),//大图容器
                        $expansion: $view.find('[data-id="expansion"]'),//缩略图开关按钮
                        $total_info: $view.find('[data-id="total-info"]'),//定位信息（第3/63张）
                        $list: $view.find('[data-id="img-thumbnail-list"]'), //缩略图列表容器
                        $content: $view.find('[data-id="img-thumbnail-content"]'), //缩略图内容容器
                        $prev_group: $view.find('[data-id="prev_group"]'),  //上一组缩略图
                        $next_group: $view.find('[data-id="next_group"]'),  //下一组缩略图
                        $prev: $view.find('[data-id="prev"]'),  //上一张图片按钮
                        $next: $view.find('[data-id="next"]'),  //下一张图片按钮
                        $loading: $view.find('[data-id="loading"]'), //加载图标

                        $back: $view.find('[data-id="back"]').hide(),//返回关闭
                        $download: $view.find('[data-id="download"]'),
                        $share: $view.find('[data-id="share"]'),
                        $remove: $view.find('[data-id="remove"]'),
                        $code: $view.find('[data-id="code"]'),
	                    $zoomin: $view.find('[data-id="zoomin"]'),
	                    $zoomout: $view.find('[data-id="zoomout"]'),
	                    $match: $view.find('[data-id="match"]')
                    };
                $view.on('click', '[data-id]', function (e) {
                    var $self = $(this) , id = $self.attr('data-id') , touch = true;
                    //退出、分享、删除、下载、二维码
                    if (me._render._ev_simple[id]) {
                        me.happen(id, e);
                    }
                    //前后图、前后组
                    else if (me._render._ev_limit[id]) {
                        if (!$self.hasClass('disable')) {
                            me.happen(id);
                        }
                    }
                    //收起、展开
                    else if (id === 'expansion') {
                        if ($self.hasClass('expansion_down')) {
                            m.$list.hide();
                            $self.removeClass('expansion_down').addClass('expansion_up');
                            me.happen('expansion_down');
                        } else {
                            m.$list.show();
                            $self.removeClass('expansion_up').addClass('expansion_down');
                            me.happen('expansion_up');
                        }
                    }
                    //选中某个图片
                    else if (id === 'pick') {
                        me.happen(id, ($self.attr('data-index') - 0));
                    } else {
                        touch = false;
                    }
                    //阻止默认行为、冒泡
                    if (touch) {
                        e.stopPropagation();
                        return false;
                    }
                });
            },
            _ev_simple: {'back': 1, 'destroy': 1, 'share': 1, 'remove': 1, 'download': 1, 'code': 1},
            _ev_limit: {'prev_group': 1, 'next_group': 1, 'prev': 1, 'next': 1, 'zoomin': 1, 'zoomout': 1, 'match': 1}
        },
        //大图加载流程状态
        image_state: {
            //开始加载
            start: function (index) {
                var m = this.children;
                m.$loading.show();//显示loading图标
                m.$big_img.hide().empty();
	            m.$big_img.Draggable({
		            zIndex: 10000,
		            onStart: function() {
			            m.$bd.addClass('hide');
			            m.$ft.css('opacity', 0);
		            },
		            onStop: function() {
			            m.$bd.removeClass('hide');
			            m.$ft.css('opacity', 1);
		            }
	            });
            },
            //图片位置定位(支持重新调整位置)
            location: function (_$img, img_w, img_h ,noanimate, unlimit, reset) {
                var me = this, $img = _$img, h = img_h , w = img_w , win_h = $win.height() ,win_w = $win.width(), diff_h = 110 , diff_w = 120;
                if (!$img) {
                    $img = $(me.children.$big_img.find('img')[0]);
                    if (!$img.get(0)) {
                        return;
                    }
                    h = $img.attr('src_h') - 0;
                    w = $img.attr('src_w') - 0;
                }
                var rate = h / w , css = { height: h, width: w, marginBottom: isIe6 ? 45 : 30}, attr = {src_h: h, src_w: w};
	            if(!unlimit) {
		            if(h > win_h - 116) {
			            css.height = win_h - 116;
			            css.width = css.height / rate;
		            }
		            if(css.width > win_w - diff_w) {
			            css.width = win_w - diff_w;
			            css.height = css.width * rate;
		            }
	            }
                if(noanimate){
                    $img.attr(attr).css(css);
	                reset && me.children.$big_img.css({ left: 0, top: 0 });
                } else {
                    $img.attr(attr).animate(css, 'fast');
	                reset && me.children.$big_img.animate({ left: 0, top: 0 }, 'fast');
                }
                me._render.ie6.call(me);
            },
	        zoomin: function() {
		        var m = this.children,
			        $img, h, w, s;

		        $img = $(m.$big_img.find('img')[0]);
		        if (!$img.get(0)) {
			        return;
		        }
		        s = ($img.attr('src_s') - 0) || 1;
		        h = ($img.attr('src_h') - 0) / s;
		        w = ($img.attr('src_w') - 0) / s;
		        if(++s >= 4) {
			        s = 4;
			        m.$zoomin.addClass('disable');
		        }
		        m.$zoomout.removeClass('disable');
		        m.$match.removeClass('disable');
		        $img.attr('src_s', s);
		        this.image_state.location.call(this, $img, w * s, h * s, false, true, false);
	        },
	        zoomout: function() {
		        var m = this.children,
			        $img, h, w, s;

		        $img = $(m.$big_img.find('img')[0]);
		        if (!$img.get(0)) {
			        return;
		        }
		        s = ($img.attr('src_s') - 0) || 1;
		        h = ($img.attr('src_h') - 0) / s;
		        w = ($img.attr('src_w') - 0) / s;
		        if(--s <= 1) {
			        s = 1;
			        m.$zoomout.addClass('disable');
			        m.$match.addClass('disable');
		        }
		        m.$zoomin.removeClass('disable');
		        $img.attr('src_s', s);
		        this.image_state.location.call(this, $img, w * s, h * s, false, true, false);
	        },
	        match: function() {
		        var m = this.children,
			        $img, h, w, s;

		        $img = $(m.$big_img.find('img')[0]);
		        if (!$img.get(0)) {
			        return;
		        }
		        s = ($img.attr('src_s') - 0) || 1;
		        h = ($img.attr('src_h') - 0) / s;
		        w = ($img.attr('src_w') - 0) / s;
		        m.$zoomin.removeClass('disable');
		        m.$zoomout.addClass('disable');
		        m.$match.addClass('disable');
		        s = 1;
		        $img.attr('src_s', s);
		        this.image_state.location.call(this, $img, w * s, h * s, false, false, true);
	        },
            //加载成功
            done: function (index, img, width, height) {//大图加载完成
                var me = this , child = me.children;
                child.$loading.hide();
                me.image_state.location.call(me, $(img).appendTo(child.$big_img.empty().show()), width, height ,true);
            },
            //加载失败
            error: function () {//大图加载失败
                var m = this.children;
                m.$loading.hide();
                m.$big_img.html(tmpl.error()).show();
            },
	        //关闭
	        close: function(callback) {
		        var m = this.children,
		            me = this;
		        me.$view.css('opacity', 0);
		        m.$zoomin.removeClass('disable');
		        m.$zoomout.addClass('disable');
		        setTimeout(function() {
			        me.$view.css('opacity', 1);
			        callback();
		        }, 500);
	        }
        },
        //缩略图加载流程状态
        thumb_state: {
            done: function (img, index) {
                this.children.$content.find('li[data-index="' + index + '"]').find('i').replaceWith(img);
            }
        },
        spec: function (args) {
            var m = this.children;
            //console.debug(args)
            m.$back.toggle(args.back);
            m.$remove.toggle(args.remove);
            m.$share.toggle(args.share);
            m.$code.toggle(args.code);
            m.$download.toggle(args.download);
	        m.$zoomin.toggle(args.zoomin);
	        m.$zoomout.toggle(args.zoomout);
	        m.$match.toggle(args.match);
        },
        //缩略图html结构
        _thumb: {
            _html: function (start, end) {
                var ary = [];
                for (var i = start; i < (end + 1); i++) {
                    ary.push(tmpl.thumb_instance(i));
                }
                return ary.join('');
            },
            _update: function (start) {
                var sibling = this.children.$content.find('li[data-index="' + start + '"]')[0];
                //遍历从指定位置遍历后面的元素，将data-index累积减一
                start -= 1;
                while (sibling) {
                    if (sibling.tagName && sibling.tagName.toLowerCase() === 'li') {
                        $(sibling).attr('data-index', start + '');
                        start += 1;
                    }
                    sibling = sibling.nextSibling;
                }
            },
            //新加一段区域的缩略图
            add: function (min, max) {
                var me = this , $content = me.children.$content;
                //first time
                if (!me.hasOwnProperty('from')) {
                    me.from = min;
                    me.to = max;
                    $content.append($(me._thumb._html(min, max)));
                    $content.css({marginLeft: 0});
                }
                //
                else {
                    if (max > me.to) {//后面插入
                        $(me._thumb._html(me.to + 1, max)).insertAfter($content.find('li[data-index="' + me.to + '"]'));
                    }
                    if (min < me.from) {//前面插入
                        $(me._thumb._html(min, me.from - 1)).insertBefore($content.find('li[data-index="' + me.from + '"]'));
                    }
                    //更新显示段落
                    me.from = Math.min(min, me.from);
                    me.to = Math.max(max, me.to);
                    //更新偏移量
                    $content.animate({marginLeft: -( min - me.from ) * 58}, 'fast');
                }
            },
            del: function (index) {
                this.children.$content.find('li[data-index="' + index + '"]').remove();
                this._thumb._update.call(this, index + 1);
                this.to -= 1;
            },
            destroy: function () {
                delete this.from;
                this.children.$content.empty();
            }
        },
        //store的响应事件
        store_watch: {
            //初始化
            init: function () {
                var me = this;
                me._render.activate.call(me);//a:事件、UI激活
                me.$view.show();//b:显示视图
                me.show_mask();//c:show mask
                me.children.$list.show();//d:恢复缩略图区域样式
                me.children.$expansion.removeClass('expansion_up').addClass('expansion_down');
            },
            //销毁
            destroy: function () {
                var me = this;
                me._render.deactivate.call(me);//a:事件、UI去激活
                me.$view.hide();//b:隐藏视图
                me.hide_mask();//c:hide mask
                me._thumb.destroy.call(me);//d:清空缩略图区域
            },
            //选中某数据项 ,更新按钮的可操作性
            selected: function (limit) {
                var m = this.children;
                m.$prev_group[limit.has_prev_group ? 'removeClass' : 'addClass']('disable');//上一组缩略图
                m.$next_group[limit.has_next_group ? 'removeClass' : 'addClass']('disable');//下一组缩略图
                m.$prev[limit.has_prev ? 'removeClass' : 'addClass']('disable')
                    .attr('title',limit.has_prev ? '上一张' : '已是第一张');  //上一张图片按钮
                m.$next[limit.has_next ? 'removeClass' : 'addClass']('disable')
                    .attr('title',limit.has_next ? '下一张' : '已是最后一张');  //下一张图片按钮
                if (limit.complete) {
                    m.$total_info.text('第' + (limit.index + 1) + '/' + (limit.max + 1) + '张');//更新浏览信息
                } else {
                    m.$total_info.text('第' + (limit.index + 1) + '张');//更新浏览信息
                }
                m.$content.find('.cur').removeClass('cur');
                m.$content.find('li[data-index="' + limit.index + '"]').addClass('cur');//添加选中图标
            },
            //切换显示区域
            load_html: function (area) {
                this._thumb.add.call(this, area.min, area.max);
            },
            //删除
            remove: function (index) {
                this._thumb.del.call(this, index);
            }
        }
    });
    return view;
});
//tmpl file list:
//image_preview/src/image_preview.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'image_preview_box': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<div class="mod-pic-preview j-preview-wrap" data-no-selection style="z-index: 999;">\r\n\
		<div class="inner"><!-- 隐藏底部面板及上下张按钮时加.hide -->\r\n\
			<div class="pic-preview-bd j-preview-bd">\r\n\
				<div class="pic">\r\n\
					<div data-id="big_img" draggable="true" style="display: inline-block;"></div>\r\n\
				</div>\r\n\
				<a class="expansion expansion_down" data-id="expansion" href="javascript: void(0);" style="display: none;">\r\n\
					<i></i><span data-id="total-info" class="viewer-info-text"></span>\r\n\
				</a>\r\n\
				<a class="btn btn-close" data-id="destroy" hidefocus="true">\r\n\
					<i class="icon icon-close"></i>\r\n\
				</a>\r\n\
				<a data-id="prev" class="pre disable" title="上一张" href="javascript: void(0);"><i class="icon icon-pre"></i></a>\r\n\
				<a data-id="next" class="next" title="下一张" href="javascript: void(0);"><i class="icon icon-next"></i></a>\r\n\
			</div>\r\n\
			<div class="pic-preview-ft j-preview-ft">\r\n\
				<a class="expansion expansion_up" href="javascript: void(0);" data-id="expansion" style="display: none;"></a>\r\n\
				<ul class="operate-list clearfix">\r\n\
					<li class="item" data-id="share">\r\n\
						<i class="icon icon-share"></i>\r\n\
						<p class="tip">分享</p>\r\n\
					</li>\r\n\
					<li class="item" data-id="download">\r\n\
						<i class="icon icon-download"></i>\r\n\
						<p class="tip">下载</p>\r\n\
					</li>\r\n\
					<li class="item" data-id="remove">\r\n\
						<i class="icon icon-trash"></i>\r\n\
						<p class="tip">删除</p>\r\n\
					</li>\r\n\
					<li class="item" data-id="code" style="display: none;">\r\n\
						<i class="icon icon-code"></i>\r\n\
						<p class="tip">二维码</p>\r\n\
					</li>\r\n\
					<li class="item line">\r\n\
						<i class="icon icon-line"></i>\r\n\
					</li>\r\n\
					<li class="item" data-id="zoomin">\r\n\
						<i class="icon icon-enlarge"></i>\r\n\
						<p class="tip">放大</p>\r\n\
					</li>\r\n\
					<li class="item disable" data-id="zoomout">\r\n\
						<i class="icon icon-narrow"></i>\r\n\
						<p class="tip">缩小</p>\r\n\
					</li>\r\n\
					<li class="item disable" data-id="match">\r\n\
						<i class="icon icon-resize"></i>\r\n\
						<p class="tip">重置</p>\r\n\
					</li>\r\n\
				</ul>\r\n\
				<div class="small-pic-list-wrap" data-id="img-thumbnail-list">\r\n\
					<div class="wrap">\r\n\
						<ul class="small-pic-list clearfix" data-id="img-thumbnail-content"></ul>\r\n\
					</div>\r\n\
					<div class="pre disable" data-id="prev_group">\r\n\
						<i class="icon icon-pre-s"></i>\r\n\
					</div>\r\n\
					<div class="next" data-id="next_group">\r\n\
						<i class="icon icon-next-s"></i>\r\n\
					</div>\r\n\
				</div>\r\n\
				<div class="ft-mask"></div>\r\n\
			</div>\r\n\
		</div>\r\n\
		<div data-id="loading" class="viewer-loading" style="display: none;"></div>\r\n\
	</div>');

return __p.join("");
},

'thumb_instance': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<li class="small-pic-item" data-index="');
_p(data);
__p.push('" data-id="pick">\r\n\
		<i></i>\r\n\
		<div class="pic"></div>\r\n\
		<div class="pic-mask"></div>\r\n\
	</li>');

return __p.join("");
},

'error': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('    <i class="loading-img-error"></i>');

return __p.join("");
}
};
return tmpl;
});
