/**
 * 图片预览类
 * @author:hibincheng
 * @date:20150-01-30
 */
define(function(require, exports, module) {
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        events = lib.get('./events'),
        Module = lib.get('./Module'),
        image_loader = lib.get('./image_loader'),
        router = lib.get('./router'),
        prettysize = lib.get('./prettysize'),
        widgets = common.get('./ui.widgets'),

        store = require('./store'),
        tmpl = require('./tmpl'),

        undefined;

    /**
     *
     * @param {Object} cfg
     * @constructor
     */
    var Previewer = function(file_id) {
        this.urls = store.get_thumb_urls(1024);
        this.total = this.urls.length;
        this.index = store.get_image_index(file_id);
        this.render();
    };

    Previewer.prototype = {

        render: function() {
            this.$previewer = $(tmpl.previewer({
                page_text: this.index+1 + '/' + this.total
            })).appendTo(document.body);

            this.$img_list = this.$previewer.find('[data-id=img_list]');

            var me = this,
                vm = $(window).width() + 15; //15px是每张图的margin-right

            this.$img_list.width(vm*this.total).css({
                '-webkit-transform':'translate(-'+this.index*vm+'px,-50%)'
            }).on('click', 'img', function(e) {
               // e.preventDefault();
                //me.trigger('exit');
            });

            this.$previewer.on('touchmove', function(e) {
                e.preventDefault();
            });

            this.$previewer.find('[data-id=bbar]').on('touchstart', '[data-action]', function(e) {
                e.preventDefault();
                var action_name = $(e.target).closest('[data-action]').attr('data-action');
                if(action_name === 'view_raw') {
                    me.on_view_raw();
                } else {
                    me.trigger('action', action_name, [store.get_image_by_index(me.index).get_id()], e);
                }
            });

            //先占位，当划到某图才加载
            $(tmpl.previewer_item({
                total: this.total,
                item: this.urls
            })).appendTo(this.$img_list);

            this.load_more(this.index);
            require.async('Swipe', function() {
                me.init_swipe();
            })
            //var file_size = store.get_node_by_index(this.index).get_file_size();
            //this.get_$file_size().text('(' + prettysize(file_size) + ')');
        },

        init_swipe: function() {
            function transformBox(obj,value,time){
                var time=time?time:0;
                obj.css({
                    'transform':"translate("+value+"px, -50%)",
                    'transition':time+'ms linear',
                    '-webkit-transform':"translate("+value+"px, -50%)",
                    '-webkit-transition':time+'ms linear'
                });
            }
            var me = this;
            var $cur_img;
            this.$img_list.parent().Swipe({
                iniAngle:15,
                speed: 300,
                iniL:50,
                mode: 'left-right',
                sCallback:function(tPoint){
                    tPoint.setAttr('total', me.total);
                    tPoint.setAttr('count', me.index);
                    $cur_img = $('#previewer_item_' + me.index);
                },
                mCallback:function(tPoint){
                    var innerW=me.$img_list.width();
                    var offset=tPoint.mX+(-tPoint.count*innerW/tPoint.total);
                    if(!tPoint.mutiTouch && Math.abs(tPoint.angle)<tPoint.iniAngle){
                        transformBox(me.$img_list,offset,0);
                    }
                },
                eCallback:function(tPoint){
                    var innerW=me.$img_list.width(),
                        count=tPoint.count;
                    if(tPoint.mutiTouch) {
                        return;
                    }
                    function slide(d){
                        switch(d){
                            case "left":
                                ++count;
                                count = Math.min(count, tPoint.total-1); //不能超过边界
                                break;
                            case "right":
                                --count;
                                count = Math.max(count, 0); //不能超过边界
                        }
                        var offset = -count * innerW/tPoint.total;
                        transformBox(me.$img_list,offset,tPoint.speed);
                    }

                    slide(tPoint.direction);
                    tPoint.setAttr("count",count);
                    if(!tPoint.mX) {
                        router.go('root');
                    } else if(tPoint.direction) {
                        me.load_more(count);
                    }
                }
            });
        },

        load_more: function(index) {
            this.index = index;

            var $page_text = this.get_$page_text();
            $page_text.text(index + 1 + '/' + this.total).css('opacity', '0');
            clearTimeout(this.page_timer);
            $page_text.animate({
                opacity: 0.5
            }, 500, 'ease-out');
            this.page_timer = setTimeout(function(){
                $page_text.animate({
                    opacity: 0
                }, 500, 'ease-out');
            },2000);

            var file_size = store.get_image_by_index(this.index).get_file_size();
            this.get_$file_size().text('(' + prettysize(file_size) + ')');
            if($('#previewer_item_' + index).attr('src')) {
                return;
            }
            this.load_image(index).done(function(img) {
                $('#' + img.id).replaceWith(img);
            }).fail(function() {
                $('#previewer_item_' + index).replaceWith('<i id="previewer_item_'+index+'" class="icons  icon-img-damaged" style=""></i>');
            });
        },

        load_image: function(index, def) {
            var me = this,
                url = this.urls[index];

            def = def || $.Deferred();
            def.try_num = def.try_num || 3;
            image_loader.load(url).done(function(img) {
                img.className = 'wy-img-preview';
                img.id = 'previewer_item_'+ index;
                def.resolve(img);
            }).fail(function(img) {
                if(!--def.try_num) {
                    //img.className = 'wy-img-preview';
                   // img.id = 'previewer_item_'+ index;
                    def.reject(img);
                } else {
                    me.load_image(index, def);
                }
            });

            return def;
        },

        on_view_raw: function() {
            var index = this.index;
            var raw_url = store.get_image_by_index(index).get_thumb_url();
            var $cur_img = $(this.$img_list.children()[index]).find('img');
            if($cur_img.attr('data-size') == 'raw') {
                widgets.reminder.ok('已经是原图');
                return;
            }
            $cur_img.replaceWith('<i id="previewer_item_'+index+'" class="icons icons-reminder icon-reminder-loading"></i>');
            image_loader.load(raw_url).done(function(img) {
                img.className = 'wy-img-preview';
                img.id = 'previewer_item_'+ index;
                $(img).attr('data-size', 'raw');
                $('#' + img.id).replaceWith(img);
            }).fail(function() {
                $('#previewer_item_' + index).replaceWith('<i id="previewer_item_'+index+'" class="icons  icon-img-damaged" style=""></i>');
            });
        },

        get_$img_list: function() {
            return this.$img_list;
        },

        get_$page_text: function() {
            return this.$page_text = this.$page_text || (this.$page_text = this.$previewer.find('[data-id=page_text]'));
        },

        get_$file_size: function() {
            return this.$file_size = this.$file_size || (this.$file_size = this.$previewer.find('[data-id=file_size]'));
        },

        destroy: function() {
            this.$previewer.remove();
        }
    };

    $.extend(Previewer.prototype, events);

    return Previewer;
});