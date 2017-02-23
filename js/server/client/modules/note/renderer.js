/**
 * 渲染UI模块
 */
var tmpl = require('./tmpl');

module.exports = {

    baseHeader: function() {
        return tmpl.header();
    },

    baseBottom: function() {
        return tmpl.bottom();
    },

    banner: function() {

    },

    face: function() {

    },

    main: function() {
        return tmpl.main();
    },

    fileList: function() {

    },

    render: function() {
        return this.baseHeader() + this.main() + this.baseBottom();
    },

    renderLogin: function(data) {
        return tmpl.login(data);
    },

    asyncRender: function(data) {
        return tmpl.async(data);
    }
}
