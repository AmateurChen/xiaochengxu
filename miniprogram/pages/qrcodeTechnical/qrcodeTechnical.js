import { Utils } from '../../utils/Utils.js';
import { Toast } from '../../utils/Toast.js';
import { Cache } from '../../utils/Cache.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.data) {
      return ; 
    }
    const DATA = JSON.parse(options.data);
    this.action = DATA.action;
    // const Template = require('../../template/TechnicalData.js');
    const discloseDetail = DATA.dataInfo.data.discloseDetail;
    const title = DATA.dataInfo.dataName || "";
    this.setData({ Data: DATA.dataInfo, discloseDetail: discloseDetail, title: title});
  },



  onInputValue: function(e) {
    const Data = this.data.Data;
    const dataset = e.currentTarget.dataset;
    if (dataset.field) {
      Data[dataset.field] = e.detail.value;
    } else if (dataset.fieldChild) {
      Data.data[dataset.fieldChild] = e.detail.value;
    }
    this.setData({Data: Data});
  },

  onInputDetail: function(e) {
    const Data = this.data.Data;
    const detail = e.detail.value;
    Data.data.discloseDetail = detail;
    this.setData({ discloseDetail: detail});
  },

  onPreview: function(e) {
    const Data = this.data.Data;
    Data.dataName = e.detail.title;
    if (Utils.isEmpty(Data.dataName)) {
      Toast.showToast("请输入模板名称！");
      return ;
    }
    Data.data.discloseDetail = this.data.discloseDetail;
    const action = 'update' === this.action ? 'submit' : this.action;
    const key = Data._id || "technical";
    Cache.saveTempData(key, Data);
    wx.navigateTo({
      url: '../qrcodePreview/qrcodePreview?data=' + JSON.stringify({ action: action, cacheKey: key })
    });
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