/**
 * 直出使用，样式文件路径引用
 */

var mobile_css_base = '/vipstyle/nr/box/web/css-ver/';
var web_css_base = '/vipstyle/nr/box/css-ver/';
var h5_css_base = '/vipstyle/nr/box/h5/css/';
var new_h5_css_base = '/qz-proj/wy-h5/';
var new_web_css_base = '/qz-proj/wy-web/';
var new_web_css_base_v2 = '/qz-proj/wy-pc/css/';

//mobile样式逐渐废弃，过度到使用h5样式
var mobile_refs = {
    //*****************************mobile*******************************************/
    '@weiyun_global_css@'           : 'weiyun-global.r150624.css',
    '@weiyun-component-base@'       : 'weiyun-component-base.r150210.css',
    '@weiyun-component-confirm@'    : 'weiyun-component-confirm.r150210.css',
    '@weiyun-component-tips@'       : 'weiyun-component-tips.r150210.css',
    '@weiyun-filetype-icons@'       : 'weiyun-filetype-icons.r150210.css',
    '@weiyun_share_css@'            : 'weiyun-share.r150727.css',
    '@weiyun_weixin_share_css@'     : 'weiyun-weixin-share.r150521.css'
};

//h5相关的页面，样式不再采用版本号，首屏样式采用内联，去掉max_age长缓存
var h5_refs = {
    '@g-share-mask@'                : 'g-share-mask.css',
    '@g-vip-icons@'                 : 'g-vip-icons.css',
    '@weiyun-weixin-share@'         : 'weiyun-weixin-share.css',
    '@weiyun-weixin-note@'          : 'weiyun-weixin-note.css',
    '@vip-power@'                   : 'vip-power.css',
    '@app-act-pts@'                 : 'app-act-pts-2016.css',
    '@mobile-select-area@'          : 'mobile-select-area.css',
    '@dialog@'                      : 'dialog.css',
    '@app-iap@'                     : 'app-iap.css'
};

var web_refs = {
    '@base_css@'                    : 'base.r150609.css',
    '@base_delay_css@'              : 'base-delay.r161202.css',
    '@to_singin_css@'               : 'to-signin-2.0.r140603.css',
    '@upbox_css@'                   : 'upbox.r160623.css',
    '@appbox_upbox_css@'            : 'appbox-upbox.r160715.css',
    '@weixin_css@'                  : 'weixin-web.css',
    '@upload_install_css@'          : 'plugin.r140603.css',
    '@p_web_css@'                   : 'p-web.r161017.css',
    '@p_web_delay_css@'             : 'p-web-delay.r150915.css',
    '@p_appbox_css@'                : 'p-appbox.r161017.css',
    '@p_appbox_delay_css@'          : 'p-appbox-delay.r150720.css',
    '@photo_guide_css@'             : 'photo-guide.css',
    '@offline_guide_css@'           : 'offline-guide.css',
    '@appbox_clipboard_css@'        : 'p-appbox-clipboard.r140708.css',
    '@app_download_css@'            : 'app-download.r150810.css',
    '@office_css@'                  : 'office.r140520.css',
    '@dimensional_code_css@'        : 'dimensional-code.r140603.css',
    '@note_css@'                    : 'note.r160114.css',
    '@web_clipboard_css@'           : 'p-web-clipboard.r140708.css',
    //***********************pc分享页使用*************************************/
    '@share_css@'                   : 'share.r151105.css'
};

//微云以后新的样式均由重构发布，启用新的css配置路径。旧样式逐步迁移。date: 2016/01/20
var new_h5_refs = {
	'@g-reset@'                     : 'g-reset.css',
	'@g-retina-border@'             : 'g-retina-border.css',
    '@g-password@'                  : 'g-password.css',
    '@g-component@'                 : 'g-component.css',
	'@app-act@'                     : 'app-act.css',
	'@wy-share@'                    : 'wy-share.css',
    '@g-retina-table@'              : 'g-retina-table.css',
    '@g-filelist@'                  : 'g-filelist.css',
    '@g-bottom-bar@'                : 'g-bottom-bar.css',
    '@g-filetype-icons@'            : 'g-filetype-icons.css',
    '@g-err@'                       : 'g-err.css',
    '@new-app-iap@'                 : 'app-iap.css',
    '@app-iap-privilege@'           : 'app-iap-privilege.css', // 会员特权css改为v2，这个样式不用了
    '@app-iap-privilege-v2@'        : 'app-iap-privilege-v2.css',
    '@app-iap-grow@'                : 'app-iap-grow.css',
    '@app-checkin-exchange@'        : 'app-checkin-exchange-v2.css',
    '@app-checkin-personal@'        : 'app-checkin-personal.css',
    '@app-checkin-history@'         : 'app-checkin-history.css',
    '@app-checkin-edit@'            : 'app-checkin-edit.css',
    '@app-checkin-address@'         : 'app-checkin-address.css',
    '@app-checkin-order@'           : 'app-checkin-order-v2.css',
    '@app-checkin-order-result@'    : 'app-checkin-order-result.css',
    '@app-checkin-detail@'          : 'app-checkin-detail.css',
    '@app-share-join@'              : 'app-share-join.css',
    '@app-share-join-v2@'           : 'app-share-join-v2.css',
    '@app-share-album@'             : 'app-share-album.css',
    '@app-qq-privilege@'            : 'app-qq-privilege.css',
    '@app-act-flow@'                : 'app-act-flow.css',
    '@app-share-link-list@'         : 'app-share-link-list.css',
    '@app-act-buy-space@'           : 'act-buy-space.css',
    '@app-wx-pay@'                  : 'app-wx-pay.css',
    '@app-pop-pay@'                 : 'app-pop-pay.css'
};

var new_web_refs = {
    '@wy_vip_css@'                  : 'vip.css',
    '@feedback@'                    : 'feedback.css',
    '@pop@'                         : 'pop.css',
	'@link_css@'                    : 'share.css',
    '@qq-privilege@'                : 'qq-privilege.css'
};

var new_web_refs_v2 = {
	'@page_home_css@'                   : 'page-home.css',
	'@page_home_delay_css@'             : 'page-home-delay.css',
    '@page-vip-v2@'                     : 'page-vip-v2.css',
    '@page-vip-v2-intro@'               : 'page-vip-v2-intro.css',
    '@page_video_css@'                  : 'page-video.css',
    '@page-vip-v2-index@'               : 'page-vip-v2-index.css',
    '@page-vip-v2-growth@'              : 'page-vip-v2-growth.css',
    '@page-vip-flow@'                   : 'page-vip-flow.css',
    '@page-vip-v2-capacity-purchase@'   : 'page-vip-buy-space.css',
    '@page-vip-v2-announcement@'        : 'page-vip-space-publish.css'
};

var refs = {};
for(var o in mobile_refs) {
    refs[o] = mobile_css_base + mobile_refs[o];
}

for(var o in h5_refs) {
    refs[o] = h5_css_base + h5_refs[o];
}

for(var o in web_refs) {
    refs[o] = web_css_base + web_refs[o];
}

for(var o in new_h5_refs) {
    refs[o] = new_h5_css_base + new_h5_refs[o];
}

for(var o in new_web_refs) {
    refs[o] = new_web_css_base + new_web_refs[o];
}

for(var o in new_web_refs_v2) {
	refs[o] = new_web_css_base_v2 + new_web_refs_v2[o];
}

module.exports = refs;