define(function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),
        upload_route = require('./upload_route'),
        Upload_class = require('./Upload_class'),
        select_folder = require('./select_folder.select_folder'),
        upload_static = require('./tool.upload_static'),
        upload_cache = require('./tool.upload_cache'),
        View = require('./view'),
        Validata = require('./upload_file_validata.upload_file_validata'),
        disk = require('disk').get('./disk'),
        file_list = require('disk').get('./file_list.file_list'),
        random = lib.get('./random'),
        functional = common.get('./util.functional'),
        global_function = common.get('./global.global_function'),
        query_user = common.get('./query_user'),
        constants = common.get('./constants'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        ret_msgs = common.get('./ret_msgs'),
        photo_group = require('./select_folder.photo_group'),
        Upload = require('./Upload_h5_flash_class');

    document.domain = 'weiyun.com';




    var add_upload = function (upload_plugin, files, attrs) {
        View.show();
        var len=files.length;
        for(var file in files){
            var upload_obj = Upload.getInstance(upload_route.upload_plugin, random.random(), files[file], attrs);
            upload_obj.change_state('wait');    //状态转为wait，放入队列等待.
            if ((len -= 1) === 0) {
                upload_obj.events.nex_task.call(upload_obj);
            }
        }
    };

    upload_event.on('add_upload', add_upload);

   // module.exports = Upload;


});