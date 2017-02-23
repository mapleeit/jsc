/**
 * 全局事件路由
 * @author svenzeng
 * @date 13-3-1
 */


 define(function ( require, exports, module ){

 	var $ = require('$'),
        events = require('./events');

        var event = {};

        $.extend( event, events );

        module.exports = event;
 })

