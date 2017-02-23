define("club/weiyun/js/plugin_install/tips_config",[],function(require, exports, module) {

    return {
        
        ie6: {
            auto: [{
                text: '1. 单击浏览器顶部出现的信息栏：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie6_auto_step1.png'
            },{
                text: '2. 在弹出的菜单中，单击“安装ActiveX 控件(C)”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie6_auto_step2.png'
            },{
                text: '3. 显示“Internet Explorer 安全警告”对话框时，单击“安装”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie6_auto_step3.png'
            }],
            manual: [{
                text: '1. 显示“文件下载 安全警告”对话框时，单击“安装”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie6_manual_step1.png'
            },{
                text: '2. 显示“Internet Explorer 安全警告”对话框时，单击“运行”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie6_manual_step2.png'
            }]
        },
        ie7: {
            auto: [{
                text: '1. 单击浏览器顶部出现的信息栏：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie7_auto_step1.png'
            },{
                text: '2. 在弹出的菜单中，单击“安装ActiveX 控件(C)”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie7_auto_step2.png'
            },{
                text: '3. 显示“Internet Explorer 安全警告”对话框时，单击“安装”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie7_auto_step3.png'
            }],
            manual: [{
                text: '1. 显示“安全警告”对话框时，单击“安装”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie7_manual_step1.png'
            },{
                text: '2. 显示“Internet Explorer 安全警告”对话框时，单击“运行”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie7_manual_step2.png'
            }]
        },
        ie8: {
            auto: [{
                text: '1. 单击浏览器顶部出现的信息栏：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie8_auto_step1.png'
            },{
                text: '2. 在弹出的菜单中，单击“为此计算机上的所有用户安装此加载项”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie8_auto_step2.png'
            },{
                text: '3. 显示“Internet Explorer 安全警告”对话框时，单击“安装”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie8_auto_step3.png'
            }],
            manual: [{
                text: '1. 显示“安全警告”对话框时，单击“运行”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie8_manual_step1.png'
            },{
                text: '2. 显示“Internet Explorer 安全警告”对话框时，单击“运行”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie8_manual_step2.png'
            }]
        },

        ie9: {
            auto: [{
                text: '1. 在浏览器底部出现的信息栏中，单击“安装”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie9_auto_step1.png'
            },{
                text: '2. 显示“Internet Explorer 安全警告”对话框时，单击“安装”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie9_auto_step2.png'
            }],
            manual: [{
                text: '1. 文件下载对话框出现时，单击“运行”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie9_manual_step1.png'
            },{
                text: '2. 文件下载完毕后，单击“运行”：',
                img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/ie9_manual_step2.png'
            }]
        },

        chrome: [{
            text: '1. 当浏览器底部出现下载对话框时，双击该文件：',
            img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/chrome_manual_step1.png'
        }, {
            text: '2. 显示“安全警告”对话框时，单击“运行”：',
            img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/chrome_manual_step2.png'
        }],

        firefox: [{
            text: '1. 显示“正在打开......”对话框时，单击“保存文件”：',
            img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/firefox_manual_step1.png'
        }, {
            text: '2. 当浏览器右下角显示“下载完成”对话框时，单击“全部文件下载完成”：',
            img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/firefox_manual_step2.png'
        }, {
            text: '3. 找到并双击刚下载的文件：',
            img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/firefox_manual_step3.png'
        }, {
            text: '4. 显示“打开文件 安全警告”对话框时，单击“运行”：',
            img: 'http://imgcache.qq.com/vipstyle/nr/box/img/plugin_install/firefox_manual_step4.png'
        }]

    };
});