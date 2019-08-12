const { cloud, database } = require('cloud');
const { TableApi } = require('TableApi');
const { Utils } = require('Utils');

const TABLE = database.collection("user");

const UserApi = {

  login: async function(data) {
    data.openid = cloud.getWXContext().OPENID;
    const where = {openid: data.openid};

    const query = await this._query(where);
    if (Utils.isFail(query)) {
      return query;
    }
    if (Utils.isArrayEmpty(query.data)) {
      data.loginTime = Utils.formatDate(new Date());
      const inster = await this._inster(data);
      return Utils.isFail(inster) ? inster : Utils.success(inster.data);
    }

    const dbData = query.data[0];
    dbData.baseInfo = data.baseInfo;
    dbData.otherInfo = data.otherInfo || dbData.otherInfo;
    dbData.loginTime = Utils.formatDate(new Date());
    const update = await this._update(where, dbData);
    return Utils.isFail(update) ? update : Utils.success(dbData);
  },


  query: async function(data) {
    const openid = data.openid || cloud.getWXContext().OPENID;
    if (openid !== cloud.getWXContext().OPENID) {
      if (!await this._checkPermissionRoot()) {
        return Utils.fail("0x100001");
      }
    }
    const query = await this._query({ openid: openid });
    if (Utils.isFail(query)) {
      return query;
    }
    return Utils.isArrayEmpty(query.data) ? Utils.fail("0x100102") : Utils.success(query.data[0]);
  },

  queryList: async function(data) {
    if (!await this._checkPermissionRoot()) {
      return Utils.fail("0x100001");
    }
    const cmd = database.command;
    const where = { openid: cmd.neq(cloud.getWXContext().OPENID)};
    const list = await TableApi.queryList(TABLE, where, data.skip, data.limit);
    return list.errMsg ? Utils.fail("0x100501") : Utils.success(list.data);
  },

  inster: async function(data) {
    if (!await this._checkPermissionRoot()) {
      return Utils.fail("0x100001");
    }

    const query = await this._query({openid: data.openid});
    if (Utils.isFail(query)) {
      return query;
    }

    // 需要插入的数据已经存在
    if (!Utils.isArrayEmpty(query.data)) {
      return Utils.fail("0x100202");
    }

    data.createTime = Utils.formatDate(new Date());
    const inster = await this._inster(data);
    return Utils.isFail(inster) ? inster : Utils.success(inster.data);
  },

  update: async function(data) {
    if (data.openid !== cloud.getWXContext().OPENID) {
      if (!await this._checkPermissionRoot()) {
        return Utils.fail("0x100001");
      }
    }
    delete data.permission;
    data.updateTime = Utils.formatDate(new Date());
    const update = await this._update({ openid: data.openid }, data);
    if (Utils.isFail(update)) {
      return update;
    }
    return update.data === 0 ? Utils.fail("0x100302") : Utils.successStr("修改成功！");
  },

  del: async function(data) {
    if (!await this._checkPermissionRoot()) {
      return Utils.fail("0x100001");
    }
    const del = await TableApi.del(TABLE, {openid: data.openid});
    console.log("删除客户数据：" + JSON.stringify(del));

    return Utils.isSuccess(del) ? Utils.successStr("删除成功！") : Utils.fail("0x100401");
  },

  permissionApply: async function(data) {
    data.permission = "0";
    data.permissionTime = Utils.formatDate(new Date());
    return await this.permissionUpdate(data, false);
  },

  permissionUpdate: async function(data, isCheckPermission) {
    if (isCheckPermission && !await this._checkPermissionRoot()) {
      return Utils.fail("0x100001");
    }
    const query = await this._query({openid: data.openid});
    if (Utils.isFail(query)) {
      return query;
    }
    if (Utils.isArrayEmpty(query.data)) {
      return Utils.fail("0x100601");
    }

    query.data[0].permission = data.permission;
    query.data[0].permissionTime = Utils.formatDate(new Date());
    const update = await this._update({ openid: data.openid }, query.data[0]);
    if (Utils.isFail(update)) { 
      return update;
    }
    return update.data === 0 ? Utils.fail("0x100602") : Utils.success(query.data[0]);
  },

  permissionList: async function(data) {
    if (!await this._checkPermissionRoot()) {
      return Utils.fail("0x100001");
    }
    const cmd = database.command;
    const where = { permission: cmd.eq("0").or(cmd.eq("10"))};
    const list = await TableApi.queryList(TABLE, where, data.skip, data.limit);
    return Utils.isFail(list) ? Utils.fail("0x100602") : list;
  },

  _query: async function (where) {
    const query = await TableApi.query(TABLE, where);
    console.log("查询客户数据：" + JSON.stringify(query));
    return Utils.isFail(query) ? Utils.fail("0x100101") : query;
  },

  _inster: async function (data) {
    data.permission = "";
    data.wxName = data.baseInfo.nickName || undefined;
    const inster = await TableApi.inster(TABLE, data);
    console.log("新增客户数据：" + JSON.stringify(inster));
    return Utils.isFail(inster) ? Utils.fail("0x100201") : inster;
  },

  _update: async function(where, data) {
    data.wxName = data.baseInfo.nickName || undefined;
    const update = await TableApi.update(TABLE, where, data);
    console.log("更新客户数据：" + JSON.stringify(update));
    return Utils.isFail(update) ? Utils.fail("0x100301") : update;
  },

  _checkPermissionRoot: async function () {
    const query = await this._query({ openid: cloud.getWXContext().OPENID });
    const user = !Utils.isArrayEmpty(query.data) && query.data[0];
    return Utils.isRoot(user);
  },

  _syncUser: function (loginUser, dbUser) {
    // 如果登录的用户信息存在其他附加信息，则把信息更新到数据库的user对象中
    if (loginUser.otherInfo) {
      dbUser.otherInfo = loginUser.otherInfo;
      // 如果登录的用户信息中没有附加信息，并且数据库中的user对象有附加信息，则把信息同步给登录用户user对象
      // 这种情况为用户 更换设备重新登录时，已经在别的设备中登录过，且完善过信息，需要同步到现用设备中
    }
    dbUser.baseInfo = loginUser.baseInfo;
  },


};




module.exports = { UserApi};