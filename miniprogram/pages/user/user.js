import {Toast} from '../../utils/Toast.js';
import { Utils } from '../../utils/Utils.js';
import { Cache } from '../../utils/Cache.js';
import { PermissionApi} from '../../api/PermissionApi.js';
import { UserApi } from '../../api/UserApi.js';
import { LoginApi } from '../../api/LoginApi.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    mobile: "",
    permissionInfo: "",
    cacheData: Cache.getCacheSize(),
    goneSaveView: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    const user = Cache.getUserInfo();
    if (!user) { // 未登录
      this.setData({isLogin: false});
      return ;
    }
    if (!user.otherInfo) {
      user.otherInfo = {};
    }
    this.setData({
      isLogin: Cache.isLogin(),
      name: user.otherInfo.name || "", 
      mobile: user.otherInfo.mobile || "",
      permissionInfo: PermissionApi.getPermissionStr(user.permission),
      showQrcodeItem: PermissionApi.isPermissionRoot(user)
    });
   
  },

  onInputName: function(e) {
    this.setData({ name: e.detail.value, goneSaveView: false});
  },

  onInputMobile: function(e) {
    this.setData({ mobile: e.detail.value, goneSaveView: false});
  },

  onSaveInput: function(e) {
    const user = Cache.getUserInfo();
    if (!user.otherInfo) {
      user.otherInfo = {};
    }
    const check = this._checkInput();
    if (!check) {
      return ;
    }
    if (user.otherInfo.name === check.name && user.otherInfo.mobile === check.mobile) {
      Cache.saveUserInfo(user);
      Toast.showToast("保存成功！");
      this.setData({ goneSaveView: true });
      return ;
    }
    user.otherInfo.name = check.name;
    user.otherInfo.mobile = check.mobile;
    Toast.showLoadding("Loadding...");
    UserApi.update(user, res => {
      Toast.gone();
      if (Utils.isSuccess(res)) {
        Cache.saveUserInfo(user);
        Toast.showToast("保存成功！");
        this.setData({ goneSaveView: true });
        return ;
      }
      Toast.showNotice("修改失败：" + res.errMsg);
    });
  },
 
  onUpdateCheck: function(e) {
    if (!wx.canIUse('getUpdateManager')) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      });
      return ;
    }

    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      if (!res.hasUpdate) {
        Toast.showToast("已经是最新版本！");
        return ;
      }
      Toast.showLoadding("更新版本中...");
      // 请求完新版本信息的回调
      updateManager.onUpdateReady(function () {
        Toast.gone();
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            console.log('success====', res)
            // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: '已经有新版本了哟~',
          content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
        })
      })
    });


  },

  onPermission: function(e) {
    const user = Cache.getUserInfo();
    if (!user) {
      Toast.showToast("请先登录")
      return ;
    }

    if (PermissionApi.isPermissionRoot(user)) {
      wx.navigateTo({
        url: '../permissionApproval/permissionApproval',
      });
      return;
    }

    if (!Utils.isEmpty(user.permission)) {
      // 已经申请，进行状态刷新
      this._permissionSync(user);
      return ;
    }

    if (!this._checkInput()) {
      return;
    }

    if (!this.data.goneSaveView) {
      Toast.showToast("请先保存信息！");
      return;
    }
    this._permissionApply(user);

  },


  onRecord: function(e) {
    wx.navigateTo({
      url: '../qrcodeRecord/qrcodeRecord',
    });
  },

  onToQrcodeList: function(e) {
    wx.navigateTo({
      url: '../qrcodeList/qrcodeList',
    });
  },


  onClearData: function(e) {
    Cache.clearCacheData();
    Toast.showToast("清理完成！");
    this.setData({ cacheData: ""});
  },

  onLogin: function(e) {
    if (!e.detail.userInfo) { // 点击授权登录，被拒绝
      return;
    }
    Toast.showLoadding("Loadding...");
    LoginApi.login(result => {
      Toast.gone();
      if (Utils.isSuccess(result)) {
        this.onLoad();
        return;
      }
      Toast.showNotice("登录失败：" + result.errMsg);
    });
  },

  _permissionApply: function(user) {
    Toast.showLoadding("Loadding...");
    const request = { applyName: user.otherInfo.name, applyMobile: user.otherInfo.mobile };

    UserApi.permissionApply(user, res => {
      Toast.gone();
      if (Utils.isSuccess(res)) {
        Toast.showNotice("申请成功！");
        user.permission = res.data.permission;
        Cache.saveUserInfo(user);
        this.setData({ permissionInfo: PermissionApi.getPermissionStr(res.data.permission) });
        return;
      }
      Toast.showToast("申请失败：" + res.errMsg);
    });
  },

  _permissionSync: function(user) {
    Toast.showLoadding("Loadding...");
    UserApi.query(user, res => {
      Toast.gone();
      if (Utils.isSuccess(res)) {
        Toast.showNotice("同步权限完成！");
        user.permission = res.data.permission;
        Cache.saveUserInfo(user);
        this.setData({ 
          permissionInfo: PermissionApi.getPermissionStr(user.permission),
          showQrcodeItem: PermissionApi.isPermissionRoot(user)
        });
        return;
      }
      Toast.showToast("同步权限失败：" + res.errMsg);
    });
  },

  _checkInput: function() {
    const name = this.data.name;
    const mobile = this.data.mobile;
    if (Utils.isEmpty(name)) {
      Toast.showToast("请输入姓名信息")
      return undefined;
    }
    if (!Utils.isMobile(mobile)) {
      Toast.showToast("请输入联系电话信息")
      return undefined;
    }
    return {name: name, mobile: mobile};
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