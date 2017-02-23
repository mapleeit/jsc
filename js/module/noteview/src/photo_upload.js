define(function (require, exports, module) {
    var
        lib = require('lib'),
        common = require('common'),
        Module = common.get('./module'),
        request = common.get('./request'),
        mini_tip = common.get('./ui.mini_tip'),
        security = lib.get('./security'),
        undefined;

    var photo_upload = new Module('photo_upload',{
        _bind_events: function() {
            var _input = $('#note_view_pic_upload_file'),
                me = this;

            _input.on('change', function(e) {
                //todo 此处要过滤类型
                var file = e.target.files[0];
                me.get_pic_msg(file, this.value).done(function(data) {
                    me.pre_upload(data);
                });
            });
            _input.on('click', function() {
                //alert('click');
            });
        },

        upload: function() {

        },

        pre_upload: function(data) {
            var me = this;

            request.xhr_post({
                url: 'http://web2.cgi.weiyun.com/weiyun_note.fcg',
                cmd: 'NotePreUpload',
                use_proxy: false,
                cavil: true,
                pb_v2: true,
                body: data
            }).ok(function(msg, body) {
                mini_tip.error(msg);
            }).fail(function(msg) {
                mini_tip.error(msg);
            });
        },

        get_pic_msg: function(img, path) {
            var pics = {},
                data = {},
                defer = $.Deferred();

            data.files = [img];
            pics.pic_type = 1;
            pics.pic_size = img.size;
            pics.pic_width = 1;
            pics.pic_heigth = 1;

            var reader = new FileReader();
            reader.onload = function(event) {
                var content = event.target.result;
                pics.pic_md5 = security.md5(content);
                data.pics = [pics];
                defer.resolve(data);
            };
            reader.onerror = function(event) {
                console.log('笔记图片上传错误');
                defer.reject(data);
            };
            reader.readAsBinaryString(img);

            return defer;
        }
    });

    return photo_upload;
});