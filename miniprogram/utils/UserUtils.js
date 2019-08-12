import {Storage} from './Storage.js'
import {Service} from './Service.js'

const app = getApp();


const UserUtils = {
  

  getUserInfo: function(callback) {
    const global = getApp().getGlobalData();
    if (global.userInfo) {

    }

  },
  

  getLocalUserInfo: function (callback) {
    // 先从本地读取数据，判断用户是否已经登录过
    Storage.getUserInfo(result => {
      if (result.error || !result.data.openid) {
        this.applyUserInfo(res => {
          callback(res);
        });
        return ;
      }
      if (result.data && result.data.openid) {
        // 拿到用户唯一ID，通过ID 查询用户最新信息
        Service.queryUser(result.data.openid, res => {
          if (res.error) {
            callbck(res);
          } else {
            // 同步最新数据 保存到本地
            Storage.saveUserInfo(res.data);
            callback(res);
          }
        });
      }
    });
  },

  applyUserInfo: function (callback){
    this._getAuthorUserInfo(result => {
      if (result.error) {
        callback(result);
      } else {
        Service.login({ baseInfo: result.data}, res => {
          if (res.error) {
            callback(res);
          } else {
            Storage.saveUserInfo({ data: res.data});
            callback(res);
          }
        });
      }
    });
  },

  _getAuthorUserInfo: callback => {
    wx.getUserInfo({
      success: res => {
        callback({ data: res.userInfo});
      },
      fail: err => {
        callback({ error: err.errMsg});
      }
    });
  },

  _getLocalUserInfo: callback => {
    Storage.getUserInfo(res => {
      if (res.error) {
        callback({error: '0x1000001'});
      } else {
        callback(res.data);
      }
    });
  }
}

module.exports = {UserUtils};