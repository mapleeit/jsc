/**
 * share_info 数据存储模块
 */
define(function(require, exports, module){
    var $ = require('$'),
        lib = require('lib'),
        common = require('common'),

        Module = lib.get('./Module'),
        user_log = common.get('./user_log'),
        request = common.get('./request'),

        undefined;

    var nodes_map = {};

    var File = function(parent, data) {
        this.parent = parent;
        this.data = data;
        this.child_file_list = [];
        this.child_dir_list = [];
    }

    File.prototype = {
        get_id: function() {
            return this.data['file_id'] || this.data['dir_key'];
        },

        get_name: function() {
            return this.data['file_name'] || this.data['dir_name'];
        },

        get_type: function() {
            if(this.data['dir_name']) {
                return '';
            } else {
                return (this.data['file_name'].split('.')[1] || '').toLowerCase();
            }
        },

        get_file_size: function() {
            return this.data['file_size'];
        },

        get_pdir_key: function() {
            return this.data['pdir_key'];
        },

        get_thumb_url: function() {
            return this.data['thumb_url'];
        },

        get_parent: function() {
            return this.parent;
        },

        get_file_children: function() {
            return this.child_file_list;
        },
        get_dir_children: function() {
            return this.child_dir_list;
        },

        is_dir: function() {
            return !!this.data['dir_key'];
        },

        is_image: function() {
            return !!this.data['thumb_url'];
        },

        append_child: function(node) {
            if(node.is_dir()) {
                this.child_dir_list.push(node);
            } else {
                this.child_file_list.push(node);
            }

            nodes_map[node.get_id()] = node;
        }
    }

    var root_node = new File(null, {
        file_id: '',
        file_name: '微去分享',
        pdir_key: '',
        file_size: 0
    })

    var store = new Module('store', {

        init: function(share_info) {
            this.share_info = share_info || {};
            var share_flag = parseInt(this.share_info['share_flag'], 10);

            if(share_flag == 5 || share_flag == 6) {
                this.share_type = 'collector';
            } else if(share_flag == 7 || share_flag == 8) {
                this.share_type = 'article';
            } else if(share_flag == 2 || share_flag == 4) {
                this.share_type = 'note';
            } else {
                this.share_type = 'normal';
            }

            this.format_file_list(share_info, root_node);
            this.format_dir_list(share_info, root_node);

        },

        format_file_list: function(info, root_node) {
            var file_list = info['file_list'];

            if(file_list && file_list.length) {
                $.each(file_list, function(i, file) {
                    var file_node = new File(root_node, {
                        pdir_key: file['pdir_key'] || info['dir_key'] || info['pdir_key'],
                        file_id: file['file_id'],
                        file_name: file['file_name'],
                        file_size: file['file_size'],
                        thumb_url: file['thumb_url']
                    });
                    root_node.append_child(file_node);
                });
            }
        },

        format_dir_list: function(info, root_node) {
            var dir_list = info['dir_list'];

            if(dir_list && dir_list.length) {
                $.each(dir_list, function(i, dir) {
                    var dir_node = new File(root_node, {
                        pdir_key: dir['pdir_key'] || info['dir_key'] || info['pdir_key'],
                        dir_key: dir['dir_key'],
                        file_name: dir['dir_name'],
                        file_size: dir['dir_size'] || 0
                    });
                    root_node.append_child(dir_node);
                    if(dir['file_list']) {
                        store.format_file_list(dir, dir_node);
                    }
                    if(dir['dir_list']) {
                        store.format_dir_list(dir, dir_node);
                    }
                });
            }
        },

        /*get_file_list: function() {
            return this.share_info['file_list'];
        },

        get_dir_list: function() {
            return this.share_info['dir_list'];
        },

        get_dir_file_list: function() {
            if(this.share_info['dir_list'] && this.share_info['dir_list'].length === 1) {
                return this.share_info['dir_list']['file_list'] || [];
            }
            return [];
        },*/

        get_node_by_id: function(id) {
            return nodes_map[id];
        },

        get_root_node: function() {
            return root_node;
        },

        get_share_key: function() {
            return this.share_info['share_key'];
        },

        get_share_pwd: function() {
            return this.share_info['pwd'];
        },

        get_sid: function() {
            return this.share_info['sid'];
        },

        is_photo_list: function() {
            if(typeof this.is_all_image !== 'undefined') {
                return this.is_all_image;
            }
            if(this.share_type !== 'normal') {
                return false;
            }
            var share_info = this.share_info;

            if(share_info['dir_list'] && share_info['dir_list'].length > 0) {
                return false;
            }
            var file_list = share_info['file_list'],
                is_all_image = true;
            if(file_list && share_info['dir_list']) {
                return false;
            }
            if(file_list && !share_info['dir_list']) {
                for(var i = 0, len = file_list.length; i < len; i++) {
                    if(!file_list[i].thumb_url) {
                        is_all_image = false;
                        break;
                    }
                }
            }
            this.is_all_image = is_all_image;
            return is_all_image;
        },
        is_file_list: function() {
            return this.share_type === 'normal' && !this.is_photo_list();
        },
        is_note: function() {
            return this.share_type == 'note';
        },

        is_article: function() {
            return this.share_type == 'article';
        },

        is_collector: function() {
            return this.share_type == 'collector';
        },

        is_need_pwd: function() {
            return !!this.share_info.need_pwd;
        },

        is_temporary: function() {
            return !!this.share_info.temporary;
        },

        get_thumb_urls: function(size) {
            var thumb_urls = [];
            if(this.is_photo_list()) {
                var imgs = root_node.child_file_list;

                for(var i= 0, len = imgs.length; i < len; i++) {
                    var thumb_url = imgs[i].get_thumb_url();
                    if(thumb_url) {
                        thumb_url = thumb_url.indexOf('?') > -1 ? thumb_url + '&size='+size+'*'+size : thumb_url + '?size='+size+'*'+size;
                        thumb_urls.push(imgs[i].get_thumb_url() + (size ? '&size='+size+'*'+size : ''));
                    }
                }
            } else {
                var nodes = root_node.child_file_list.length ? root_node.child_file_list : root_node.child_dir_list[0].child_file_list;
                for(var i= 0, len = nodes.length; i < len; i++) {
                    var thumb_url = nodes[i].get_thumb_url();
                    if(thumb_url) {
                        thumb_url = thumb_url.indexOf('?') > -1 ? thumb_url + '&size='+size+'*'+size : thumb_url + '?size='+size+'*'+size;
                        thumb_urls.push(thumb_url);
                    }
                }
            }
            return thumb_urls;
        },

        get_node_index: function(file_id) {
            var imgs = root_node.child_file_list.length ? root_node.child_file_list : root_node.child_dir_list[0].child_file_list,
                index;
            $.each(imgs, function(i, img) {
                if(img.get_id() === file_id) {
                    index = i;
                    return false;
                }
            });

            return index;
        },
        get_image_index: function(file_id) {
            var nodes = root_node.child_file_list.length ? root_node.child_file_list : root_node.child_dir_list[0].child_file_list,
                index,
                imgs = [];
            $.each(nodes, function(i, node) {
                if(node.is_image()) {
                    imgs.push(node);
                }
            });

            $.each(imgs, function(i, img) {
                if(img.get_id() === file_id) {
                    index = i;
                    return false;
                }
            });

            return index;
        },
        get_node_by_index: function(index) {
            return root_node.child_file_list[index] || root_node.child_dir_list[0].child_file_list[index];
        },

        get_image_by_index: function(index) {
            var nodes = root_node.child_file_list.length ? root_node.child_file_list : root_node.child_dir_list[0].child_file_list,
                imgs = [];
            $.each(nodes, function(i, node) {
                if(node.is_image()) {
                    imgs.push(node);
                }
            });

            return imgs[index];
        }
    });

    return store;
});