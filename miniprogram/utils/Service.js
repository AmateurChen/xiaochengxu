const Service = {

  login: function(data, callback) {
    this.action('user', { actionType: 'login', data: data}, callback);
  },

  queryUserInfo: function(openid, callback) {
    this.action('queryUser', openid, callback);
  },

  action: (funName, data, callback) => {
    wx.cloud.callFunction({
      name: funName,
      data: data,
      success: res => {
        if (res.errMsg !== 'cloud.callFunction:ok') {
          callback({ error: res.errMsg });
          return ;
        }
        if (res.result.error) {
          callback({ error: res.result.error });
          return ;
        }
        callback({data: { ...res.result.data}});
      },
      fail: err => {
        callback({error: err.errMsg});
      }
    });
  }

}

module.exports = { Service};