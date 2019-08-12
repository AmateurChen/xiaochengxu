import { Cache } from '../../utils/Cache.js'
import { Toast } from '../../utils/Toast.js'
import { Select } from '../../utils/Select.js'

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
      this.setData({ errMsg: "参数传递错误(0x000001)" });
      return;
    }

    const paramter = JSON.parse(options.data);
    if (!paramter) {
      this.setData({ errMsg: "参数传递错误(0x000002)" });
    } else if (!paramter.dataInfo) {
      this.setData({ errMsg: "参数传递错误(0x000003)" });
    } else {
      const Data = paramter.dataInfo;
      if (Data.dataType !== 'consumption') {
        this.setData({ errMsg: "参数传递错误(0x000004) :" + Data.dataType });
        return;
      }
      this.action = paramter.action;
      this.setData({ Data: Data, title: Data.dataName });
    }
  },

  onItemTouchStart: function (e) {
    this.itemTouchStartTime = e.timeStamp;
  },

  onItemTouchEnd: function (e) {
    this.itemTouchEndTime = e.timeStamp;
  },

  onLongClickItem: function (e) {
    const index = e.currentTarget.dataset.index;
    const Data = this.data.Data;
    const sysInfo = wx.getSystemInfoSync();
    const arrays = ["修改", "添加", "删除"];
    if ('android' === sysInfo.platform) {
      arrays.push("取消");
    }

    Select.show(arrays, res => {
      if (res.code !== '0') {
        return;
      }
      if (res.data === 0) {
        this.setData({ optionsItem: { type: 'update', material: Data.materials[index]} });
      } else if (res.data === 1) {
        this.setData({ optionsItem: { type: "new", material: {}, index: index } });
      } else if (res.data === 2) {
        wx.showModal({
          title: '提示',
          content: '确认删除？',
          success: res => {
            if (res.confirm) {
              Data.materials.splice(index, 1);
              this.setData({ Data: Data });
            }
          }
        });
      }
    });
  },

  onPreview: function(e) {
    const Data = this.data.Data;
    if (Data.materials.length < 1) {
      Toast.showToast("没有数据，无法进行预览！");
      return;
    }
    Data.dataName = e.detail.title;
    const action = 'update' === this.action ? 'submit' : this.action;
    const key =  Data._id || "consumption";
    Cache.saveTempData(key, Data);
    wx.navigateTo({
      url: '../qrcodePreview/qrcodePreview?data=' + JSON.stringify({ action: action, cacheKey: key })
    });
  },

  onModalInput: function (e) {
    const dataset = e.currentTarget.dataset;
    const optionsItem = this.data.optionsItem;
    optionsItem.material[dataset.field] = e.detail.value;
    this.setData({ optionsItem: optionsItem});
  },

  onModalCancel: function(e) {
    this.setData({ optionsItem: null});
  },

  onModalConfirm: function(e) {
    const optionsItem = this.data.optionsItem;
    const material = optionsItem.material;
    if (!material.materialName || !material.consumeCount || !material.unitPrice) {
        Toast.showToast("请录入完整信息！");
        return ;
    }

    const Data = this.data.Data;
    if (optionsItem.type === 'new') {
      Data.materials.push(material);
    } else if (optionsItem.type === 'update') {
      Data.materials[optionsItem] = material;
    }
    this.setData({ optionsItem: null, Data: Data });
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