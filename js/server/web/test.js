var path = require('path');

var a = path.dirname('/');
var b = new Buffer('abcd 9876 0000 0000 0000 0000 0000 0009 0002 e400 0000 0000 00', 'ascii');
console.log(b.toString('utf8'));
console.log(__dirname);