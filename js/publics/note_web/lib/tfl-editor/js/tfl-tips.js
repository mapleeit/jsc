
TFL.widget("tips", {
	init: function(){
		$("body").undelegate("[data-close = 'tips']", "click", TFL.tips._initClose)
				 .delegate("[data-close = 'tips']", "click", TFL.tips._initClose)
	},
	_initClose : function(){
		$(this).parent().fadeOut(200,function(){
			 $(this).trigger('tipsclose').remove()
		})
	},
	showFlash: function(msg,autohide,delay){
		$("#flashMessage").hide();
		var flash = $("#flash_message"),
			autoHide = arguments[1] == undefined ? true : arguments[1],
			duration = arguments[2] == undefined ? 8000 : arguments[2];
		clearTimeout(flash.data("time"));
		flash.html(msg).fadeIn(500);
		if(autoHide){
			var t = setTimeout(function(){flash.fadeOut(500);}, duration);
			flash.data("time",t);
		}
	},
	hideFlash: function(){
		$("#flashMessage,#flash_message").hide();
	},
	showPreload: function(msg){
		setTimeout(function(){
			var preload = $("<div id='preload'></div>"),
		 	 tipContent = msg || '正在加载,请稍候...';
			 preload.html(tipContent).appendTo($("body"));
			 preload.dialog({
					autoOpen: false,
					modal: true,
					resizable: false,
					draggable: false,
					closeOnEscape: false,
					width: 280,
					minHeight: 1,
					bgiframe: true
			 });
			 preload.prev().remove();
			 preload.dialog('open');
		},50) 
	},
	hidePreload:function(){
		$("#preload").dialog('close').remove();
	}
}, true);