define(function(require, exports, module) {
    var $ = require('$');
    exports.BindFunctions = function() {
        $("#refresh").click(function(){
            window.external.CallWeiyunClient_RefreshNote();
        });
        $("#remove").click(function(){
            window.external.CallWeiyunClient_RemoveNote();
        });
        $("#create").click(function(){
            window.external.CallWeiyunClient_CreateNote();
        });
    };
});