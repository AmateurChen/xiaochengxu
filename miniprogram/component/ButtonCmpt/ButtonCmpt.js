// component/ButtonCmpt/ButtonCmpt.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: "按钮"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick: function(e) {
      this.triggerEvent("onClick");
    }
  }
})
