"use strict";
Page({
    chooseContact: function () {
        wx.chooseContact({
            success: function (o) {
                console.log(o)
            }
        })
    }
});