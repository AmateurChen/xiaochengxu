const rp = require('request-promise');

const AppId = "wxb3ee8663a2d0a885";
const AppSecret = "eac288515f968b60b4a13075c16b1810";
const TokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxb3ee8663a2d0a885&secret=eac288515f968b60b4a13075c16b1810";

const Tools = {

  apply: async function(data) {
    const token = await this._getToken();
    console.log(token);
    const obj = {
      method: "POST",
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + token.access_token,
      body: {
        page: 'pages/index/index',
        width: 430,
        ...data
      },
      json: true
    };
    return await rp(obj);
  },


  _getToken: async function() {
    const obj = {
      method: "GET",
      url: TokenUrl
    };

    return await rp(obj);
  },


  qrcode: async function(cloud, data) {
    try {
      const result = await cloud.openapi.wxacode.getUnlimited(data);
      if (result.errmsg === 'ok') {
        return Result.success(result.buffer);
      }
    } catch(e) {
      return Result.fail(e);
    }
  },

  httpPost: async function (url, data) {
    return await this.httpAction(url, "POST", data);
  },

  httpGet: async function(url, data) {
    return await this.httpAction(url, "GET", data);
  },

  httpAction: async function(url, method, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        method: method,
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          resolve(Result.success(res));
        },
        fail: function(res) {
          resolve(Result.fail(res.errMsg));
        },
      })
    });
    
    const request = {
      method: "GET",
      url: TokenUrl,
      json: true
    };
    return await rp(request);
  }

};


module.exports = { Tools };