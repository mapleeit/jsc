"use strict";
Page({
    onLoad: function (o) {
        console.log("onLoad", o)
    }, onReady: function (o) {
        console.log("onReady", o)
    }, navigateTo: function () {
        console.log("navigateTo"), wx.navigateTo({url: "/API/data-storage"})
    }, navigateBack: function () {
        console.log("navigateBack"), wx.navigateBack()
    }, redirectTo: function () {
        console.log("redirectTo"), wx.redirectTo({url: "/API/data-storage"})
    }
});