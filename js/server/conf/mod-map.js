

this['web'] = {
    'platform'              : 'weiyun/web/modules/platform/sync.js',

    'disk'                  : 'weiyun/web/modules/disk/sync.js',

    'office'                : 'weiyun/web/modules/office/sync.js',

    'notes'                 : 'weiyun/web/modules/notes/sync.js',

    'note_web'              : 'weiyun/web/modules/note_web/sync.js',

    'd'                     : 'weiyun/web/modules/d/sync.js',

    'mobile'			    : 'weiyun/web/modules/mobile/sync.js',

    'qtrans'                : 'weiyun/web/modules/qtrans/sync.js',

    'common'                : 'weiyun/web/modules/common/sync.js',

    'php'                   : 'weiyun/web/modules/common/sync.js',

    'web'                   : 'weiyun/web/modules/web/sync.js',

    'vip'                   : 'weiyun/web/modules/vip/sync.js',

    'video_preview'         : 'weiyun/web/modules/video_preview/sync.js',

    'feedback'              : 'weiyun/web/modules/feedback/sync.js',  //web & pc反馈页面

    'client'                : 'weiyun/client/sync.js'
};

this['h5'] = {
    'weixin'                : 'weiyun/h5/modules/weixin/sync.js',           //h5.weiyun.com/weixin
    'vip'                   : 'weiyun/h5/modules/vip/sync.js',              //h5.weiyun.com/vip H5会员支付页
    'activities'            : 'weiyun/h5/modules/activities/sync.js',       //手机端活动列表
    'recent'                : 'weiyun/h5/modules/recent/sync.js',           //h5最近文件列表页
    'note'                  : 'weiyun/h5/modules/note/sync.js',             //h5笔记编辑页面 h5.weiyun.com/note
    'act'                   : 'weiyun/h5/modules/act/sync.js',              //活动入口, 纯入口而已
    'share_trace'           : 'weiyun/h5/modules/share_trace/router.js',    //h5分享链接追踪页面

    'jump_share'            : 'weiyun/mobile/modules/jump_share/sync/sync.js',          //H5页面分享文件，QQ的jsapi里需要同域名，这里用来中转，302到share域名。目前只有公众号页面需要用到
    'wx_pc_pay'             : 'weiyun/mobile/modules/wx_pc_pay/sync/sync.js',           //h5页面，PC微信账号支付时二维码跳转页面
    'capacity_purchase'     : 'weiyun/mobile/modules/capacity_purchase/sync/sync.js',   //h5容量购买页面
    'sign_in'               : 'weiyun/mobile/modules/sign_in/sync/sync.js',             //h5签到
    'pop_pay'               : 'weiyun/mobile/modules/pop_pay/sync/sync.js'             //H5客户端弹窗开通会员
};

//活动模块
this['act'] = {
    'qqvip'                 : 'weiyun/h5/modules/act/qqvip/sync.js',
    'weixin'                : 'weiyun/h5/modules/act/weixin/sync.js',               // h5.weiyun.com/act/weixin
    'robot'                 : 'weiyun/h5/modules/act/robot/sync.js',                // 机器识图运营活动
    'coupon'                : 'weiyun/h5/modules/act/coupon/sync.js'               // 流量券活动
};

this['client'] = {
    'station'               : 'weiyun/client/modules/station/sync.js',       //'weiyun/client/modules/station/sync.js', PC中转站先转去旧版本的代码，之后再统一切
    'note'                  : 'weiyun/client/modules/note/sync.js'
};

this['jump'] = {
    'weiyun_jump'           : 'weiyun/modules/jump/weiyun/sync.js'
};
