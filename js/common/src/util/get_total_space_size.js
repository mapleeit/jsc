/**
 * 获取用户总容量的显示
 * @author bondli
 * @date 13-11-22
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        $ = require('$'),

        console = lib.get('./console'),

        // 字节单位
        BYTE_UNITS = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'D', 'N', '...'],

        math = Math,
        parse_int = parseInt,

        undefined;

    /**
     * 可读性强的文件大小
     * @param {Number} bytes
     * @param {Number} [decimal_digits] 保留小数位，默认2位
     */
    get_total_space_size = function (bytes, decimal_digits) {
        bytes = parse_int(bytes);
        decimal_digits = parseInt(decimal_digits);
        decimal_digits = decimal_digits >= 0 ? decimal_digits : 2;

        if (!bytes)
            return '0B';

        var unit = parse_int(math.floor(math.log(bytes) / math.log(1024)));

        if(unit>3){
            unit = 3; //只显示到G的级别
        }
        var size = bytes / math.pow(1024, unit);
        var decimal_mag = math.pow(10, decimal_digits); // 2位小数 -> 100，3位小数 -> 1000
        var decimal_size = math.round(size * decimal_mag) / decimal_mag;  // 12.345 -> 12.35


        return decimal_size + BYTE_UNITS[unit];
    };


    return get_total_space_size;
});