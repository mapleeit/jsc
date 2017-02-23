/**
 * 302跳转
 */
module.exports = function(request,response, url){
        response.setHeader('location', url);
        response.writeHead(302, {'Content-Type': 'text/html; charset=UTF-8'});
        response.end();
};