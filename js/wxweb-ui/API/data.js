"use strict";
Page({
    authorize: function () {
        console.log("authorize"),
        wx.authorize({
            scope: ["webapi_userinfo", "webapi_friends"], complete: function (o) {
                console.log(o)
            }
        })
    }, getUserInfo: function () {
        console.log("getUserInfo"),
        wx.getUserInfo({
            complete: function (o) {
                console.log(o)
            }
        })
    }, getFriends: function () {
        console.log("getFriends"),
        wx.getFriends({
            complete: function (o) {
                console.log(o)
            }
        })
    }
});