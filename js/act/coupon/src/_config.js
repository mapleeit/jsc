/**
 * 打包配置默认选项
 */
define(function(require, exports, module){

    return {

        dir: './',					//重新指定合并后文件的存放目录
        uglify: false,

        all: {
            name: 'index.js',		//重新指定合并后的文件名
            create: true
        }

    };

});