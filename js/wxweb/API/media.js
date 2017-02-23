"use strict";
var voiceLocalId = "";
Page({
    chooseImage: function () {
        console.log("chooseImage"),
        wx.chooseImage({
            complete: function (o) {
                console.log(o)
            }
        })
    }, previewImage: function () {
        console.log("previewImage"),
        wx.previewImage({
            current: "http://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242LQJ7aaIybF2ZeIqLWiceWFEBpiaeqm3SdXeYMzJiaWIGwicZxHpEXic8TybEIxZpY971h2g/0?wx_fmt=jpeg",
            urls: ["http://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242LQJ7aaIybF2ZeIqLWiceWFEBpiaeqm3SdXeYMzJiaWIGwicZxHpEXic8TybEIxZpY971h2g/0?wx_fmt=jpeg", "http://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242LQJ7aaIybF2ZhnZr88Zxyt163QuRrLobaLzf1hYUh6icbzesoosej1A2SsCVericanag/0?wx_fmt=jpeg"],
            complete: function (o) {
                console.log(o)
            }
        })
    }, startRecord: function () {
        console.log("startRecord"),
        wx.startRecord({
            success: function (o) {
                voiceLocalId = o.localId, wx.setAppData({voiceLocalId: voiceLocalId})
            }, complete: function (o) {
                console.log(o)
            }
        })
    }, stopRecord: function () {
        console.log("stopRecord"),
        wx.stopRecord({
            complete: function (o) {
                console.log(o)
            }
        })
    }, playVoice: function () {
        console.log("playVoice"), wx.playVoice({
            localId: voiceLocalId, complete: function (o) {
                console.log(o)
            }
        })
    }, pauseVoice: function () {
        console.log("pauseVoice"),
        wx.pauseVoice({
            localId: voiceLocalId, complete: function (o) {
                console.log(o)
            }
        })
    }, stopVoice: function () {
        console.log("stopVoice"),
        wx.stopVoice({
            localId: voiceLocalId, complete: function (o) {
                console.log(o)
            }
        })
    }, chooseVideo: function () {
        console.log("chooseVideo"),
        wx.chooseVideo({
            sourceType: ["album", "camera"],
            camera: ["front", "back"],
            success: function (o) {
                console.log(o)
            }
        })
    }, voiceLocalIdChange: function () {
        console.log("voiceLocalIdChange", res.detail.value),
            voiceLocalId = res.detail.value
    }
});