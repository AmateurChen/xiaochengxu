// component/QrcodTemplateCmpt/QrcodTemplateCmpt.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ""
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
    onInput: function(e) {
      this.setData({ title: e.detail.value});
    },

    onPreview: function(e) {
      this.triggerEvent('onPreviewAction', { title: this.data.title}, {});
    }
  }
})
