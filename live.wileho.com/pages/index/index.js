var page_name = "index";
//ffff
var app = getApp();
var api_fun = function(that) {
    app.func.ajax('api-index-index.api', 'GET', {}, app.globalData.token, function(json_data) {
        if (json_data) {
            if (json_data.code == -1) {
                app.checklogin(page_name);
            } else if (json_data.code == 10000) {
                that.setData({
                    inloading_text: json_data.msg
                });
            } else {
                that.setData({
                    inloading: false,
                    page_code: json_data.code,
                    page_data: json_data.data
                });
                app.func.ChatIm_Init.ChatIm_Init(app.func.ApiConfig, app.globalData.token_uid, function(ChatIm_Message) {
                    console.log(ChatIm_Message);
                });
            }
        }
    });
};
Page({
    data: {
        page_code: -1,
        page_data: false,
        inloading: true,
        inloading_text: "页面正在努力加载中",
        live_push: false,
        live_status: false,
        live_push_url: "rtmp://18716.livepush.myqcloud.com/live/18716_bf69186f34?bizid=18716&txSecret=7655c73eb3712b2a45f387da64a542e1&txTime=5A43C37F"
    },
    onLoad: function(options) {
        var that = this;
        that.setData({
            live_push: wx.createLivePusherContext("pusher")
        });
        app.func.Notice.addNotification(page_name, that.NotificationFn, that);
    },
    onReady: function() {
        var that = this;
        api_fun(that);
    },
    onShow: function() {
        var that = this;
    },
    onHide: function() {
        var that = this;
    },
    onUnload: function() {
        var that = this;
    },
    Live_Start: function() {
        var that = this;
        that.data.live_push.start({
            success: function() {
                console.log('start success!');
                that.setData({
                    live_status: true
                });
            },
            fail: function() {
                console.log('start failed!')
            }
        });
    },
    Live_Switch_Camera: function() {
        var that = this;
        that.data.live_push.switchCamera({
            success: function() {
                console.log('switchCamera success!')
            },
            fail: function() {
                console.log('switchCamera failed!')
            }
        });
    },
    Live_Stop: function() {
        var that = this;
        that.data.live_push.stop({
            success: function() {
                console.log('stop success!');
                that.setData({
                    live_status: false
                });
            },
            fail: function() {
                console.log('stop failed!')
            }
        });
    },
    onPullDownRefresh: function() {
        var that = this;
        wx.stopPullDownRefresh();
    },
    NotificationFn: function(Notification) {
        if (Notification.type == "login") {
            var thatpage = app.func.Notice.findNotificationName(page_name);
            api_fun(thatpage);
        } else {
            console.log("Notification Not Type");
        }
    }
})