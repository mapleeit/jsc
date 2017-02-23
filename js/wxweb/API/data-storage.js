"use strict";
Page({
    getStorage: function (e) {
        var o = e.detail.value.key;
        console.log("getStorage", o),
        wx.getStorage({
            key: o, complete: function (e) {
                console.log(e)
            }
        })
    }, setStorage: function (e) {
        var o = e.detail.value.key, t = e.detail.value.data;
        wx.setStorage({
            key: o, data: t, complete: function (e) {
                console.log(e)
            }
        })
    }, clearStorage: function (e) {
        console.log("clearStorage", e),
        wx.clearStorage({
            complete: function (e) {
                console.log(e)
            }
        })
    }
});