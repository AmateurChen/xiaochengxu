import { Utils } from './Utils.js';
const Select = {

  show: function(data, success) {
    
    wx.showActionSheet({
      itemList: data,
      success: function (res) { 
        success(Utils.success(res.tapIndex));
      },
      fail: function (res) {
        console.log(res);
       }
    });
  }

  

};



module.exports = {Select};