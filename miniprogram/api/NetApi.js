import {Utils} from "../utils/Utils.js";


const NetApi = {
  actionAsync: (funName, data) => {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({ name: funName, data: data })
        .then(res => {
          if (Utils.isOk(res)) {
            resolve(res.result);
            return ;
          }

          console.log("网络请求失败：" + JSON.stringify(res));
          resolve(Utils.fail("网络连接失败：0x9000002"));
          
        })
        .catch(err => {
          console.log("网络请求失败：" + JSON.stringify(err));
          resolve(Utils.fail("网络连接失败：0x9000001"));
        });
    });
  },

  action: (funName, data, callback) => {
    const request = {
      name: funName,
      data: data,
      success: res => {
        if (Utils.isOk(res)) {
          callback(res.result);
          return ;
        }
        console.log("网络请求失败：" + JSON.stringify(res));
        callback(Utils.fail("网络连接失败：0x9000002"));
      },
      fail: err => {
        console.log("网络请求失败：" + JSON.stringify(err));
        if (err.errCode === -404011) { // 网络超时
          callback(Utils.fail("网络连接失败：0x9000003"));
          return ;
        }
        callback(Utils.fail("网络连接失败：0x9000001"));
      },
    };

    wx.cloud.callFunction(request);
  }

};


module.exports = {NetApi};