/**
 * 上传:选择上传位置提示信息wording
 * @author bondli
 * @date 13-8-29
 */
define(function (require, exports, module) {

    var $ = require('$'),
        common = require('common'),
        click_tj = common.get('./configs.click_tj'),
        constants = common.get('./constants'),

        gsAgent = navigator.userAgent.toLowerCase(),
        gbIsWin = gsAgent.indexOf("windows") > -1 || gsAgent.indexOf("win32") > -1;


    var _wording = ($.browser.safari || !gbIsWin) ? 'Flash' : '极速上传',
    	_install_qq_url = 'http://im.qq.com/',
    	_use_plugin_tips = ($.browser.msie) ? '<br>– 文件夹上传' : '',

    select_folder_msg = {
    	'NO_SUPPORT_UPLOAD_TO_PHOTO'     : '不支持上传文件夹到相册',
    	'PLEASE_INSTALL_PLUGIN_TO_PHOTO' : '请安装'+_wording+'控件以支持上传到相册',
    	'DIR_LEVEL_REACH_MAX_LIMIT'      : '目录所在层级过深，请上传至其他目录',
    	'NO_SUPPORT_G4_FILE'             : '文件大小超出限制，暂时无法上传。',
    	'CHANGE_IE_TO_SUPPORT_G4_FILE'   : '文件大小超出限制，暂时无法上传。',
    	'FLASH_UPLOAD_FILE_THAN_M300'    : '您要上传的文件超过300M，请启用极速上传。',
    	'BROWSER_NO_SUPPORT_M300_FILE'   : '您的浏览器暂不支持上传300M以上的文件。',
    	'ONLY_SUPPORT_UPLOAD_PHOTO'      : '仅可上传图片文件',
    	'USE_PLUGIN_UPLOAD'              : '启用极速上传，立即享受：'+_use_plugin_tips+' <br>– 极速秒传 <br>– 断点续传'
    };

    //APPBOX中重置部分变量
    if( constants.IS_APPBOX ){
    	select_folder_msg['FLASH_UPLOAD_FILE_THAN_M300'] = '您要上传的文件超过300M，请安装最新版QQ。';
    	select_folder_msg['USE_PLUGIN_UPLOAD'] = '点击安装新版QQ启用极速上传，立即享受：<br>– 极速秒传 <br>– 断点续传';
    	select_folder_msg['NO_SUPPORT_G4_FILE'] = '文件大小超出限制，暂时无法上传。';
    	select_folder_msg['CHANGE_IE_TO_SUPPORT_G4_FILE'] = '文件大小超出限制，请安装最新版本QQ。';
    }
    
    module.exports = {
        get : function( name ){
            return select_folder_msg[ name ];
        }
    };


});