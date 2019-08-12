 // 云函数入口文件
const { QrcodeApi } = require('QrcodeApi'); 
const { Utils } = require('Utils');

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("请求数据：" + JSON.stringify(event));
  const actionType = event.actionType;
  const data = event.data;

  if (actionType === "apply") {
    return await QrcodeApi.apply(data);
  } else if (actionType === "query") {
    return await QrcodeApi.query(data);
  } else if (actionType === "queryList") {
    return await QrcodeApi.queryList(data);;
  } else if (actionType === "update") {
    return await QrcodeApi.update(data);;
  } else if (actionType === "inster") {
    return await QrcodeApi.inster(data);;
  } else if (actionType === "delete") {
    return await QrcodeApi.del(data);;
  }

  return Utils.fail("0x100000");
}