
/**
 * 随机数
 * @author svenzeng
 * @date 13-3-1
 */


define(function (require, exports, module) {

	var random = function(){
		return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace( /[xy]/g, function( c ){
			var r = Math.random() * 16 | 0, v = c === 'x' ? r : ( r&0x3|0x8 );
			return v.toString( 16 )
		}).toUpperCase();
	}

	return{
		random: random
	}

})