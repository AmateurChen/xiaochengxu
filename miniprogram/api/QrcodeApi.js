
import { NetApi } from './NetApi.js';
import { Utils } from '../utils/Utils.js';

const QrcodeApi = {

  apply: function(data, callback) {
    this.action("apply", data, callback);
  },

  inster: function (data, callback) {
    this.action("inster", data, callback);
  },

  query: function(data, callback) {
    if (!data._id) {
      callback(Utils.fail("参数错误！"));
      return ;
    }
    this.action("query", data, callback);
  },

  queryList: function (skip, limit, callback) {
    const data = { skip: skip, limit: limit };
    this.action("queryList", data, callback);
  },

  update: function(data, callback) {
    if (!data._id) {
      callback(Utils.fail("参数错误！"));
      return;
    }
    this.action("update", data, callback);
  },

  del: function(data, callback) {
    this.action("delete", data, callback);
  },

  action: function(type, data, callback) {
    const request = {actionType: type, data: data};
    NetApi.action("qrcode", request, callback);
  }



};


module.exports = {QrcodeApi};