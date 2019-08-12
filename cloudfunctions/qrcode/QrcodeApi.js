const { cloud, database } = require('cloud');
const { TableApi } = require('TableApi');
const { UserApi } = require('UserApi');
const { Utils } = require('Utils');

const TABLE = database.collection("qrcode");


const QrcodeApi = {

  apply: async function (data) {
    if (! await this._checkPermission()) {
      return Utils.fail("0x100001");
    }

    data.createTime = Utils.formatDate(new Date());
    const inster = await TableApi.inster(TABLE, data);
    if (Utils.isFail(inster)) {
      return Utils.fail("0x200601");
    }
    
    const qrcode = await this._makeQrcode(inster.data._id);
    if (Utils.isSuccess(qrcode)) {
      const update = await TableApi.update(TABLE, { _id: inster.data._id}, {qrcode: qrcode.data});
      if (Utils.isFail(update)) {
        qrcode.errMsg = "0x20602";
      } else if (update.data === 0) {
        qrcode.errMsg = "0x20603";
      } else {
        return qrcode;
      }
    }
    const del = await TableApi.del(TABLE, { _id: data._id });
    return qrcode;
  },

  query: async function(data) {
    const query = await TableApi.query(TABLE, { _id: data._id });
    console.log("二维码查询：=====> \n" + JSON.stringify(query));
    if (Utils.isFail(query)) {
      return Utils.fail("0x200101");
    }
    return Utils.isArrayEmpty(query.data) ? Utils.success([]) : Utils.success(query.data[0]);
  },

  queryList: async function(data) {
    if (! await this._checkPermission()) {
      return Utils.fail("0x100001");
    }
    const list = await TableApi.queryList(TABLE, undefined, data.skip, data.limit);
    return Utils.isFail(list) ? Utils.fail("0x20201") : list;
  },

  inster: async function(data) {
    if (! await this._checkPermission()) {
      return Utils.fail("0x100001");
    }
    data.createTime = Utils.formatDate(new Date());
    const inster = await TableApi.inster(TABLE, data);
    return Utils.isFail(inster) ? Utils.fail("0x20301") : inster;
  },

  update: async function(data) {
    if (! await this._checkPermission()) {
      return Utils.fail("0x100001");
    }
    data.updateTime = Utils.formatDate(new Date());
    const update = await TableApi.update(TABLE, {_id: data._id}, data);
    if (Utils.isFail(update)) {
      return Utils.fail("0x200401");
    }
    return update.data === 0 ? Utils.fail("0x200402") : Utils.successStr("修改成功！");
  },

  del: async function(data) {
    if (! await this._checkPermission()) {
      return Utils.fail("0x100001");
    }
    const del = await TableApi.del(TABLE, {_id: data._id});
    return Utils.isSuccess(del) ? Utils.successStr("删除成功！") : Utils.fail("0x100501");;
  },

  _makeQrcode: async function (qrcodeId) {
    try {
      const path = "pages/index/index";
      const width = 200;

      const result = await cloud.openapi.wxacode.getUnlimited({ page: path, scene: qrcodeId, width: width });
      
      // const result = await cloud.openapi.wxacode.createQRCode({path: "pages/index/index?data=" + qrcodeId, width: width});
      if (Utils.isOk(result)) {
        // const obj = JSON.strify(result.buffer);
        // console.log(obj);
        const obj = result.buffer.toString('base64');
        return Utils.success(obj);
      }
    } catch (e) {
      console.log(e);
      if (e.message) {
        return Utils.fail("0x100604");
      }

      return Utils.fail("0x100605");
    }
    return Utils.fail("0x100606");
  },

  _checkPermission: async function () {
    const query = await UserApi.query({ openid: cloud.getWXContext().OPENID });
    if (Utils.isFail(query)) {
      return false;
    }
    return Utils.isRoot(query.data) || Utils.isManager(query.data);
  }

};


module.exports = {QrcodeApi};