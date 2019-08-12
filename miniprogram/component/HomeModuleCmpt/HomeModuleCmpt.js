// component/HomeModule/HomeModuleCmpt.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon: {
      type: String,
      value: ''
    },
    iconText: {
      type: String,
      value: ''
    },

    isDisabled: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // icon: "../../images/icons/qrcode.png",
    // text: "扫描二维码",
    // onAction: () => {
    //   console.log("this is module click");
    // }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick: function (event) {
      // 方法回调
      this.triggerEvent('onClick');
    },
  },
  


})



