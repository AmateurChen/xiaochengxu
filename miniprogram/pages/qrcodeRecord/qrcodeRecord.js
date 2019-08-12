import { Select } from '../../utils/Select.js';
import { Cache } from '../../utils/Cache.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const arrays = Cache.getQrcodeRecords();
    this.setData({ datas: arrays});
  },

  onItemTouchStart: function (e) {
    this.itemTouchStartTime = e.timeStamp;
  },

  onItemTouchEnd: function (e) {
    this.itemTouchEndTime = e.timeStamp;
  },

  onLongAction: function(e) {
    const index = e.currentTarget.dataset.index;
    const arrays = ["删除"];
    const sysInfo = wx.getSystemInfoSync();
    if ('android' === sysInfo.platform) {
      arrays.push("取消");
    }

    Select.show(arrays, res => {
      if (res.code !== '0') {
        return;
      }

      if (res.data === 0) {
        wx.showModal({
          title: '提示',
          content: '确认删除？',
          success: res => {
            if (res.confirm) {
              const datas = this.data.datas;
              datas.splice(index, 1);
              Cache.saveQrcodeRecords(datas);
              this.setData({ datas: datas });
            }
          }
        });
        
      }
    });
  },

  onToPreview: function(e) {
    if (this.itemTouchEndTime - this.itemTouchStartTime >= 300) {
      return;
    }

    const index = e.currentTarget.dataset.index;
    const data = this.data.datas[index];
    Cache.saveTempData(data._id, data);
    const request = { action: 'preview', cacheKey: data._id };
    wx.navigateTo({
      url: '../qrcodePreview/qrcodePreview?data=' + JSON.stringify(request),
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