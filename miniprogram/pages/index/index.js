

Page({
  data: {
  },

  onLoad: function(options) {
    const data = options.data || options.scene;
    if (data) {
      wx.redirectTo({
        url: '../qrcodePreview/qrcodePreview?data=' + JSON.stringify({ action: 'update', dataInfo: { _id: data}})
      });
      return ;
    }
    this.setData({data: data});
  },

  

})
