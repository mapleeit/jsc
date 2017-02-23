"use strict";
Page({
    onLoad: function () {
        wx.onSocketMessage(function (o) {
            console.log(o)
        }), wx.onSocketOpen(function () {
            console.log("socket open")
        }), wx.onSocketClose(function () {
            console.log("socket close")
        }), wx.onSocketError(function (o) {
            console.log("socket error", o)
        })
    }, request: function (o) {
        console.log(o);
        var e = o.detail.value.url;
        wx.request({
            url: e,
            header: {"content-type": "application/json", cookie: "testcookie"},
            dataType: "json",
            data: JSON.stringify({foo: "bar"}),
            method: "POST",
            complete: function (o) {
                console.log("request response", o)
            }
        })
    }, connectSocket: function (o) {
        var e = o.detail.value.url;
        console.log("connectSocket", e),
        wx.connectSocket({
            url: e, complete: function (o) {
                console.log(o)
            }
        })
    }, sendSocketMessage: function (o) {
        var e = o.detail.value.message;
        console.log("sendSocketMessage", e),
        wx.sendSocketMessage({
            data: e, complete: function (o) {
                console.log(o)
            }
        })
    }, closeSocket: function (o) {
        wx.closeSocket({
            complete: function (o) {
                console.log(o)
            }
        })
    }
});