/**
 * office支付逻辑，目前用于联调
 */
(function(win){

    var weiyun;
    //alert(0);
    weiyun_bridge.set_scheme('weiyunapi://pay.weiyun.com');
    function showPay(fid, fname) {
        alert(1);
        $.ajax({
            url: 'http://www.weiyun.com/data/test_jsonp.php?name=bin',
            dataType: 'jsonp',
            success: function(data) {
                console.log(data);
                weiyun_bridge.send('pay', {
                    service_id: 'service_100',
                    total_fee: 1,
                    desc: '微云10T扩容',
                    docview_token: fid
                }, function(data) {

                    document.body.innerHTML=JSON.stringify(data);
                });
            }
        });
    }

    weiyun = {
        showPay: showPay
    };

    window.weiyun = weiyun;
    //$('body').append('<script src="http://weinre.qq.com/target/target-script-min.js#weiyun_owa"></script>');
})(window);
