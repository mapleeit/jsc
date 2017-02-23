/**
 * 模调上报逻辑失败错误码，注意分模块
 * @author xixinhuang
 * @date 2016-11-09
 *
 */
define(function(require, exports, module) {

    var conf = {
        'download': {
            '1020': 1,   //下载文件不存在，例如被删除或移动
            '1052': 1,   //下载未完成上传的文件
            '1086': 1,   //批量操作条目超上限
            '1179': 1,   //流量超限
            '20002': 1,  //外链过期
            '20003': 1,  //外链使用次数已用完，请联系分享者重新分享
            '22073': 1,  //不支持打包下载,选择了过多目录
            '22077': 1,  //不支持打包下载,存在子目录
            '22078': 1,  //不支持打包下载,子文件过多
            '114200': 1, //分享资源已经删除
            '190049': 1, //违规文件
            '190011': 1, //登录态失效
            '190051': 1, //登录态失效
            '190061': 1, //登录态失效
            '190065': 1, //登录态失效
            '190072': 1  //地域限制，例如边疆地区的音视频上传下载
        }
    }

    return {
        /**
         * 获取某个模调上报ID对应的逻辑失败错误码
         * 支持多层配置，type用.隔开
         * @param type
         * @returns {*}
         */
        get: function(type) {
            //支持多层级配置
            var ns = type.split('.');
            if(ns.length > 1 && (typeof conf[ns[0]] === 'object') && conf[ns[0]][ns[1]]) {
                return conf[ns[0]][ns[1]];
            }
            return conf[type] || {};
        },

        /**
         * 判断某个错误码是否属于逻辑失败
         * @param type
         * @param code
         * @returns {boolean}
         */
        is_logic_error_code: function(type, code) {
            var code_map = this.get(type);
            if(code_map && code_map[code]) {
                return true;
            }
            return false;
        }
    }
});