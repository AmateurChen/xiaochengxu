import { NetApi} from "./NetApi.js";
import { Utils } from "../utils/Utils.js";
import { Cache } from "../utils/Cache.js";

const app = getApp();

const UserApi = {

  getAuthorUserInfo: function(callback) {
    wx.getUserInfo({
      success: res => {
        callback(Utils.success({ baseInfo: res.userInfo }));
      },
      fail: err => {
        callback(Utils.fail(err.errMsg));
      }
    });
  },

  permissionApply: function(data, callback) {
    return this.action("permissionApply", data, callback);
  },

  permissionUpdate: function (data, callback) {
    return this.action("permissionUpdate", data, callback);
  },

  permissionList: function(skip, limit, callback) {
    const data = { skip: skip, limit: limit };
    return this.action("permissionList", data, callback);
  },

  query: function(data, callback) {
    return this.action("query", data, callback);
  },

  queryList: function(skip, limit, callback) {
    const data = { skip: skip, limit: limit };
    return this.action("queryList", data, callback);
  },

  update: function(data, callback) {
    return this.action("update", data, callback);
  },

  inster: function(data, callback) {
    return this.action("inster", data, callback);
  },

  del: function(data, callback) {
    return action("delete", data, callback);
  },

  action: function(type, data, callback) {
    const request = { actionType: type, data: data };
    return NetApi.action("user", request, callback);
  }
};

module.exports = {UserApi};