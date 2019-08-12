const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'online-rdjl1'
})

module.exports = {cloud, database: cloud.database()};