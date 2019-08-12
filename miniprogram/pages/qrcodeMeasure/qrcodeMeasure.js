import {Select} from '../../utils/Select.js';
import { Toast } from '../../utils/Toast.js';
import { Cache } from '../../utils/Cache.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Data: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.data) {
      this.setData({ errMsg: "参数传递错误(0x000001)" });
      return ;
    }

    const paramter = JSON.parse(options.data);
    if (!paramter) {
      this.setData({ errMsg: "参数传递错误(0x000002)" });
    } else if (!paramter.dataInfo) {
      this.setData({ errMsg: "参数传递错误(0x000003)" });
    } else {
      const Data = paramter.dataInfo;
      if (Data.dataType !== 'measure') {
        this.setData({ errMsg: "参数传递错误(0x000004) :" + Data.tbType });
        return ;
      }
      this.action = paramter.action;
      this.setData({ Data: Data, title: Data.dataName });
    }
  },

  onClickItem: function(e) {
    if (this.itemTouchEndTime - this.itemTouchStartTime >= 300) {
      return ;
    }
    const index = e.currentTarget.dataset.index;
    const Data = this.data.Data;
    Data.testInfo.map((item, i) => {
      if (index != i) {
        item.isShow = false;
      }
    });

    const item = Data.testInfo[index];
    item.isShow = item.isShow ? !item.isShow : true;
    this.setData({ Data: Data, isShowTster: false});
  },

  onItemTouchStart: function(e) {
    this.itemTouchStartTime = e.timeStamp;
  },

  onItemTouchEnd: function(e) {
    this.itemTouchEndTime = e.timeStamp;
  },

  onLongClickItem: function(e) {
    const index = e.currentTarget.dataset.index;
    const Data = this.data.Data;
    const sysInfo = wx.getSystemInfoSync();
    const arrays = ["重命名", "删除", "添加"];
    if ('android' === sysInfo.platform) {
      arrays.push("取消");
    }
    
    Select.show(arrays, res => {
      if (res.code !== '0') {
        return ;
      }
      if (res.data === 0) {
        this.setData({ optionsItem: { type: "update", testName: Data.testInfo[index].testName, index: index}});
      } else if (res.data === 1) {
        wx.showModal({
          title: '提示',
          content: '确认删除？',
          success: res => {
            if (res.confirm) {
              Data.testInfo.splice(index, 1);
              this.setData({ Data: Data });
            }
          }
        });
      } else if (res.data === 2) {
        this.setData({ optionsItem: { type: "new", index: index } });
      } 
    });
  },

  onLongClickTester: function(e) {
    const Data = this.data.Data;
    const sysInfo = wx.getSystemInfoSync();
    const arrays = ["添加"];
    if ('android' === sysInfo.platform) {
      arrays.push("取消");
    }

    Select.show(arrays, res => {
      if (res.code !== '0') {
        return;
      }
      if (res.data === 0) {
        this.setData({ optionsItem: { type: "new", index: -1 } });
      }
    });
  },

  onClickTester: function(e) {
    const Data = this.data.Data;
    if (Data.testInfo) {
      Data.testInfo.map((item, i) => {
        item.isShow = false;
      });
    }
    this.setData({
      Data: Data,
      isShowTster: !this.data.isShowTster
    });
  },

  onModalConfirm: function() {
    const item = this.data.optionsItem;
    const Data = this.data.Data;

    if (item.type === 'update') {
      Data.testInfo[item.index].testName = item.testName;
    } else if (item.type === 'new') {
      const newItem = { testName: item.testName, testItems: [{ standard: "", company: "", pejectName: "", technicalSector: "" }]};
      if (!Data.testInfo) {
        Data.testInfo = [];
      }
      Data.testInfo.splice(item.index, 1, newItem);
    }

    this.setData({ optionsItem: null, Data: Data });
  },

  onModalCancel: function() {
    this.setData({ optionsItem: null});
  },

  onModalInput: function(e) {
    const item = this.data.optionsItem;
    item.testName = e.detail.value;
    this.setData({ optionsItem: item});
  },

  onDeleteChildItem: function(e) {
    const dataset = e.currentTarget.dataset;
    const Data = this.data.Data;
    const item = Data.testInfo[dataset.parentIndex];
    if (item.testItems.length <= 1) {
      Toast.showToast("删除失败，请至少保留一条数据！");
      return ;
    }
    const child = item.testItems[dataset.index];
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: res => {
        if (res.confirm) {
          item.testItems.splice(dataset.index, 1);
          this.setData({ Data: Data });
        }
      }
    });
  },

  onAddChildItem: function(e) {
    const dataset = e.currentTarget.dataset;
    const Data = this.data.Data;
    const item = Data.testInfo[dataset.parentIndex];
    item.testItems.push({ standard: "", company: "", pejectName: "", technicalSector: ""})
    this.setData({ Data: Data });
  },


  onInputItemInfo: function(e) {
    const dataset = e.currentTarget.dataset;
    const Data = this.data.Data;
    const item = Data.testInfo[dataset.parentIndex];
    const child = item.testItems[dataset.index];
    child[dataset.field] = e.detail.value;
    this.setData({Data: Data});
  },

  onInputTester: function(e) {
    const dataset = e.currentTarget.dataset;
    const Data = this.data.Data;
    Data[dataset.field].value = e.detail.value;
    this.setData({ Data: Data});
  },

  onPreview: function(e) {
    const Data = this.data.Data;
    if (Data.testInfo.length < 1) {
      Toast.showToast("没有数据，无法进行预览！");
      return ;
    }
    Data.dataName = e.detail.title;
    const action = 'update' === this.action ? 'submit' : this.action;
    const key = Data._id || "measure";
    Cache.saveTempData(key, Data);
    wx.navigateTo({
      url: '../qrcodePreview/qrcodePreview?data=' + JSON.stringify({ action: action, cacheKey: key })
    });
  },



  
})