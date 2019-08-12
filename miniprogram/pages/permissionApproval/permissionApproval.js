// pages/applyPermission/applyPermission.js
import { PermissionApi} from '../../api/PermissionApi.js';
import { UserApi } from '../../api/UserApi.js';
import { Toast } from '../../utils/Toast.js';
import { Utils } from '../../utils/Utils.js';
import { Select } from '../../utils/Select.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    skip: 0,
    limit: 20,
    data: { permissionList: []}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onMoreAction();
    // const list = [{ applyName: '张三', applyMobile: '15120040928'}];
    // this.setData({ data: { permissionList: list}});
  },



  onMoreAction: function() {
    Toast.showLoadding("Loadding...");
    const skip = this.data.skip;
    const limit = this.data.limit;
    UserApi.permissionList(skip, limit, res => {
      Toast.gone();
      if (Utils.isSuccess(res)) {
        console.log(res);

        const listData = this.data.data;
        if (res.data.length > 0) {
          res.data.map(function(value, index) {
            listData.permissionList.push(value);
          });
          const start = skip + res.data.length;
          this.setData({ skip: start, data: listData });
        }
        if (res.data.length < this.data.limit || res.data.length === 0) {
          this.setData({ goneMoreView: true });
        }
        return;
      }
      Toast.showToast("列表获取失败：" + res.errMsg);
    });
  },

  onLongAction: function(e) {
    const index = e.currentTarget.dataset.index;
    const dataInfo = this.data.data.permissionList[index];
    const arrays = ["删除"];
    if (dataInfo.permission === '0') {
      arrays.unshift("分配管理员");
    } else {
      arrays.unshift("收回权限");
    }
    const sysInfo = wx.getSystemInfoSync();
    if ('android' === sysInfo.platform) {
      arrays.push("取消");
    }

    Select.show(arrays, res => {
      if (res.code != 0) {
        return ;
      }
      if (res.data === 0) {
        const temp = {...dataInfo};
        if (arrays[0] === '收回权限') {
          temp.permission = "0";
        } else {
          temp.permission = '10';
        }
        this.onPermissionUpdate(temp, index, dataInfo.permission);
      } else if (res.data === 1) {
        wx.showModal({
          title: '提示',
          content: '确认删除？',
          success: res => {
            if (res.confirm) {
              const temp = { ...dataInfo };
              temp.permission = "";
              this.onPermissionUpdate(temp, index, dataInfo.permission);
            }
          }
        });
        
      }
    });
  },


  onPermissionUpdate: function(data, index, permission) {
    Toast.showLoadding("Loadding...");
    UserApi.permissionUpdate(data, res => {
      Toast.gone();
      if (Utils.isSuccess(res)) {
        if (Utils.isEmpty(data.permission)) {
          this.data.data.permissionList.splice(index, 1);
        } else {
          this.data.data.permissionList[index].permission = data.permission;
        }
        this.setData({data: this.data.data});
        return ;
      }
      Toast.showNotice("修改权限失败：" + res.errMsg);
      data.permission = permission;
    });
  },

  onInputApplyName: function(event) {
    this.setData({
      applyName: event.detail.value
    });
  },

  onInputApplyMobile: function(event) {
    this.setData({
      applyMobile: event.detail.value
    });
  },

  onInputApplyRemarks: function(evnet) {
    this.setData({
      remarks: event.detail.value
    });
  },

  onApplyPermission: function(event) {
    const applyName = this.data.applyName;
    const applyMobile = this.data.applyMobile;
    const remarks = this.data.remarks;

    if (Utils.isEmpty(applyName)) {
      Toast.showNotice("申请人姓名不能为空！");
      return ;
    }

    if (Utils.isEmpty(applyMobile)) {
      Toast.showNotice("申请人联系电话不能为空！");
      return;
    } else if (Utils.isMobile(applyMobile)) {
      Toast.showNotice("申请人联系电话格式错误！");
      return;
    }

    const data = {
      applyName: applyName,
      applyMobile: applyMobile,
      remarks: remarks
    };

    Toast.showLoadding("Loadding...");
    UesrApi.permissionApply(data, result => {
      Toast.gone();
      if (result.error) {
        Toast.showNotice("权限申请成功！");
        return ;
      }

      if (result.data) {
        Toast.showNotice("权限申请成功，等待管理员审批！");
      }

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