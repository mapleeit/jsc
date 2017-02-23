define(function (require, exports, module) {

    var $ = require('$'),
        console = require('lib').get('./console'),
        Queue = function () {
            this.fn_stack = [];
            this.ctx_stack = [];
            this.only_key = 0;
        },
        queues = {length: 0};

    $.extend(Queue.prototype,
        {
            length: function(){
                return this.fn_stack.length;
            },
            head: function (ctx, fn) {
                this.remove(this.del_local_id);
                this.fn_stack.unshift(fn);
                this.ctx_stack.unshift(ctx);
            },
            tail: function (ctx, fn) {
                fn.del_local_id = ctx.del_local_id;
                this.fn_stack.push(fn);
                this.ctx_stack.push(ctx);
            },
            dequeue: function (len) {
                if (this.fn_stack.length === 0) {
                    return;
                }

                len = Math.min(this.fn_stack.length, len || 1);

                var fn, ctx;
                for (var i = 0; i < len; i++) {
                    fn = this.fn_stack.shift();
                    ctx = this.ctx_stack.shift();
                    this.only_key = ctx.local_id;
                    fn && fn.call(ctx);
                }
            },
            clear: function () {
                this.fn_stack.length = 0;
                this.ctx_stack.length = 0;
            },

            remove: function (del_local_id) {
                if(!del_local_id)
                    return;
                for (var len = this.fn_stack.length - 1; len >= 0; len--) {
                    var c = this.fn_stack[len];
                    if (c.del_local_id === del_local_id) {
                        this.fn_stack.splice(len, 1);
                        this.ctx_stack.splice(len, 1);
                        return true;
                    }
                }
            },
            get_only_key: function () {
                return this.only_key;
            },
            set_only_key: function (s_id, t_id) {//扫描后更新了local_id需要做出调整
                if (!s_id || this.only_key === s_id) {
                    this.only_key = t_id;
                }
            }
        });


    module.exports = {
        get: function (key) {
            var _key = key || 'default_key';
            if (!queues[_key]) {
                queues[_key] = new Queue();
                queues.length += 1;
            }
            return queues[_key];
        },
        clear: function (key) {
            var _key = key || 'default_key';
            if(queues[_key]){
                queues[_key].clear();
                queues[_key] = null;
                queues.length -= 1;
                delete queues[_key];
            }
        }
    }
});