/**
 * 帐号相关静态方法集合
 * @type {{qqAvatar: qqAvatar}}
 */

var base62 = require('weiyun/util/base62');
var user = {

    qqAvatar: function(uin, size, bid) {
        var bid = bid || 'groupphoto';//好像只有群相册用,就直接写这里了
        uin = parseInt(uin, 10);
        if(typeof(size) != "number"){
            size = 40;
        }else if(size > 100){
            size = 140;
        }else if(size > 40){
            size = 100;
        }else{
            size = 40;
        }

        return "//q.qlogo.cn/openurl/"+uin+"/"+uin+"/"+size+"?rf="+bid+"&c="+base62.encode(bid+'@'+uin);
    }
};

module.exports = user;