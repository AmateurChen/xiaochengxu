// component/HomeCmpt/HomeCmpt.js
import { Toast } from '../../utils/Toast.js';
import {Cache} from '../../utils/Cache.js';
import { PermissionApi } from '../../api/PermissionApi.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    permission: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  attached: function () {
    if (!Cache.isLogin()) {
      return;
    }
    
    this.onRefresh(Cache.getUserInfo());
  }, 


  /**
   * 组件的方法列表
   */
  methods: {
    onRefresh: function(user) {
      if (user) {
        this.setData({
          isLogin: Cache.isLogin(),
          permission: PermissionApi.isPermission(user)
        });
      }
    },
    onScanCode: function () {
      console.log("this is click  onScanCode fun");
      wx.scanCode({
        scanType: "qrCode",
        success(res) {
          if (res.errMsg === "scanCode:ok") {
            const filter = "pages/index/index?scene=";
            if (res.path && res.path.startsWith(filter)) {
              wx.navigateTo({
                url: res.path.replace('pages', '..'),
              });
              return ;
            }

            let data = JSON.parse(res.result);
            if (data.type && data._id) {
              const Data = { action: 'update', dataInfo: data};
              wx.navigateTo({
                url: '../qrcodePreview/qrcodePreview?data=' + JSON.stringify(Data),
              })
            } else {
              wx.navigateTo({
                url: '../index/index?data=' + JSON.stringify(Data),
              });
            }

          }
        }
      })
    },

    onOpenQrcode: function (event) {
      wx.navigateTo({
        url: '../qrcodeTemplateList/qrcodeTemplateList',
      });
    },

    onQrcodeRecord: function (event) {
      wx.navigateTo({
        url: '../qrcodeRecord/qrcodeRecord',
      });
    },

    onPermissionApproval: function(e) {
      wx.navigateTo({
        url: '../permissionApproval/permissionApproval',
      });
    }, 

    onOther: function(e) {
      wx.navigateTo({
        url: '../user/user',
      });
    }
  }
})
