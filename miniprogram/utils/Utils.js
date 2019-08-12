

const Utils = {

  isEmpty: function (value) {
    if (!value) return true;

    return value.replace(/\s+/g, "").length === 0 ? true : false;
  },

  isMobile: function(value) {
    if (this.isEmpty(value)) {
      return false;
    }
    
    return /1\d{10}/.test(value);
  },

  isString: data => {
    return data instanceof String;
  },

  isOk: source => {
    return source.errMsg.indexOf("ok") != -1;
  },

  isFail: source => {
    return source.code !== "0" || source.errMsg
  },

  isSuccess: source => {
    return source && (source.code === "0" || source.data);
  },

  fail: str => {
    return { code: "1", errMsg: str };
  },

  success: data => {
    return { code: "0", data: data };
  },



};




module.exports = {Utils};