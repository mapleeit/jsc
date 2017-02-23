/**
 * 
 * @author cluezhang
 * @date 2013-12-11
 */
define(function(require, exports, module){
    var $ = require('$');
    /*
     * 先监听onload事件，完成后：
     * 1 如果无法访问document，跨域，立即显示成功
     * 2 如果可以访问
     * 2.1 如果wy_previewer_loading为true或无内容，等待N秒超时成功，或等wy_previewer_loading变为false或者有内容
     * 2.2 否则立即显示成功
     * 
     * --- 2013/09/10补充 ---
     * --- 2013/10/10修改 ---
     * 在html文档比较大的情况下，可能会出现onload事件不触发的情况。
     * 经测试appbox是处于渲染状态，渲染完后才会触发onload事件。
     * 为了规避，设定超时后如果能访问document并有内容，判断为渲染状态，适当延长超时时间，直至onload触发。
     * ------------------------
     */
    function getState(iframe){
        var dom = $(iframe)[0], win;
        var accessible = true;
        var selfLoading = false;
        var empty = true;
        try{
            win = dom.contentWindow;
            selfLoading = win.wy_previewer_loading === true;
            empty = win.document.body.childNodes.length <= 0;
        }catch(e){
            accessible = false;
        }
        return {
            accessible : accessible,
            selfLoading : selfLoading,
            empty : empty
        };
    }
    return {
        hook : function(iframe, timeout){
            var def = $.Deferred();
            var domLoaded = false;
            
            var detectTimer, expireTimer, backhandTimer, contentDetected = false;
            // 判断是否加载成功
            var ifDone = function(){
                var state = getState(iframe);
                if(domLoaded && (!state.accessible || !state.selfLoading && !state.empty)){
                    finalize(true);
                }else if(!contentDetected && state.accessible && !state.selfLoading && !state.empty){ // 如果有内容了，通知，避免因渲染卡住而判断为加载超时
                    contentDetected = true;
                    def.notify('contentDetected');
                }
            };
            // iframe加载时触发
            var hookLoaded = function(){
                domLoaded = true;
                ifDone();
            };
            // 结束出口
            var finalize = function(success){
                clearInterval(detectTimer);
                clearTimeout(expireTimer);
                //clearTimeout(backhandTimer);
                $(iframe).off('load', hookLoaded);
                if(success){
                    def.resolve();
                }else{
                    def.reject();
                }
                // 只能调用一次
                finalize = $.noop;
            };
            
            $(iframe).on('load', hookLoaded);
            detectTimer = setInterval(ifDone, 100);
            // 已经有其它地方的超时处理了，这里关掉
            expireTimer = setTimeout(function(){ // 超时时，如果没有加载完成则表示为失败，如果加载完只是内容及loading判断不成功，判断为成功
                var state = getState(iframe);
                finalize(domLoaded || state.accessible);
            }, (timeout || 30) * 1000);
            return def;
        }
    };
});