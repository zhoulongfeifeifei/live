/**
 * github地址: https://github.com/icindy/WxNotificationCenter
*/
var __notices = [];
var isDebug = false;
function addNotification(name, selector, observer) {
    if (name && selector) {
        if(!observer){
            console.log("addNotification Warning: no observer will can't remove notice");
        }
        var newNotice = {
            name: name,
            selector: selector,
            observer: observer
        };
        addNotices(newNotice);
    } else {
        console.log("addNotification error: no selector or name");
    }
}
function addNotices(newNotice) {
    __notices.push(newNotice);
}
function removeNotification(name,observer) {
    for (var i = 0; i < __notices.length; i++){
        var notice = __notices[i];
        if(notice.name === name){
        if(notice.observer === observer){
            __notices.splice(i,1);
            return;
        }
        }
    }
}
function postNotificationName(name, info) {
    if(__notices.length == 0){
      console.log("postNotificationName error: u hadn't add any notice.");
      return false;
    }
    for (var i = 0; i < __notices.length; i++){
      var notice = __notices[i];
      if(notice.name === name){
          notice.selector(info);
      }
    }
}
function findNotificationName(name){
    if(__notices.length == 0){
      console.log("postNotificationName error: u hadn't add any notice.");
      return false;
    }
    for (var i = 0; i < __notices.length; i++){
      var notice = __notices[i];
      if(notice.name === name){
          return notice.observer;
      }
    }
}

function cmp(x, y) {
    if (x === y) {
        return true;
    }
    if (! (x instanceof Object) || !(y instanceof Object)) {
        return false;
    }
    if (x.constructor !== y.constructor) {
        return false;
    }
    for (var p in x) {
        if (x.hasOwnProperty(p)) {
            if (!y.hasOwnProperty(p)) {
                return false;
            }
            if (x[p] === y[p]) {
                continue;
            }
            if (typeof(x[p]) !== "object") {
                return false;
            }
            if (!Object.equals(x[p], y[p])) {
                return false;
            }
        }
    }
    for (p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
            return false;
        }
    }
    return true;
};
module.exports = {
    addNotification: addNotification,
    removeNotification: removeNotification,
    postNotificationName: postNotificationName,
    findNotificationName: findNotificationName
}