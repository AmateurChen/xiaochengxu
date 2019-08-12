
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onMeasureStructure: function(e) {
    const DATA = { action: "new", dataInfo: require('../../template/StructureData.js').Data};
    wx.navigateTo({
      url: '../qrcodeMeasure/qrcodeMeasure?data=' + JSON.stringify(DATA),
    });
  },

  onMeasurePlaster: function(e) {
    const DATA = { action: "new", dataInfo: require('../../template/PlasterData.js').Data };
    wx.navigateTo({
      url: '../qrcodeMeasure/qrcodeMeasure?data=' + JSON.stringify(DATA),
    });
  },

  onMeasureMasonry: function(e) {
    const DATA = { action: "new", dataInfo: require('../../template/MasonryData.js').Data };
    wx.navigateTo({
      url: '../qrcodeMeasure/qrcodeMeasure?data=' + JSON.stringify(DATA),
    });
  },

  onToTechnical: function(e) {
    const DATA = { action: "new", dataInfo: require('../../template/TechnicalData.js').Data };
    wx.navigateTo({
      url: '../qrcodeTechnical/qrcodeTechnical?data=' + JSON.stringify(DATA),
    });
  },

  onConsumption: function(e) {
    const DATA = { action: "new", dataInfo: require('../../template/ConsumptionData.js').Data };
    wx.navigateTo({
      url: '../qrcodeConsumption/qrcodeConsumption?data=' + JSON.stringify(DATA),
    });
  },

  onEquipment: function(e) {
    const DATA = { action: "new", dataInfo: require('../../template/EquipmentData.js').Data };
    wx.navigateTo({
      url: '../qrcodeEquipment/qrcodeEquipment?data=' + JSON.stringify(DATA),
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})