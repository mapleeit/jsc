"use strict";
var shareData = {
    title: "custom title",
    path: "index.html",
    desc: "custom desc",
    imgUrl: "images/wechatHL.png"
};
Page({
    onMenuShareAppMessage: function () {
        return console.log("onMenuShareAppMessage"), shareData
    }, onMenuShareTimeline: function () {
        return console.log("onMenuShareAppMessage"), shareData
    }
});