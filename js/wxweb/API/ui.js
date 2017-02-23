"use strict";
Page({
    onLoad: function (o) {
        console.log("onLoad", o), this.setData({foo: "bar"})
    }, onReady: function () {
        console.log("onReady")
    }, onMenuShareAppMessage: function () {
        return console.log("html"),
        {title: "标题", desc: "nothing", path: "API/ui.html?123=456"}
    }, setNavigationBarTitle: function (o) {
        console.log(o);
        var a = o.detail.value.title;
        console.log("setNavigationBarTitle", a), wx.setNavigationBarTitle({title: a})
    }, showNavigationBarLoading: function () {
        console.log("showNavigationBarLoading"), wx.showNavigationBarLoading()
    }, hideNavigationBarLoading: function () {
        console.log("hideNavigationBarLoading"), wx.hideNavigationBarLoading()
    }
});