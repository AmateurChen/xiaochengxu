import { NetApi} from './NetApi.js';



const PermissionApi = {

  getPermissionStr: function(permission) {
    if (!permission || permission === "") {
      return "点击申请权限";
    } else if (permission === "0") {
      return "已申请";
    } else if (permission === "1") {
      return "申请被拒绝";
    } else if (permission === "2") {
      return "申请通过";
    } else if (permission === "10") {
      return "管理员";
    } else if (permission === "root") {
      return "超级管理员";
    }
    return "";
  },

  isPermissionRoot: function(user) {
    return user && user.permission === "root";
  },

  isPermission: function (user) {
    if (!user) {
      return false;
    }
    return user.permission === "root" || user.permission === "10";
  },


  apply: function(data, callback) {
    this.action("apply", data, callback);
  },

  applyList: function (skip, limit, callback) {
    const data = { skip: skip, limit: limit };
    this.action("applyList", data, callback);
  },

  update: function(data, callback) {
    this.action("update", data, callback);
  },

  del: function(data, callback) {
    this.action("delete", data, callback);
  },

  action: (type, data, callback) => {
    const request = { actionType: type, data: data };
    NetApi.action("permission", request, callback);
  },

  // applyListAsync: (skip, limit) => {
  //   const data = {skip: skip, limit: limit};
  //   return this.actionAsync("list", data);
  // },

  // updateAsync: data => {
  //   return this.actionAsync("update", data);
  // },

  // applyAsync: data => {
  //   return this.actionAsync("apply", data);
  // },

  // actionAsync: async (type, data) => {
  //   const request = { actionType: type, data: data };
  //   return await NetApi.actionAsync("permisssion", request);
  // }

}


module.exports = {PermissionApi};