import { Utils } from '../../utils/Utils.js';
import { Toast } from '../../utils/Toast.js';
import { LoginApi } from '../../api/LoginApi.js';
import { Cache } from '../../utils/Cache.js';
import { PermissionApi } from '../../api/PermissionApi.js';
const app = getApp();

Page({

  /**
   * 页面的初始    
  data: {
    isLoadding: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Toast.showLoadding("Loadding...");
    LoginApi.login( result => {
      Toast.gone();
      this.setData({ isLoadding: true});
    });
  },

  onRefresh: function() {
    this.setData({ isLogin: Cache.isLogin() || false});
    const user = Cache.getUserInfo();
    this._refreshCmpt("#user", user);
    this._refreshCmpt("#module", user);
  },

  _refreshCmpt: function(cmptId, user) {
    const userCmpt = this.selectComponent(cmptId);
    if (userCmpt) {
      userCmpt.onRefresh(user);
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
    this.onRefresh();
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
    
  },
  onScanCode: function() {
    console.log("this is click  onScanCode fun");
    wx.scanCode({
      scanType: "qrCode",
      success(res) {
        if (res.errMsg === "scanCode:ok") {
          let data = JSON.parse(res.result);
          console.log(data);
          if (data.title && data.type && data.detail) {
            wx.navigateTo({
              url: '../qrcode/qrcode?data=' + JSON.stringify(data),
            })
          }
          
        }
      }
    })
  },

  onOpenQrcode: function(event) {
    wx.navigateTo({
      url: '../qrcode/qrcode',
    })
  },
  onDevToast: function(event) {
    Toast.showToast("该模块正在开发中...");
  }
})