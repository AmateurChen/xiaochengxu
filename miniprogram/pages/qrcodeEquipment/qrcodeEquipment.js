import { Toast } from '../../utils/Toast.js'
import { Select } from '../../utils/Select.js'
import { Utils } from '../../utils/Utils.js'
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
      if (Data.dataType !== 'equipment') {
        this.setData({ errMsg: "参数传递错误(0x000004) :" + Data.dataType });
        return;
      }
      this.action = paramter.action;
      this.setData({ Data: Data, title: Data.dataName });
    }
  },

  onPreview: function(e, v) {
    const title = e.detail.title;
    if (Utils.isEmpty(title)) {
      Toast.showToast("请输入标题！");
      return ;
    }
    const Data = this.data.Data;
    Data.dataName = title;
    const action = 'update' === this.action ? 'submit' : this.action;
    const key = Data._id || "equipment";
    Cache.saveTempData(key, Data);
    wx.navigateTo({
      url: '../qrcodePreview/qrcodePreview?data=' + JSON.stringify({ action: action, cacheKey: key })
    });
  },


  onAddData: function() {
    this.setData({ optionsItem: {}});
  },

  onClickItem: function(e) {
    if (this.itemTouchEndTime - this.itemTouchStartTime >= 300) {
      return;
    }
    const index = e.currentTarget.dataset.index;
    const Data = this.data.Data;
    Data.datas[index].show = !Data.datas[index].show;
    this.setData({Data: Data});
  },

  onLongClickItem: function(e) {
    const index = e.currentTarget.dataset.index;
    const arrays = ["新增", "修改", "删除"];
    if ('android' === wx.getSystemInfoSync().platform) {
      arrays.push("取消");
    }
    Select.show(arrays, res => {
      if (res.code !== '0') {
        return;
      }

      if (res.data === 0) {
        this.onAddData();
      } else if (res.data === 1) {
        const Data = this.data.Data;
        Data.datas[index].index = index;
        this.setData({optionsItem: Data.datas[index]});
      } else if (res.data === 2) {
        const Data = this.data.Data;
        wx.showModal({
          title: '提示',
          content: '确认删除？',
          success: res => {
            if (res.confirm) {
              Data.datas.splice(index, 1);
              this.setData({ Data: Data });
            }
          }
        });
      }
    });
  },


  onModalInput: function(e) {
    const item = this.data.optionsItem;
    const field = e.currentTarget.dataset.field;
    item[field] = e.detail.value;
    this.setData({optionsItem: item});
  },

  onModalCancel: function() {
    this.setData({ optionsItem: null});
  },

  onModalConfirm: function() {
    const item = this.data.optionsItem;
    if (!item.date) {
      Toast.showToast("巡检日期不能为空");
      return ;
    }

    if (!item.inspector) {
      Toast.showToast("巡检人不能为空");
      return;
    }

    const Data = this.data.Data;
    const index = item.index;
    if (Data.datas.length === 0 || index === undefined) {
      Data.datas.unshift(this.data.optionsItem);
    } else {
      delete item.index;
      Data.datas[index] = item;
    }

    this.setData({ optionsItem: null, Data: Data });
  },


  onItemTouchStart: function (e) {
    this.itemTouchStartTime = e.timeStamp;
  },

  onItemTouchEnd: function (e) {
    this.itemTouchEndTime = e.timeStamp;
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