import { UserApi } from './UserApi.js';
import { Utils} from '../utils/Utils.js';
import { Cache } from '../utils/Cache.js';

const app = getApp();

const LoginApi = {

  login: function (callback) {
    const loginAction = (data) => {
      UserApi.action("login", data, res => {
        if (Utils.isSuccess(res)) {
          Cache.setLoginFlag(true);
          Cache.saveUserInfo(res.data);
        }
        callback(res);
      });
    };

    const user = Cache.getUserInfo();
    if (user) {
      loginAction(user);
      return;
    }

    UserApi.getAuthorUserInfo(res => {
      if (Utils.isSuccess(res) && !Cache.isLogin()) {
        loginAction(res.data);
        return;
      }
      callback(res);
    });
  },

  isAuthorPermisssion: function(callback) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          callback(Utils.success("已授权！"));
        } else {
          Console.log("用户未进行授权登录：" + JSON.stringify(res));
          callback(Utils.fail("未授权！"));
        }
      },
      fail: err => {
        callback(Utils.fail("授权失败：" + err.errMsg));
      }
    })
  }

};


module.exports = { LoginApi};