/**
 * 相片分组的数据对象，暂定有以下属性：
 * id 后台唯一id
 * name 分组名
 * create_time 创建时间
 * modify_time 修改时间
 * size 分组下有多少张图片
 * 
 * @author cluezhang
 * @date 2013-11-4
 */
define(function(require, exports, module){
    // 它目前没有特殊方法，直接用原生的Record
    var lib = require('lib');
    return lib.get('./data.Record');
});