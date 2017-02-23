/**
 * 上传文件夹添加本地验证规则， __default为默认，更多验证规则由Validata.rule动态装饰
 * @author bondli
 * @date 13-3-1
 */
define(function(require, exports, module) {

	var common = require('common'),
		$ = require('$');

	var map = {
		max_file_size: function( file_size, max_size ){
			if ( file_size > max_size ){
				return ['上传失败，文件大小超出限制。', 1];
			}
		},
		/*low_file_size: function( file_size, size ){
			if ( file_size < size ){
				return ['你选择的文件小于4G。', 2];
			}
		},
		arrive_max_space: function( space_all, max_space ){
			if ( space_all >= max_space ){
				return ['你的容量达到上限1T，不会再赠送容量了。', 4];
			}
		},*/
		user_space: function( file_size, space, space_all ){
			if ( space + file_size  > space_all ){
				return ['容量不足，请参与送容量活动', 3];
			}
		}

	};


	var Validata = function(){
		var __map = $.extend( {}, map ),
			stack = {},
			__self = this;

		var add_validata = function(){
			var key = Array.prototype.shift.call( arguments );
			stack[ key ] = Array.prototype.slice.call( arguments );
		};

		var add_rule = function( fn_name, fn ){
			__map[ fn_name ] = fn;
		};

		var run = function(){
			var flag = false;
			$.each( __map, function( key, fn ){
				var param = stack[ key ];
				if ( !param ){
					return;
				}
				var ret = fn.apply( __self, param );
				if ( ret ){
					flag = ret;
					return false;
				}
			});

			return flag;
		};

		return{
			add_validata: add_validata,
			add_rule: add_rule,
			run: run
		};
	};

	var create = function(){
		return Validata.call(this);
	};

	return {
		create: create
	};

});