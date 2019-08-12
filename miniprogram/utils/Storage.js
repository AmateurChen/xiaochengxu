import { Utils } from './Utils.js';

const Storage = {

  save: (key, data) => {
    wx.setStorage({
      key: key,
      data: JSON.stringify(data),
    });
  },

  getValue: (key, callback)=> {
    wx.getStorage({
      key: key,
      success(res) {
        callback(Utils.success(JSON.parse(res.data)));
      },
      fail(err) {
        callback(Utils.fail(err.errMsg));
      }
    });
  },

  del: function(key) {
    wx.removeStorage({
      key: key,
      success: function(res) {},
    })
  },

  getValueSync: function(key) {
    try {
      const value = wx.getStorageSync(key);
      if (value !== "") {
        return Utils.success(JSON.parse(value));
      }
    } catch(e) {
      console.log("Storage getDataValue error: " + JSON.stringify(e));
    }
  },

  getStorageInfoSync: function() {
    return wx.getStorageInfoSync();
  },
  

  saveUserInfo: function(data) {
    this.save('userInfo', data);
  },

  getUserInfo: function(callback) {
    return this.getValue('userInfo',callback);
  }


};

module.exports = { Storage };