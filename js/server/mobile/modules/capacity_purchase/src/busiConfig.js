define(function(require, exports, module) {
    return {
        // 空间活动平台提供的appid，手机端和PC端做区分
        "QZONE_ACT_PLATFORM_APPID_MOBILE":1450008585,
        "QZONE_ACT_PLATFORM_APPID_PC":1450008595,
        // 空间活动平台配置的活动id
        "QZONE_ACT_PLATFORM_ACTID": 630,
        // 容量和ruleid的映射
        "SPACE_RULEID_MAP": {
            "20G": 3200,
            "50G": 3201,
            "200G": 3202,
            "1T": 3203
        },
        // ruleid和容量券购买页面标题、介绍的映射
        "COUPON_RULEID_INFO_MAP": {
            "3200": {
                "name": "微云20G容量",
                "desc": "购买微云20G容量，可在现有容量基础上叠加使用"
            },
            "3201": {
                "name": "微云50G容量",
                "desc": "购买微云50G容量，可在现有容量基础上叠加使用"
            },
            "3202": {
                "name": "微云200G容量",
                "desc": "购买微云200G容量，可在现有容量基础上叠加使用"
            },
            "3203": {
                "name": "微云1T容量",
                "desc": "购买微云1T容量，可在现有容量基础上叠加使用"
            }
        },

        // 顶部Bar ： 会员专享容量大小
        "VIP_INITIAL_CAPACITY": '3T'
    }
});