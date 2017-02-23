/**
 * 渲染UI模块
 */
var tmpl = require('./tmpl');

module.exports = {

    baseHeader: function() {
        return tmpl.header();
    },

    baseBottom: function(data) {
        return tmpl.bottom(data);
    },

    banner: function() {

    },

    face: function() {

    },

    main: function(data) {
        return tmpl.main(data);
    },

    fileList: function() {

    },

    render: function(data) {
        return this.baseHeader() + this.main(data) + this.baseBottom(data);
    },

    renderLogin: function(data) {
        return tmpl.login(data);
    },

    asyncRender: function(data) {
        return tmpl.async(data);
    }
}
