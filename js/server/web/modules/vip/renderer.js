/**
 * 渲染模块
 * @type {exports}
 */
var path = require('path');
var querystring = require('querystring');
var tmpl = require('./tmpl');

module.exports = {

    /**
     * cssString: require('weiyun/util/inline').css(['CSS_STRING'], true)
     * diffClass: 根DOM节点上用来异化的class名称
     * header：header tmpl id
     * body：body tmpl id
     * need_vip_bar：导航栏是否需要登陆信息，"首页"不需要
     */
    PAGE_OPT_MAP: {
        'weiyun_vip' : {
            'cssString': 'page-vip-v2-index',
            'diffClass': 'vip-index',
            'header': 'header',
            'body': 'weiyun_vip_body',
            'need_vip_bar' : false
        },
        'growth': {
            'cssString': 'page-vip-v2-growth',
            'diffClass': 'vip-growth',
            'header': 'header',
            'body': 'growth_body',
            'need_vip_bar' : true
        },
        'privilege': {
            'cssString': 'page-vip-v2-intro',
            'diffClass': 'vip-intro',
            'header': 'header',
            'body': 'privilege_body',
            'need_vip_bar' : true
        },
        'capacity_purchase' : {
            'cssString': 'page-vip-v2-capacity-purchase',
            'diffClass': 'act-buy-space',
            'header': 'header',
            'body': 'capacity_purchase_body',
            'need_vip_bar' : true
        },
        'announcement': {
            'cssString': 'page-vip-v2-announcement',
            'diffClass': 'space-publish',
            'header': 'header',
            'body': 'announcement_body',
            'need_vip_bar' : true
        }
    },

    error: function(data) {
        return tmpl.error({
            msg: data
        });
    },

    render: function (request, data) {
        var pathname = path.normalize(request.REQUEST.pathname).replace(/\\/g,'/');
        var filename = (pathname || '').split('/').pop();
        var page = filename.split('.')[0],
            pageOpt, result;
        pageOpt = this.PAGE_OPT_MAP[page] || this.PAGE_OPT_MAP['weiyun_vip'];
        result = this._render_main(pageOpt, data);

        return result;
    },

    /**
     * 渲染相应Web页面
     * 根据页面options
     * @param options
     * @param data
     * @return {*}
     * @private
     */
    _render_main: function (options, data) {
        return tmpl.main({
            data: data,
            aid: data.aid,
            cssString: require('weiyun/util/inline').css([options.cssString], true),
            diffClass: options.diffClass,
            header: tmpl[options.header](Object.assign(data, {
                need_vip_bar: options.need_vip_bar
            })),
            body: tmpl[options.body](data)
        })
    }
};