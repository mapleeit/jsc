/**
 * 上传控件组件
 * @author svenzeng
 * @date 13-3-1
 */

define(function (require, exports, module) {

        var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        Module = common.get('./module'),
        functional = common.get( './util.functional' ),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        main_mod = require('main'),
        main = main_mod.get('./main'),
        console = lib.get('./console').namespace('drag_upload_active'),
        constants = common.get('./constants');


        var parent;
        var active_event = {
            mouse_down: false
        };
        var plugin = functional.try_it(function(){
            var plugin = new ActiveXObject("TXGYMailActiveX.ScreenCapture");
            var plugin_name = plugin.GetDLLFileName();
            var $obj;

            if ( plugin_name.indexOf("_2.dll") > -1 ){
                $obj = $( '<object classid="CLSID:B0F77C07-8507-4AB9-B130-CC882FDDC046" width=100% height=100%>' );
            }else{
                $obj = $( '<object classid="CLSID:F4BA5508-8AB7-45C1-8D0A-A1237AD82399" width=100% height=100%>' );
            }

            parent = $('<div class="ui-dnd" style="top:100px;background:#FFF;height:230px;z-index:10004">&nbsp;<a class="ui-pos-right ui-dnd-close" href="javascript:void(0)">关闭</a></div>').appendTo( $('body')).hide();

            parent.find( 'a').on( 'click', function(){
                parent.hide();
            });
            var body = document.body;
            body.onmousedown = function(){
                active_event.mouse_down = true;
            };
            body.onmouseup = function(){
                active_event.mouse_down = false;
            };
            body.ondragover = function(){
                if( active_event.mouse_down === false  && main.get_cur_mod_alias()=='disk' ){
                    parent.show();
                }
            };
            return $obj.appendTo( parent )[0];
        });


        var module = new Module( 'drag_upload_active', {

            render: function(){

                if ( !plugin ){
                    return;
                }

                plugin.text = '将文件拖拽至此区域';

                plugin.OnFilesDroped = function( type ){

                    if ( type === 'ENTER' ){
                        return plugin.text = '释放鼠标';
                    }

                    if ( type === 'LEAVE' ){
                        return plugin.text = '将文件拖拽至此区域';
                    }

                    if ( type === 'OVER' ){
                        return;
                    }

                    parent.hide();

                    var _oFiles = type.split("\r\n");
                    var _oFileList = [];
                    for (var i = 0; i < _oFiles.length; i++){
                        var _oFilePart = _oFiles[i].split(" ");
                        if (_oFilePart.length >= 2){
                            var _sFid = _oFilePart.shift(),
                            _sFileName = _oFilePart.join(" ");
                             _oFileList.push(_sFileName);
                         }
                    }
                    if(_oFileList.length){
                        upload_event.trigger( 'start_upload_from_client', _oFileList );
                        return;
                    }




                };

            }

        });


        setTimeout(function(){
            module.render();

            
        }, 1000 );


});