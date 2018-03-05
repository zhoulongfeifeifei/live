var http = require('utils/util.js');
App({
    onLaunch: function (options) {
        var that = this;
        wx.getStorage({
          key: 'token',
            success: function(session) {
              that.globalData.token = session.data.token;
              that.globalData.token_uid = session.data.token_uid;
            }
        });
    },
    onShow: function() {
        var that = this;
    },
    onHide: function() {
        var that = this;
    },
    checklogin:function(pagename){
        var that = this;
        wx.login({
            success: function (login) {
              wx.getUserInfo({
                lang:"zh_CN",
                success: function (userinfo) {
                  that.globalData.userInfo = userinfo.userInfo;
                  http.ajax('wechat-app-nologin.api','GET',{code : login.code},false,function(onlogin){
                    if(onlogin){
                        if(onlogin.code == 0){
                          http.ajax('wechat-app-checkoutuserinfo.api','POST',{
                                user_info_data : userinfo,
                                session_key: onlogin.data.session_key
                            },false,function(checkoutuserinfo){
                                if(checkoutuserinfo){
                                    if(checkoutuserinfo.code == 0){
                                        wx.setStorage({
                                            key: "token",
                                            data: { token: checkoutuserinfo.data.token, token_uid: checkoutuserinfo.data.token_uid}
                                        });
                                        that.globalData.token = checkoutuserinfo.data.token;
                                        that.globalData.token_uid = checkoutuserinfo.data.token_uid;
                                        http.Notice.postNotificationName(pagename,{type:"login",data:"checklogin ok"});
                                    }else{
                                        console.log('Request Checkoutuserinfo Error');
                                    }
                                }else{
                                    console.log('Request Checkoutuserinfo Error');
                                }
                            });
                        }else{
                            console.log('Request Onlogin Error.');
                        }
                    }else{
                        console.log('Request Onlogin Error');
                    }
                  });
                },
                fail:function(){
                  wx.showModal({
                    title: '提示',
                    content: "使用前请允许微信授权登陆",
                    showCancel: false,
                    confirmText: "去设置",
                    confirmColor: "#face15",
                    success: function (res) {
                      if (res.confirm) {
                        wx.openSetting({
                          success: function (res) {
                            that.checklogin(pagename);
                          }
                        });
                      }else{
                        that.checklogin(pagename);
                      }
                    }
                  });
                }
            });
          },
          fail: function(){
            console.log("login Error");
            wx.showModal({
              title: '系统提示',
              content: '网络请求失败',
              showCancel:true,
              cancelText:"取消",
              confirmText:"重试",
              confirmColor: "#face15",
              success: function(ajax_error) {
                  if(ajax_error.confirm) {
                    checklogin(pagename);
                  }
              }
            });
          }
        });
    },
    globalData:{
        token : false,
        token_uid : false
    },
    func : {
        ajax : http.ajax,
        ApiConfig: http.ApiConfig,
        Notice: http.Notice,
        ChatIm_Init: http.ChatIm_Init
    }
})