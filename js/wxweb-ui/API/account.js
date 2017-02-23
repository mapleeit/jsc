"use strict";
Page({
    login: function () {
        console.log("invoke login"), wx.login({
            complete: function (o) {
                console.log(o)
            }
        })
    }
});