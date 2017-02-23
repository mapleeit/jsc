define(function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        browser = common.get('./util.browser'),
        Module = lib.get('./Module'),
        exif = require('./exif'),
        msg = require('./msg'),

        undefined;

    var ui = new Module('ui', {

        init: function(data) {
            if(this.hasLoaded) {
                return;
            }

            $('#robot_loading').hide();
            if(data && data.pic && !data.tag) {
                //显示黄图结果
                $('#robot_process').hide();
                //$('#robot_yellow .img').css({'background-image': 'url(' + decodeURIComponent(data.pic) + ')'});
                this.update(null, data.pic);

                var me = this,
                    $result = $('#robot_yellow'),
                    $tools = $('#yellow_tools');
                $result.show();

                if(!$result.hasClass('disable')) {
                    $tools.find('[data-id=retry]').addClass('try-guest');
                    $tools.find('[data-id=retry]').on('click', function() {
                        $('#input_file').click();
                    });
                    $tools.find('[data-id=share]').on('click', function() {
                        var $show_tips = $('#robot_share');
                        $show_tips.show();
                        $show_tips.on('touchend', function(e) {
                            $('#robot_share').hide();
                        });
                    });
                    $result.addClass('disable');
                }
            } else if(data && data.pic && data.tag) {
                //显示标签结果
                var tags_data = {
                    tags:[{
                        'tag_name': decodeURIComponent(data.tag),
                        'tag_confidence': 1
                    }]
                }

                this.update(null, data.pic);
                $('#robot_tools').find('[data-id=retry]').addClass('try-guest');
                this.show_tags(tags_data);
            } else {
                $('#robot_index').show();
            }

            $('#container').addClass('wy-anim-start');
            $('#robot_index .robot').addClass('anim-start');

            this.bind_events();
        },

        bind_events: function() {
            var $input = $('#upload_photo'),
                $input_file = $('#input_file'),
                me = this;

            $input.on('click', function() {
                $input_file.click();
            });
            $input_file.on('change', function(e) {
                var file = e.target.files[0];
                $('#robot_index').hide();
                $('#robot_result').hide();
                $('#robot_tips').hide();
                $('#robot_yellow').hide();
                $('#robot_process').show();

                me.trigger('action', 'change', file);
                $('#yellow_tools').find('[data-id=retry]').removeClass('try-guest');
                $('#robot_tools').find('[data-id=retry]').removeClass('try-guest');
            });

            this.orientation_change = false;
            $(window).on("orientationchange",function(){
                if(window.orientation !== 0 && !me.orientation_change) {
                    alert('请使用竖屏操作！');
                    me.orientation_change = true;
                }
            });

            this.hasLoaded = true;
        },

        //IOS7及以下的情况，待传完图片再显示
        is_ios_7: function() {
            var ios_7_reg = /OS [1-7]_\d[_\d]* like Mac OS X/i,
                ua = window.navigator.userAgent;
            if(browser.IOS && ios_7_reg.test(ua)){
                return true;
            }
            return false;
        },

        update: function(file, data) {
            var me = this;

            exif.fileExif(file, function(exif_obj) {
                var obj = {
                        deg: 0,
                        original_height: 0,
                        original_width: 0,
                        height: 0,
                        width: 0,
                        flag: 0,
                        data: data
                    };
                var is_2k = (exif_obj && exif_obj.PixelYDimension && exif_obj.PixelYDimension === 1080 && exif_obj.PixelXDimension && exif_obj.PixelXDimension === 1920) ? true: false;

                if(exif_obj && !is_2k) {
                    obj.original_height = exif_obj && exif_obj.PixelYDimension;
                    obj.original_width = exif_obj && exif_obj.PixelXDimension;

                    if(exif_obj && exif_obj.Orientation === 6) {
                        obj.deg = 90;
                    } else if(exif_obj && exif_obj.Orientation === 8) {
                        obj.deg = -90;
                    } else if(exif_obj && exif_obj.Orientation === 3) {
                        obj.deg = 180;
                    }

                    var is_reverse = (obj.deg === 90 || obj.deg === -90)? true: false;
                    obj.width = is_reverse? 190 : 288;
                    obj.height = is_reverse? 288 : 190;
                    obj.flag = (obj.original_height && obj.original_width)? (obj.original_height * 288) / (obj.original_width * 190) : 1;

                    if((obj.flag >= 1 && !is_reverse) || (obj.flag < 1 && is_reverse)) {
                        obj.width  = Math.round(obj.original_width * 190 / obj.original_height);
                    } else {
                        obj.height = Math.round(obj.original_height * 288 /obj.original_width);
                    }
                    if(me.is_ios_7()) {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function(e) {
                            obj.data = this.result;
                            me.update_img(obj);
                        }
                        return;
                    }
                    me.update_img(obj);

                } else {
                    //非拍摄图片无法读出exif信息，默认正面朝上，直接读出img的高宽即可。
                    var image = new Image();
                    image.onload = function() {
                        obj.original_height = image.height;
                        obj.original_width = image.width;
                        obj.flag = (obj.original_height && obj.original_width)? (obj.original_height * 288) / (obj.original_width * 190) : 1;

                        if(obj.flag >= 1) {
                            obj.width  = Math.round(obj.original_width * 190 / obj.original_height);
                        } else {
                            obj.height = Math.round(obj.original_height * 288 /obj.original_width);
                        }

                        me.update_img(obj);
                        image = null;
                    }
                    image.src = data;
                }
            });
        },

        update_img: function(obj) {
            var cssStyle = {
                'background-image': 'url(' + obj.data + ')',
                'transform': 'translate(-50%,-50%) rotate(' + obj.deg + 'deg)',
                '-webkit-transform': 'translate(-50%,-50%) rotate(' + obj.deg +  "deg)",
                'width': obj.flag>=1? obj.width +'px' : '100%',
                'height': obj.flag>=1? '100%' : obj.height + 'px'
            }

            $('#robot_process .img').css(cssStyle);
            $('#robot_result .img').css(cssStyle);
            $('#robot_yellow .img').css(cssStyle);
        },

        show_porn: function(data) {
            if(data.errorcode === 0 && data.tags && data.tags.length > 1) {
                var hot_porn = this.get_hot_porn(data.tags);
                this.porn_tag_confidence = hot_porn.tag_confidence;

                if(hot_porn.tag_confidence >= 20) {
                    $('#robot_process').hide();

                    var me = this,
                        $result = $('#robot_yellow'),
                        $tools = $('#yellow_tools');
                    $result.show();

                    if(!$result.hasClass('disable')) {
                        $tools.find('[data-id=retry]').on('click', function() {
                            $('#input_file').click();
                        });
                        $tools.find('[data-id=share]').on('click', function() {
                            var $show_tips = $('#robot_share');
                            $show_tips.show();
                            $show_tips.on('touchend', function(e) {
                                $('#robot_share').hide();
                            });
                        });
                        $result.addClass('disable');
                    }
                    var _data = {};
                    _data.desc = '好黄好暴力，人类真是邪恶！';
                    this.trigger('action', 'refresh', _data);
                } else {
                    this.trigger('action', 'get_tags');
                }
            } else {
                this.porn_tag_confidence = 0;
                this.trigger('action', 'get_tags');
            }
        },

        get_hot_porn: function(tags) {
            var tag;
            for(var i=0; i<tags.length; i++) {
                tag = tags[i];
                if(tag.tag_name === 'normal_hot_porn') {
                    return tag;
                }
            }
            return '';
        },

        show_tags: function(data) {

            $('#robot_process').hide();
            if(!data.tags || (data.tags && data.tags.length === 0)) {
                this.show_tips();
                return;
            } else if(data.tags.length > 1){
                this.sort_tags(data.tags);
            }
            this.tags = data.tags;

            var _data = data.tags[0];
            _data.desc = msg.get(data.tags[0].tag_name);

            this.trigger('action', 'refresh',  _data);

            var me = this,
                $tag = $('[data-id=tag_name]');

            if($tag.length === 1 && data.tags.length > 1) {
                $tag = $('[data-id=tag_name]').clone();
                $('[data-id=tag_name]').after($tag);
            } else if($tag.length === 2 && data.tags.length === 1) {
                $('[data-id=tag_name]').first().remove();
            }
            this.count = 0;
            this.show_next_tag(0);

            $('[data-id=tag_name]').on('click', function() {
                if(me.loading_tag) {
                    return;
                } else {
                    me.loading_tag = true;
                }
                me.count = (me.count>-1 && me.tags.length>1 && me.count<me.tags.length-1)? me.count+1 : 0;
                me.show_next_tag(me.count);
            });
        },

        show_next_tag: function(id) {
            var me = this,
                tag = this.tags[id],
                tag_desc = msg.get(tag.tag_name),
                $result = $('#robot_result'),
                $tools = $('#robot_tools');

            $result.show();
            $result.find('[data-id=tag_name]').text(tag.tag_name);
            $result.find('[data-id=tag_desc]').text(tag_desc);
            if(!$result.hasClass('disable')) {
                $tools.find('[data-id=retry]').on('click', function() {
                    $('#input_file').click();
                });
                $tools.find('[data-id=share]').on('click', function() {
                    var $show_tips = $('#robot_share');
                    $show_tips.show();
                    $show_tips.on('touchend', function(e) {
                        $('#robot_share').hide();
                    });
                });
                $result.addClass('disable');
            }
            this.loading_tag = false;
        },

        get_best_tag: function(tags) {
            if(!tags || !tags.length) {
                return '';
            }
            var tag,
                result = tags[0];
            for(var i=0; i < tags.length; i++) {
                tag = tags[i];
                if(tag.tag_confidence > result.tag_confidence)
                    result = tag;
            }
            return result;
        },

        sort_tags: function(tags) {
            var len=tags.length,
                tag;
            for(var i=0; i<len; i++) {
                for(var j=0; j<len-1; j++) {
                    if(tags[j].tag_confidence < tags[j+1].tag_confidence) {
                        tag = tags[j];
                        tags[j] = tags[j+1];
                        tags[j+1] = tag;
                    }
                }
            }
        },

        show_tips: function() {
            $('#robot_process').hide();

            var $result = $('#robot_tips');
            $result.show();
            if(!$result.hasClass('disable')) {
                $result.find('[data-id=retry]').on('click', function() {
                    $('#input_file').click();
                });
                $result.addClass('disable');
            }
        }
    });

    return ui;
});