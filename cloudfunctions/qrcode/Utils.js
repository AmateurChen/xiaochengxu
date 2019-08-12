const Utils = {

  isOk: source => {
    return source.errMsg.indexOf("ok") != -1;
  },

  fail: str => {
    return { code: "1", errMsg: str };
  },

  fialCode: str => {
    return { code: "2", errMsg: str };
  },

  success: data => {
    return { code: "0", data: data };
  },

  successStr: str => {
    return { code: "0", data: str };
  },

  isSuccess: obj => {
    return obj && obj.code === "0";
  },

  isFail: obj => {
    return obj && obj.code && obj.code !== "0";
  },

  formatNumber: n => {
    n = n.toString();
    return n[1] ? n : '0' + n;
  },

  formatDate: function (date) {
    // 当前是0时区，需要转换成8时区
    const utc = (date.getTimezoneOffset() * 60000) + date.getTime();
    date = new Date(utc + (3600000 * 8));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this.formatNumber).join(':');
  },



  isRoot: function (user) {
    // return true;
    return user && user.permission === 'root';
  },

  isManager: function (user) {
    return user && user.permission === '10'
  },

  isArrayEmpty: function (array) {
    return !array || array.length === 0;
  }

};

module.exports = { Utils };