var ApiConfig = {
    Url : 'https://api.wileho.com/',
    Im: 'wss://im.wileho.com'
};
var WxNotificationCenter = require("WxNotificationCenter/WxNotificationCenter.js");
var ChatIm_Init = require('ChatIm.js');
function ajax(url,method,data,session_id,cb){
    wx.request({  
      url: ApiConfig.Url + url,  
        data: data,  
        method: method,  
        header: {
            'Content-Type' : 'application/json',
            'Header-Session' : session_id
        }, 
        dataType:'json', 
        success: function(res){  
            return typeof cb == "function" && cb(res.data); 
        },
        complete:function(res){
            if(res.statusCode != 200){
                wx.showModal({
                    title: '系统提示',
                    content: '网络请求失败，请重新重新尝试',
                    showCancel:true,
                    cancelText:"取消",
                    confirmText:"重试",
                    confirmColor: "#face15",
                    success: function(ajax_error) {}
                });
                res = false;
                return typeof cb == "function" && cb(res);
            }
        }
    });
}
module.exports = {
    ajax: ajax,
    ApiConfig: ApiConfig,
    Notice: WxNotificationCenter,
    ChatIm_Init: ChatIm_Init
}