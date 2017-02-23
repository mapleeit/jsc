/**
 * 
 * @author cluezhang
 * @date 2013-9-17
 */
define(function(require, exports, module){
    var lib = require('lib'),
        inherit = lib.get('./inherit'),
        Event = lib.get('./Event'),
        $ = require('$');
    /**
     * RangeMgr用于管理范围，基于整数，例如：
     * 创建一个RangeMgr实例，依次添加[1,3], [5,10], [11,12], [15,18], [17,19]
     * 最后getRanges，会返回[1,3], [5,12], [15,19]
     */
    var RangeMgr = inherit(Object, {
        /**
         * @param {Boolean} autoAdjacent 是否自动连接相临的自然数范围，比如[1,4]与[5,8]就是相连，会连接成[1,8]。默认为true
         */
        autoAdjacent : true,
        constructor : function(cfg){
            $.extend(this, cfg);
            this._ranges = [];
        },
        /**
         * 添加范围
         * @param {Object} range 有start与end属性，start必须小于等于end
         */
        addRange : function(affectRange){
            var ranges = this._ranges || [], i, range, autoAdjacent = this.autoAdjacent;
            // 逐个进行判断
            var merged = false, tmp, pos = null;
            for(i=0; i<ranges.length; i++){
                range = ranges[i];
                if(this._isRangeConflict(range, affectRange) || autoAdjacent && this._isRangeAdjacent(range, affectRange)){
                    if(merged){ // 已经合并过，再次合并，并移除此记录
                        tmp = this._mergeRange(range, affectRange);
                        affectRange.start = tmp.start;
                        affectRange.end = tmp.end;
                        ranges.splice(i, 1);
                        i--;
                    }else{ // 没合并过，先合并
                        affectRange = ranges[i] = this._mergeRange(range, affectRange);
                        merged = true;
                    }
                }else if(merged){ // 已经合并过，又无冲突，表明已合并完毕
                    break;
                }else if(affectRange.end < range.start){ // 如果小于当前对比值，则放在它前，形成范围由小至大的顺序
                    pos = i;
                }
            }
            if(!merged){
                // 当没有指定位置，表示没有找到比它小的范围，即新加的范围为最大
                if(pos === null){
                    ranges.push(affectRange);
                }else{
                    ranges.splice(pos, 0, affectRange);
                }
            }
        },
        /**
         * 获取所有的范围，从小到大
         * @return {Array} ranges
         */
        getRanges : function(){
            return this._ranges || [];
        },
        /**
         * 判断是否与当前的范围集有冲突
         * @return {Boolean} conflict
         */
        isConflict : function(range){
            var i, ranges = this._ranges;
            for(i=0; i<ranges.length; i++){
                if(this._isRangeConflict(range, ranges[i])){
                    return true;
                }
            }
            return false;
        },
        /**
         * 清空范围集
         */
        clear : function(){
            this._ranges = [];
        },
        // private
        // 判断两个范围是否有交集
        _isRangeConflict : function(range1, range2){
            return !(
                range1.start<range2.start && range1.end<range2.start || 
                range1.start>range2.end && range1.end>range2.end
            );
            // !(start1<start2 && end1<start2) && !(start1>end2 && end2>end2)
            // (start1>=start2 || end1>=start2) && (start1<=end2 || end2<=end2)
        },
        // private
        // 判断两个范围是否连接
        _isRangeAdjacent : function(range1, range2){
            return range1.start-range2.end === 1 || range1.start-range2.end === -1 ||
                range1.end-range2.start === 1 || range1.end-range2.start === -1;
        },
        // private
        // 此方法并不进行是否可合并判断，需注意使用
        _mergeRange : function(range1, range2){
            var start, end;
            // 取最小
            start = range1.start < range2.start ? range1.start : range2.start;
            // 取最大
            end = range1.end > range2.end ? range1.end : range2.end;
            return {
                start : start,
                end : end
            };
        }
    });
    return RangeMgr;
});