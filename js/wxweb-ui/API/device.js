"use strict";
Page({
    getNetworkType: function () {
        wx.getNetworkType({
            success: function (e) {
                console.log(e)
            }
        })
    }, getSystemInfo: function () {
        wx.getSystemInfo({
            complete: function (e) {
                console.log(e)
            }
        })
    }
});