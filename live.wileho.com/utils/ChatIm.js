/*
 插件名：ChatIm 实时消息推送
 作者：杨状状
 日期：2017-05-10
*/
var ChatIm_Init = function (ApiConfig,token_uid,cb) {
  var ChatIm_Api_Url = ApiConfig.Url;
  var ChatIm_Api_Server = ApiConfig.Im;
  wx.connectSocket({
    url: ChatIm_Api_Server,
    success: function () {
      wx.onSocketOpen(function () {
        console.log('chatim service success');
        wx.sendSocketMessage({
          data: JSON.stringify({ type: 'init', token: token_uid}),
          success: function () {
            console.log('chatim service init success');
            wx.onSocketMessage(function (message) {
              message = JSON.parse(message.data);
              switch (message.message_type) {
                case 'init':
                  setInterval(function () {
                    wx.sendSocketMessage({ data: JSON.stringify({ type: 'online', token: token_uid}) });
                  }, 20000);
                  return;
                case 'loginoutgroup':
                  wx.sendSocketMessage({ data: JSON.stringify({ type: 'loginoutgroup', appid: ChatIm_default.AppId, groupid: ChatIm_default.GroupId }) });
                default:
                  return typeof cb == "function" && cb(message);
              }
            });
          },
          fail: function () {
            console.log('chatim service init error');
          }
        });
      });
      wx.onSocketError(function () {
        console.log('chatim service error');
      });
      wx.onSocketClose(function () {
        console.log('chatim service close');
      })
    },
    fail: function () {
      console.log('chatim service error');
    }
  });
}
module.exports = {
  ChatIm_Init: ChatIm_Init
}