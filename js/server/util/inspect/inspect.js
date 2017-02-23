/**
 * 静态文件输出
 * eg:
 *   var inspector = inspect(request, response);
 *   inspector.setView(__dirname + '/views');
 *   inspector.get('/index.html', function(){
 *      inspector.sendfile('index.html');
 *   });
 *   ...
 *   inspector.end();
 * @type {exports}
 */
var fs	        = require('fs');
var path        = require('path');
var mime        = require('./mime.js');
var gzipHttp 	= plug('util/gzipHttp.js');
var logger      = plug('logger');
var defaultPage = require('weiyun/default-page.js');

/**
 * 返回全局cache对象
 */
function getCache(){

    if(!global[__filename]){
        global[__filename] = {};
    }

    return global[__filename];
}

var viewCache = getCache();

var Inspector = function(request, response) {
    this.request = request;
    this.response = response;
    this.pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
    this.filename = (this.pathname || '').split('/').pop();
    this.extname = path.extname(this.filename);
}

Inspector.prototype.setView = function(viewPath) {
    this.viewpath = path.normalize(viewPath);
    return this;
};

Inspector.prototype.get = function(pathname, callback) {
    if(this._matched) {
        return this;
    }
    if(pathname instanceof RegExp && pathname.test(this.pathname)
        || typeof pathname === 'string' && this.pathname === pathname) {
        this._matched = true;
        logger.debug('inspector get file: ${pathname}',{
            pathname: this.pathname
        });
        callback(this, this.request, this.response);
    }
    return this;
};

Inspector.prototype.sendfile = function(filename, max_age) {
    var ext = path.extname(filename);
    var realPath = path.resolve(this.viewpath, filename);
    var me = this;

    ext = ext && ext.slice(1);
    if(mime.types[ext]) {
        if(viewCache[realPath]) {
            var gzipResponse = gzipHttp.getGzipResponse({
                request: me.request,
                response: me.response,
                plug: plug,
                code: 200,
                //cache: 'max-age=600',
                contentType: mime.types[ext]
            });
            gzipResponse.write(viewCache[realPath]);
            gzipResponse.end();
            return;
        }
        if(fs.existsSync(realPath)) {
            fs.readFile(realPath, function (err, buffer) {
                if (err) {
                    response.writeHead(500, {'Content-Type': 'text/plain'});
                    response.end();
                } else {
                    viewCache[realPath] = buffer;
                    max_age = max_age || 600000;
                    var gzipResponse = gzipHttp.getGzipResponse({
                        request: me.request,
                        response: me.response,
                        plug: plug,
                        code: 200,
                        cache: 'max-age=' + max_age,
                        contentType: mime.types[ext]
                    });
                    gzipResponse.write(buffer);
                    gzipResponse.end();
                }
            });
        } else {
            logger.debug('inspector cannt find file: ${filename}',{
                filename: realPath
            });
            defaultPage(me.request, me.response);
        }

    }

    return this;
};

Inspector.prototype.end = function() {
    if(!this._matched) {
        defaultPage(this.request, this.response);
    }
};

module.exports = function(request, response) {
    return new Inspector(request, response);
}