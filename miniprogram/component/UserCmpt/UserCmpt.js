// component/User/UserCmpt.js
import { Toast } from '../../utils/Toast.js';
import { Utils } from '../../utils/Utils.js';
import { Cache } from '../../utils/Cache.js';
import { LoginApi } from '../../api/LoginApi.js';

const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userIcon: {
      type: String,
      value: '../../images/icons/user-unlogin.png'
    },
    userName: {
      type: String,
      value: '点击头像登录'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isLogin: false,
  },

  attached: function() {
    if (!Cache.isLogin()) {
      return ;
    }
    const user = Cache.getUserInfo();
    if (user) {
      this.setData({
        isLogin: Cache.isLogin(),
        userName: user.baseInfo.nickName,
        userIcon: user.baseInfo.avatarUrl
      });
    }
  }, 


  /**
   * 组件的方法列表
   */
  methods: {
    onRefresh: function(user) {
      if (user) {
        this.setData({
          isLogin: Cache.isLogin(),
          userName: user.baseInfo.nickName,
          userIcon: user.baseInfo.avatarUrl
        });
      }
    },
    onClickAuthor: function(e) {
      if (!e.detail.userInfo) { // 点击授权登录，被拒绝
        return;
      }
      // 已经登录过，则不再进行授权登录
      if (Cache.isLogin()) {
        return ;
      }
      
      Toast.showLoadding("Loadding...");
      LoginApi.login(result => {
        Toast.gone();
        if (Utils.isSuccess(result)) {
          this.triggerEvent('onRefresh');
          return ;
        }
        Toast.showNotice("登录失败：" + result.errMsg);
      });
      
    }
  }
})
