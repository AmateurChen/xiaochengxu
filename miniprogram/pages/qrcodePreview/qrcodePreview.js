import { Utils} from '../../utils/Utils.js';
import { Select } from '../../utils/Select.js';
import { Cache } from '../../utils/Cache.js';
import { QrcodeTools } from '../../utils/qrcode.js';
import { Toast } from '../../utils/Toast.js';
import { QrcodeApi } from '../../api/QrcodeApi.js';
import { PermissionApi } from '../../api/PermissionApi.js';

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
      
      // const Template = require('../../template/ConsumptionData.js');
      const Template = require('../../template/StructureData.js');
      // const Template = require('../../template/MasonryData.js');
      // const Template = require('../../template/TechnicalData.js');
      // const Template = require('../../template/EquipmentData.js');
      this.setData({ action: "new", Data: Template.Data});
      // wx.navigateTo({ url: '../home/home' });
      
      return ;
    }

    const Data = JSON.parse(options.data);
    if (Data.cacheKey) {
      const data = Cache.getTempData(Data.cacheKey);
      this.setData({ action: Data.action || null, Data: data });
      return ;
    }

    if (Data.action === 'update' || Data.action === 'preview') {
      if (!PermissionApi.isPermission(Cache.getUserInfo())) {
        Data.action = 'preview';
      }
      this._query(Data.action, Data.dataInfo);
      return ;
    }
    this.setData({ action: Data.action, Data: Data.dataInfo });
  },


  onModalConfirm: function(e) {
    wx.navigateTo({ url: '../home/home' });
  },


  onActoinBtn: function(e) {
    const action = this.data.action;
    console.log("preview action=======> " + action);
    if (action === 'new') {
      this._applyQrcode();
      // this._insterQrcode();
    } else if (action === 'update') {
      this._updateQrcode();
    } else if (action === 'submit') {
      this._submit();
    }

    // const Data = this.data.Data;
    // Data._id = "3094239048932849sdkfjakfjlkad";
    // this.setData({ showQrcode: true });
    // const qrcode = { type: Data.dataType, _id: Data._id };
    // const qrcodeStr = JSON.stringify(qrcode);
    // this._makeQrcode('mycanvas', qrcodeStr, 450);
  },

  _query: function (action, data) {
    Toast.showLoadding('Loadding...');
    QrcodeApi.query(data, res => {
      Toast.gone();
      if (Utils.isSuccess(res)) {
        if (res.data.length === 0) {
          Toast.showNotice("查无此数据信息");
          return ;
        }
        Cache.saveQrcodeRecords(res.data);
        this.setData({ action: action, Data: res.data});
        return ;
      }
      Toast.showNotice(res.errMsg);
    });
  },

  _submit: function() {
    Toast.showLoadding("Loadding...");
    QrcodeApi.update(this.data.Data, res => {
      Toast.gone();
      if (Utils.isSuccess(res)) {
        wx.showModal({
          title: '',
          showCancel: false,
          content: "修改成功！",
          success: res => {
            if (res.confirm) {
              wx.navigateTo({ url: '../home/home' });
            }
          }
        });
        
      }
      Toast.showNotice(res.errMsg);
    });
  },

  _updateQrcode: function() {
    const Data = this.data.Data;
    const DATA = {action: 'update', dataInfo: Data};
    if (Data.dataType === 'measure') {
      wx.navigateTo({
        url: '../qrcodeMeasure/qrcodeMeasure?data=' + JSON.stringify(DATA),
      });
    } else if (Data.dataType === 'technical') {
      wx.navigateTo({
        url: '../qrcodeTechnical/qrcodeTechnical?data=' + JSON.stringify(DATA),
      });
    } else if (Data.dataType === 'consumption') {
      wx.navigateTo({
        url: '../qrcodeConsumption/qrcodeConsumption?data=' + JSON.stringify(DATA),
      });
    }
  },

  _applyQrcode: function() {
    Toast.showLoadding("Loadding...");
    const Data = this.data.Data;

    QrcodeApi.apply(Data, res => {
      Toast.gone();

      if (Utils.isSuccess(res)) {
        const qrcodeData = 'data:image/jpeg;base64,' + res.data;
        this.setData({ showQrcode: true, qrcodeStr: qrcodeData });
        return;
      }

      Toast.showNotice(res.errMsg);
    });
  },

  _insterQrcode: function() {
    Toast.showLoadding("Loadding...");
    const Data = this.data.Data;

    QrcodeApi.inster(Data, res => {
      Toast.gone();
      if (Utils.isSuccess(res)) {
        this.setData({showQrcode: true});
        const qrcode = {type: res.data.dataType, _id: res.data._id};
        const qrcodeStr = JSON.stringify(qrcode);
        this._makeQrcode('mycanvas', qrcodeStr, 450);
        return;
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
    setTimeout(function() {
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

  onClickPreview:function(e) {
    wx.previewImage({
      current: this.data.qrcodeStr,
      urls: [this.data.qrcodeStr],
    });
  },

  onSaveQrcode: function() {
    const that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      height: 430,
      success(res) {
        const url = res.tempFilePath.replace("http:", "https:");
        console.log(url);
        that.setData({
          qrcodeStr: url
        });
      },
      fail: err => {
        console.log(err);
      }
    }, this);
  },

  convert_length: function (size) {
    return Math.round(wx.getSystemInfoSync().windowWidth * size / 750);
  },



  onShareAppMessage: function(obj) {
    if (obj.from === 'button') {
      return {
        title: '自定义转发标题',
        imageUrl: this.data.qrcodeSrc
      }
    }
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
    if (this.data.qrcodeStr) {
      wx.reLaunch({
        url: '../home/home'
      });
    }
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