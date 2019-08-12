import { Toast } from '../../utils/Toast.js';
import { Cache } from '../../utils/Cache.js';
import { Utils } from '../../utils/Utils.js';
import { Select } from '../../utils/Select.js';
import { QrcodeApi } from '../../api/QrcodeApi.js';
import { QrcodeTools } from '../../utils/qrcode.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goneMoreView: false,
    skip: 0, 
    limit: 20,
    datas: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onMoreAction();
  },

  onItemTouchStart: function (e) {
    this.itemTouchStartTime = e.timeStamp;
  },

  onItemTouchEnd: function (e) {
    this.itemTouchEndTime = e.timeStamp;
  },

  onClickItem: function (e) {
    if (this.itemTouchEndTime - this.itemTouchStartTime >= 300) {
      return;
    }

    const index = e.currentTarget.dataset.index;
    const DATA = this.data.datas[index];
    Cache.saveTempData(DATA._id, DATA);
    wx.navigateTo({
      url: '../qrcodePreview/qrcodePreview?data=' + JSON.stringify({action: 'preview', cacheKey: DATA._id }),
    });

  },

  onItemLongClick: function(e) {
    const index = e.currentTarget.dataset.index;
    const arrays = ["显示二维码", "删除"];
    const sysInfo = wx.getSystemInfoSync();
    if ('android' === sysInfo.platform) {
      arrays.push("取消");
    }
    Select.show(arrays, res => {
      if (res.code != '0') {
        return ;
      }

      if (res.data === 0) {
        const data = this.data.datas[index];
        if (!data.qrcode) {
          this.setData({ showQrcode: true, qrcodeStr: null});
          const qrcodeStr = JSON.stringify({ type: data.dataType, _id: data._id });
          this._makeQrcode('mycanvas', qrcodeStr, 450);
        } else {
          const qrcodeData = 'data:image/jpeg;base64,' + data.qrcode
          this.setData({ showQrcode: true, qrcodeStr: qrcodeData });
        }

      } else if (res.data === 1) {
        wx.showModal({
          title: '提示',
          content: '确认删除？',
          success: res => {
            if (res.confirm) {
              this._deleteQrcode(index);
            }
          }
        });
      }
    });

  },

  onPreviewQrcode: function(e) {
    if (this.data.qrcodeStr.startsWith('data:image')) {
      wx.previewImage({
        current: this.data.qrcodeStr,
        urls: [this.data.qrcodeStr],
      })
      return ;
    }
    wx.getImageInfo({
      src: this.data.qrcodeStr,
      success: result => {
        wx.previewImage({
          current: result.path,
          urls: [result.path],
        })
      }
    });
  },

  onModalConfirm: function(e) {
    this.setData({ showQrcode: null});
  },
  

  onMoreAction: function() {
    Toast.showLoadding("Loadding...");
    QrcodeApi.queryList(this.data.skip, this.data.limit, res => {
      Toast.gone();
      if (Utils.isSuccess(res)) {
        const datas = this.data.datas;
        const length = datas.length;
        res.data.map((value, index) => {
          if (value.dataName) {
            
          }
          datas.push(value);
        });
        this.data.skip = datas.length;
        this.data.goneMoreView = length === datas.length || datas.length % this.data.limit !== 0;
        this.setData({ datas: datas, goneMoreView: this.data.goneMoreView, skip: this.data.skip});
        return;
      }
      Toast.showNotice(res.errMsg);
    }); 
  },

  _deleteQrcode: function(index) {
    Toast.showLoadding("Loadding...");
    QrcodeApi.del(this.data.datas[index], res => {
      Toast.gone();
      if (Utils.isSuccess(res)) {
        this.data.datas.splice(index, 1);
        this.setData({datas: this.data.datas});
        return ;
      }

      Toast.showNotice(res.errMsg);
    });
  },

  _makeQrcode: function (myCanvas, text, size) {

    QrcodeTools.draw(text, {
      ctx: wx.createCanvasContext(myCanvas),
      width: this.convert_length(size),
      height: this.convert_length(size)
    });

    const that = this;
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        fileType: 'jpg',
        quality: 1,
        success(res) {
          that.setData({ qrcodeStr: res.tempFilePath });
        },
        fail: err => {
          console.log(err);
        }
      }, this);
    }, 500);

  },
  convert_length: function (size) {
    return Math.round(wx.getSystemInfoSync().windowWidth * size / 750);
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