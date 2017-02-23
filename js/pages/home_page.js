var HomePage = (function () {

    var HomePage = {

        init: function () {
            this.init_glume();

            if (has_flash()) {
                this.init_video();
            }
        },

        init_video: function () {

            var
                $mask = $('#_mask'),
                $video_box = $('#_video_box'),
                $video_el = $('[data-name=video_el]', $video_box),

                $video_play = $('#_video_play'),
                $play = $('[data-name=play]', $video_play).toggle(has_flash()),

                flash_html = get_flash_html({
                    wmode: "window",
                    flashvars: ["vid=e010763bw0u", "autoplay=1", "adplay=0", "searchbar=0", "showend=0"].join("&amp;"),
                    src: "http://imgcache.qq.com/tencentvideo_v1/player/TPout.swf?max_age=86400&amp;v=20121129",
                    quality: "high",
                    bgcolor: "#000000",
                    width: "700",
                    height: "434",
                    align: "middle",
                    allowfullscreen: "true",
                    type: "application/x-shockwave-flash",
                    pluginspage: "http://get.adobe.com/cn/flashplayer/"
                });

            // 显示电影
            var show_video = function () {
                // 插入flash object
                $video_el.html(flash_html);

                // 显示遮罩
                $mask.fadeIn();
                // 放电影啦!
                $video_box.fadeIn();
            };

            // 关闭电影
            var close_video = function () {
                // 显示遮罩
                $mask.fadeOut();
                // 放电影啦!
                $video_box.fadeOut(function () {
                    $video_el.empty();
                });
            };

            // 点击播放
            $play.on('click', function (e) {
                e.preventDefault();
                show_video();
            });

            $mask.on('click', function (e) {
                e.preventDefault();
                close_video();
            });
            $video_box.on('click', '[data-name=X]', function (e) {
                e.preventDefault();
                close_video();
            });
        },

        init_glume: function () {
            new Glume('home_slide');
        }
    };


    /**
     * Glume v1.0
     * @author unknown
     * @date unkonwn
     */
    var Glume = (function () {
        if (!Function.prototype.bind) {
            Function.prototype.bind = function (obj) {
                var owner = this, args = Array.prototype.slice.call(arguments), callobj = Array.prototype.shift.call(args);
                return function (e) {
                    e = e || top.window.event || window.event;
                    owner.apply(callobj, args.concat([e]));
                };
            };
        }
        var glume = function (id) {
            this.ctn = document.getElementById(id);
            this.adLis = null;
            this.btns = null;
            this.$btn_play = null;
            this.$down_now = null;
            this.animStep = 0.1;//动画速度0.1～0.9
            this.switchSpeed = 5;//自动播放间隔(s)
            this.defOpacity = 1;
            this.tmpOpacity = 1;
            this.crtIndex = 0;
            this.crtLi = null;
            this.adLength = 0;
            this.timerAnim = null;
            this.timerSwitch = null;
            this.init();
        };
        glume.prototype = {
            fnAnim: function (toIndex) {
                if (this.timerAnim) {
                    window.clearTimeout(this.timerAnim);
                }
                if (this.tmpOpacity <= 0) {
                    this.crtLi.style.opacity = this.tmpOpacity = this.defOpacity;
                    this.crtLi.style.filter = 'Alpha(Opacity=' + this.defOpacity * 100 + ')';
                    this.crtLi.style.zIndex = 0;
                    this.crtIndex = toIndex;
                    return;
                }
                this.crtLi.style.opacity = this.tmpOpacity = this.tmpOpacity - this.animStep;
                this.crtLi.style.filter = 'Alpha(Opacity=' + this.tmpOpacity * 100 + ')';
                this.timerAnim = window.setTimeout(this.fnAnim.bind(this, toIndex), 50);
            },
            fnNextIndex: function () {
                return (this.crtIndex >= this.adLength - 1) ? 0 : this.crtIndex + 1;
            },
            fnSwitch: function (toIndex) {
                if (this.crtIndex == toIndex) {
                    return;
                }
                this.crtLi = this.adLis[this.crtIndex];
                for (var i = 0; i < this.adLength; i++) {
                    this.adLis[i].style.zIndex = 0;
                }
                this.crtLi.style.zIndex = 2;
                this.adLis[toIndex].style.zIndex = 1;
                for (var i = 0; i < this.adLength; i++) {
                    this.btns[i].className = '';
                }
                this.btns[toIndex].className = 'on';
                this.fnAnim(toIndex);

                if (toIndex === 0) { // 第一页显示播放按钮
                    this.$down_now.hide();
                    this.$btn_play.show();
                } else { // 其他页显示下载按钮
                    this.$down_now.show();
                    this.$btn_play.hide();
                }
            },
            fnAutoPlay: function () {
                this.fnSwitch(this.fnNextIndex());
            },
            fnPlay: function () {
                this.timerSwitch = window.setInterval(this.fnAutoPlay.bind(this), this.switchSpeed * 1000);
            },
            fnStopPlay: function () {
                window.clearTimeout(this.timerSwitch);
            },
            init: function () {
                this.adLis = this.ctn.getElementsByTagName('li');
                this.btns = this.ctn.getElementsByTagName('cite')[0].getElementsByTagName('span');
                this.$btn_play = $('#_video_play');
                this.$down_now = $('#_download_now');
                this.adLength = this.adLis.length;
                for (var i = 0, l = this.btns.length; i < l; i++) {
                    with ({i: i}) {
                        this.btns[i].index = i;
                        this.btns[i].onclick = this.fnSwitch.bind(this, i);
                        this.btns[i].onclick = this.fnSwitch.bind(this, i);
                    }
                }
                this.adLis[this.crtIndex].style.zIndex = 2;
                this.fnPlay();
                this.ctn.onmouseover = this.fnStopPlay.bind(this);
                this.ctn.onmouseout = this.fnPlay.bind(this);

                this.$btn_play.show();
            }
        };
        return glume;
    })();

    var
        is_has_flash,
        has_flash = function () {
            if (typeof is_has_flash === 'boolean') {
                return is_has_flash;
            }

            var swf;
            try {
                try {
                    swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                } catch (e) {
                }
            } catch (e) {
            } finally {
                if (!swf && navigator.plugins && navigator.plugins.length > 0) {
                    swf = navigator.plugins["Shockwave Flash"];
                }
            }
            return is_has_flash = (swf != null);
        },

        get_flash_html = function (flash_args, require_ver, flash_player_cid) {
            var attrs = [], params = [];
            flash_player_cid = flash_player_cid || 'D27CDB6E-AE6D-11cf-96B8-444553540000';

            $.each(flash_args, function (attr_key, attr_val) {
                switch (attr_key) {
                    case "movie":
                        return true;
                        break;
                    case "id":
                    case "name":
                    case "width":
                    case "height":
                    case "style":
                        attrs.push(attr_key + "='" + attr_val + "' ");
                        break;
                    default:
                        params.push("<param name='" + ((attr_key == "src") ? "movie" : attr_key) + "' value='" + attr_val + "' />");
                        attrs.push(attr_key + "='" + attr_val + "' ");
                }
            });

            if ($.browser.msie) {
                return '<object classid="clsid:' + flash_player_cid + '" ' + attrs + ">" + params.join('') + '</object>';
            } else {
                return '<embed ' + attrs.join('') + ' pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"></embed>';
            }
        };

    return HomePage;
})();
