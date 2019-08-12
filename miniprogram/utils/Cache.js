import { Utils } from './Utils.js';
import { Storage } from './Storage.js';

let cache = getApp().global;

const Cache = {

  getUserInfo: function() {
    if (!this.isLogin()) {
      return ;
    }
    if (cache.userInfo) {
      return cache.userInfo;
    }
    const result = Storage.getValueSync("userInfo");
    if (Utils.isSuccess(result)) {
      return result.data;
    }
  },

  saveUserInfo: function(userInfo) {
    cache.userInfo = userInfo;
    Storage.save("userInfo", userInfo)
  },

  isLogin: function() {
    return cache.isLogin;
  },

  setLoginFlag: function(flag) {
    cache.isLogin = flag;
  },

  getQrcodeRecords: function() {
    if (!cache.records) {
      const result = Storage.getValueSync("records");
      if (Utils.isSuccess(result)) {
        cache.records = result.data;
      } else {
        cache.records = [];
      }
    }
    return cache.records;
  },

  saveQrcodeRecords: function(qrcode) {
    let records = qrcode instanceof Array ? qrcode : this.getQrcodeRecords();
    if (qrcode instanceof Array) {
      records = qrcode;
    } else {
      for (let i = 0; i < records.length; i++) {
        if (records[i]._id === qrcode._id) {
          records.splice(i, 1);
          break;
        }
      }
      records.unshift(qrcode);
    }

    cache.records = records
    if (records.length === 0) {
      Storage.del("records");
      return ;
    }
    Storage.save("records", records);
  },

  delQrcodeRecords: function(qrcode) {
    const records = this.getQrcodeRecords();
    for (let i = 0; i < records.length; i++) {
      if (records[i]._id === qrcode._id) {
        records.splice(i, 1);
        break;
      }
    }
  },

  getCacheSize: function() {
    const info = wx.getStorageInfoSync();
    if (info) {
      return info.currentSize + "KB";
    }
    return "";
  },

  clearCacheData: function() {
    wx.clearStorageSync();
    this.saveUserInfo(cache.userInfo);

    for (let key in cache) {
      if (key === 'isLogin'|| key === 'userInfo') {
        continue;
      }
      delete cache[key];
    }
  },

  saveTempData: function(key, data) {
    cache[key] = data;
  },

  getTempData: function(key) {
    const value = cache[key];
    delete cache[key];
    return value;
  },

};


module.exports = {Cache};