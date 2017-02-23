"use strict";
Page({
    openAddress: function () {
        console.log("openAddress"),
        wx.openAddress({
            complete: function (e) {
                console.log(e)
            }
        })
    }
});