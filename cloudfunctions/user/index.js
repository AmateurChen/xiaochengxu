// 云函数入口文件
const {UserApi} = require('UserApi');
const { Utils } = require('Utils');


// 云函数入口函数
exports.main = async (event, context) => {
  console.log("请求数据：\n" + JSON.stringify(event));
  const actionType = event.actionType;
  const data = event.data;

  if (actionType === 'login') {
    return await UserApi.login(data);
  }

  if (actionType === 'queryList') {
    return await UserApi.queryList(data);
  } else if (actionType === 'query') {
    return await UserApi.query(data);
  }

  if (actionType === 'update') {
    return await UserApi.update(data);
  } else if (actionType === 'inster') {
    return await UserApi.inster(data);
  } else if (actionType === 'delete') {
    return await UserApi.del(data);
  } else if (actionType === 'permissionList') {
    return await UserApi.permissionList(data);
  } else if (actionType === 'permissionUpdate') {
    return await UserApi.permissionUpdate(data, true);
  } else if (actionType === 'permissionApply') {
    return await UserApi.permissionApply(data);
  }

  return Utils.fail("0x100000");
}