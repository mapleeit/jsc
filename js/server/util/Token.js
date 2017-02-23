/**
 * 计算 g_tk
 * @param skey
 * @returns {number}
 */
module.exports = function(skey) {
    var hash = 5381;
    skey = skey || '';
    for (var i = 0, len = skey.length; i < len; ++i) {
        hash += (hash << 5) + skey.charCodeAt(i);
    }
    return hash & 0x7fffffff;
}