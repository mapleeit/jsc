// 点击日志上报
(function(){
    var hook = function(special_log, $){
        var log_property = 'data-log-id',
            log = special_log.build_40_logger();
        $(document.body).on('click', '['+log_property+']', function(){
            var $dom = $(this),
               id = $dom.attr(log_property),
               // 在chrome下测试发现，location.href触发下载，setTimeout、setInterval的东西无效？
               log_immediately = true;//$dom.is('a[target!="_blank"]');
            log({
                actiontype_id : ''+id
            }, log_immediately);
        });
    };
    if(window.seajs){
        seajs.use(['special_log', '$'], hook);
    }else{
        hook(window.special_log, window.jQuery);
    }
})();