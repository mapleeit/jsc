/**
 * 将获取到的文件转化成数结构
 * @author bondli
 * @date 13-12-10
 */
define(function (require, exports, module) {

    var $ = require('$'),

        lib = require('lib'),
        console = lib.get('./console'),

        undefined;

    function TreeNode(name) {
        this.name = name;
        this.ppdir = null;
        this.pdir = null;
        this.dir = null;
        this.dirNodes = new Array();
        this.fileNodes = new Array();
        this.parentNode = null;
    };

    TreeNode.prototype.get_dir_keys = function() {
        var pdir = this.parentNode.dir,
            ppdir = this.ppdir ? this.ppdir : this.parentNode.pdir;
        return {"ppdir": ppdir, "pdir": pdir};
    };

    TreeNode.prototype.set_ppdir = function(ppdir) {
        //console.log('set_ppdir',ppdir);
        this.ppdir = ppdir;
    };

    TreeNode.prototype.set_pdir = function(pdir) {
        //console.log('set_pdir',pdir);
        this.pdir = pdir;
    };

    TreeNode.prototype.set_dir = function(dir) {
        //console.log('set_dir',dir);
        this.dir = dir;
    };

    TreeNode.prototype.addFile = function(file) {
        file.parentNode = this;
        this.fileNodes[this.fileNodes.length] = file;
    };

    TreeNode.prototype.addDir = function(dir) {
        dir.parentNode = this;
        this.dirNodes[this.dirNodes.length] = dir;
    };
    TreeNode.prototype.getSubdirByName = function(dirName) {
        var parentNode = this,
            subDir,
            has_found = false;

        if(parentNode.dirNodes.length) {
            for(var i = 0, len = parentNode.dirNodes.length; i < len; i++) {
                if(parentNode.dirNodes[i].name == dirName) {
                    subDir = parentNode.dirNodes[i];
                    has_found = true;
                    break;
                }
            }
        }

        if(has_found) {
            return subDir;
        }
    };

    return TreeNode;

});