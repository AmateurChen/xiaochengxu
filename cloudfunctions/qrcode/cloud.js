const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'online-rdjl1'
});

module.exports = { cloud: cloud, wxContext: cloud.getWXContext(), database: cloud.database()};