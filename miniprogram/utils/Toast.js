const Toast = {
  showToast: text => {
    let msg = { icon: 'none', title: text };
    wx.showToast(msg);
  },

  showNotice: (text, success) => {
    wx.showModal({
      title: '',
      showCancel: false,
      content: text || "",
      success: success
    });
  },

 showLoadding: text => {
   wx.showLoading({
     title: text || ""
   });
 },

 gone: ()=> {
   wx.hideLoading();
   wx.hideToast();
 }
};

module.exports = { Toast };