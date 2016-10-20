var fs = require('fs' );

console.log(fs.statSync(__dirname).mtime.getTime());