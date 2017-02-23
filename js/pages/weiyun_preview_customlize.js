/**
 * 微云定制 owa预览页面
 * 使用<script src="http://imgcache.qq.com/club/weiyun/js/pages/weiyun_preview_customlize.js" type="text/javascript" defer></script>
 * 嵌入到OWA预览页面</body>标签前:
 * word、pdf: WebWordViewer/WordViewerFrame.aspx
 * ppt: WebPPTViewer/powerpointframe.aspx
 * excel: ExcelServicesWfe/_layouts/XLViewerInternal.aspx
 * @author hibincheng
 */
(function(){

    try {
        //var doc_type = document.getElementById('weiyun_customlize').getAttribute('data-type');

        //目前功能只有：去掉预览页面顶部的microsolft web app标题和“？”标识链接
        var style_el = document.createElement('style');
        var style_txt = '.cui-topBar1{visibility: hidden;}' +
            '.WACRibbonPanel .cui-topBar2{display:none;}#WACAppBase{top:0px !important;}' + //word pdf
            '.ewa-clientarea{top:0px !important}' +   //excel
            '#ReadingToolbarPanel .cui-topBar2{display:none !important;} #FishBowlPanel{top:0px !important}' //ppt
        style_el.innerHTML = style_txt;
        document.head.appendChild(style_el);
    } catch(e) {}

})();