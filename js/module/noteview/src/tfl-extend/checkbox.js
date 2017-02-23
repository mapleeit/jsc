define(function(require, exports, module) {
    var $ = require('$');

    /**
     * 创建一个checkbox
     * @returns {string}
     */
    var CreateCheckboxHtml = function(classname) {
        if (classname == undefined)
            classname = "checkbox_uncheck";
        return '<img class="'+classname+'">';
    };

    var CheckBoxTransform_InputToImage = function(str) {
        // 检查<input type="checkbox">Checkbox的项目, 替换成img
        var checkbox = CreateCheckboxHtml("checkbox_check");
        var uncheckbox = CreateCheckboxHtml("checkbox_uncheck");

        str = str.replace(/<input\s+type=("|')checkbox\1[^<]*?checked[^<]*?>/g, checkbox);
        str = str.replace(/<input\s+type=("|')checkbox\1[^<]*?>/g, uncheckbox);
        return str;
    };
    var CheckBoxTransform_ImageToInput = function(str) {
        var checkbox = '<input type="checkbox" checked="true">';
        var uncheckbox = '<input type="checkbox">';
        var reCheckbox = /<img\s+class=('|")checkbox_check\1[^<]*?>/g;
        var reUncheckBox = /<img\s+class=('|")checkbox_uncheck\1[^<]*?>/g;

        str = str.replace(reCheckbox, checkbox);
        str = str.replace(reUncheckBox, uncheckbox);
        return str;
    };
    var CheckBoxTransform_ReAddOnClick = function(str) {
        var checkbox = CreateCheckboxHtml("checkbox_check");
        var uncheckbox = CreateCheckboxHtml("checkbox_uncheck");
        var reCheckbox = /<img\s+class=('|")checkbox_check\1[^<]*?>/g;
        var reUncheckBox = /<img\s+class=('|")checkbox_uncheck\1[^<]*?>/g;

        str = str.replace(reCheckbox, checkbox);
        str = str.replace(reUncheckBox, uncheckbox);
        return str;
    };

    var OnCheckboxClick = function() {
        var html = '<p>'+CreateCheckboxHtml("checkbox_uncheck")+'&nbsp;</p>';
        this.insertHtml(html);
        this.eventMgr.emit('onchange');
    };
    var OnEditorGetHtml = function(data) {
        data[0] = CheckBoxTransform_ImageToInput(data[0]);
    };
    var OnEditorSetHtml = function(data) {
        data[0] = CheckBoxTransform_InputToImage(data[0]);
    };
    var OnPasteHtml = function(array) {
        var html = array[0];
        array[0] = CheckBoxTransform_ReAddOnClick(html);
    };
    var InstallToEditor = function(editor) {
        editor.eventMgr.on('button_checkbox', OnCheckboxClick.bind(editor));
        editor.eventMgr.on('html', OnEditorGetHtml.bind(editor));
        editor.eventMgr.on('setHtml', OnEditorSetHtml.bind(editor));
        editor.eventMgr.on('onPasteHtml', OnPasteHtml.bind(editor));
        $(editor.doc).click(function(e){
            var target = e.target;
            if (target.tagName == 'IMG' && target.className.indexOf('checkbox_') == 0) {
                if (target.className == 'checkbox_check') {
                    target.className = 'checkbox_uncheck';
                } else {
                    target.className = 'checkbox_check';
                }
                editor.eventMgr.emit('onchange');
            }
        });
    };

    exports.InstallToEditor = InstallToEditor;
});