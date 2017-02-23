"use strict";
Page({
    getLocation: function () {
        console.log("getLocation"),
        wx.getLocation({
            complete: function (e) {
                console.log(e)
            }
        })
    }, openLocation: function () {
        var e = Number(res.detail.value.latitude.value),
            o = Number(res.detail.value.longitude.value),
            t = res.detail.value.name.value,
            a = res.detail.value.address.value;
        console.log("openLocation", e, o, t, a),
        wx.openLocation({
            latitude: e,
            longitude: o,
            name: t,
            address: a,
            complete: function (e) {
                console.log(e)
            }
        })
    }
});