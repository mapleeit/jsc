"use strict";
Page({
    data: {canvas: {width: 200, height: 200}}, onLoad: function () {
        var a = this;
        wx.getSystemInfo({
            success: function (t) {
                console.log(t), a.setData({canvas: {width: t.windowWidth, height: t.windowHeight}})
            }
        })
    }, canvasIdChange: function (a) {
        console.log("canvasIdChange", a);
        var t = a.detail.canvasId, o = wx.createContext();
        o.beginPath(), o.arc(75, 75, 50, 0, 2 * Math.PI, !0), o.moveTo(110, 75), o.arc(75, 75, 35, 0, Math.PI, !1), o.moveTo(65, 65), o.arc(60, 65, 5, 0, 2 * Math.PI, !0), o.moveTo(95, 65), o.arc(90, 65, 5, 0, 2 * Math.PI, !0), o.stroke();
        var n = o.getActions();
        console.log(n), wx.drawCanvas({canvasId: t, actions: n})
    }
});