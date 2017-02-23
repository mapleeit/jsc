'use strict';

var base64 = require('./base64');
var base62 = {};

base62.decode = function(a){
    return base64.decode(a.replace(/ic/g,'/').replace(/ib/g,'+').replace(/ia/g,'i'));
};

base62.encode = function(a){
    return base64.encode(a).replace(/[=i\+\/]/g,function(m){
        switch(m){
            case '=':
                return '';
            case 'i':
                return 'ia';
            case '+':
                return 'ib';
            case '/':
                return 'ic';
            default:
                return '';
        }
    });
};

/**
 * server/util/base62
 *
 * base62算法,在原来base64的基础上,将下列字符做了替换
 *   i -->  ia
 *   + --> ib
 *   / --> ic
 *   = --> 剔除
 *
 * @module server/util/base62
 */
module.exports = base62;
