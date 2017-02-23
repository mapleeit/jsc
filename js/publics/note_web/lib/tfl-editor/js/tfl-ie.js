
TFL.widget('tflIe',{
	setStriped:function(){
		$(".striped tr:nth-child(even)").addClass("ie-tr-striped");
		return this;
	},
	init:function(){
		TFL.tflIe.setStriped();
	}
});
