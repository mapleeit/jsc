/**
 * 上传文件夹添加本地验证规则， __default为默认，更多验证规则由Validata.rule动态装饰
 * @author bondli
 * @date 13-3-1
 */
define(function(require, exports, module) {

	var common = require('common'),
		$ = require('$'),

		constants = common.get('./constants');

	var map = {
		empty_files: function(files){
			if ( files == false ){
				return ['暂不支持上传整个盘符，请重新选择。', 1];
			}
		},
		max_dir_size: function( dir_total_num, used_dir_mun ){
			var max_num = constants.CGI2_DISK_BATCH_LIMIT;
			if ( dir_total_num + used_dir_mun >= max_num ){
				return ['文件夹中的目录总数过多（已选：'+dir_total_num+',已使用：'+used_dir_mun+',总限制：'+max_num+'）。', 2];
			}
		},
		max_level_size: function( dir_level_num, max_level_num ){
			if ( dir_level_num  > max_level_num ){
				return ['所选文件夹下某个目录中文件总数超过'+ max_level_num +'个，请管理后上传。', 3];
			}
		},
		max_files_size: function( files_size, max_files_num ){
			if ( files_size > max_files_num ){
				return ['文件夹中文件总数超过'+ max_files_num +'个，请分批上传。', 4];
			}
		},
		user_space: function( file_size, space, space_all ){
			if ( space + file_size  > space_all ){
				return ['容量不足，请删除一些旧文件或升级空间', 5];
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