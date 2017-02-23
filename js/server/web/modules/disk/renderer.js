/**
 * 渲染UI模块
 */
var tmpl = require('./tmpl');

module.exports = {

    baseHeader_old: function() {
        return tmpl.header_old();
    },

	baseHeader: function() {
		return tmpl.header();
	},

	baseBottom_old: function(data) {
        return tmpl.bottom_old(data);
    },

	baseBottom: function(data) {
		return tmpl.bottom(data);
	},

    banner: function() {

    },

    face: function() {

    },

    main_old: function(data) {
        return tmpl.main_old(data);
    },

	main: function(data) {
		return tmpl.main(data);
	},

    fileList: function() {

    },

    render: function(userInfo, dirFileList, diskConfig) {
        if(userInfo.uin >= 281474976710656) {
            userInfo.is_weixin_user = true;
        }
	    if(userInfo.is_old) {
		    return this.baseHeader_old() + this.main_old(userInfo) + this.baseBottom_old({
			    userInfo: userInfo,
			    dirFileList: dirFileList,
			    diskConfig: diskConfig
		    });
	    } else {
		    return this.baseHeader() + this.main(userInfo) + this.baseBottom({
			    userInfo: userInfo,
			    dirFileList: dirFileList,
			    diskConfig: diskConfig
		    });
	    }
    },

    renderLogin: function(data) {
        return tmpl.login(data);
    },

    asyncRender: function(data) {
        if(data && data.is_old) {
            return tmpl.async_old(data);
        } else {
            return tmpl.async(data);
        }
    }
}
