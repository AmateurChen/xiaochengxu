const { Utils } = require('Utils');

const success = (source) => {
  return source.errMsg.indexOf("ok") != -1;
}

const TableApi = {

  query: (table, where) => {
    return new Promise((resolve, reject) => {
      table.where(where).get()
        .then(res => {
          if (!Utils.isOk(res)) {
            resolve(Utils.fail(res.errMsg));
          } else {
            resolve(Utils.success(res.data));
          }
        })
        .catch(err => {
          resolve(Utils.fail(err.errMsg));
        });
    });
  },

  queryList: (table, where, skip, limit) => {
    return new Promise((resolve, reject) => {
      table.where(where).skip(skip).limit(limit).get()
        .then(res => {
          if (!Utils.isOk(res)) {
            resolve(Utils.fail(res.errMsg));
          } else {
            resolve(Utils.success(res.data));
          }
        })
        .catch(err => {
          resolve(Utils.fail(err.errMsg));
        });
    });
  },

  inster: (table, data) => {
    return new Promise((resolve, reject) => {
      table.add({ data: data })
        .then(res => {
          if (!Utils.isOk(res)) {
            resolve(Utils.fail(res.errMsg));
          } else {
            data._id = res._id;
            resolve(Utils.success(data));
          }
        })
        .catch(err => {
          resolve(Utils.fail(err.errMsg));
        });
    });
  },

  update: (table, where, data) => {
    delete data._id;
    return new Promise((resolve, reject) => {
      table.where(where).update({ data: data })
        .then(res => {
          if (!Utils.isOk(res)) {
            resolve(Utils.fail(res.errMsg));
          } else {
            resolve(Utils.success(res.stats.updated));
          }
        })
        .catch(err => {
          resolve(Utils.fail(err.errMsg));
        });
    });
  },


  del: (table, where) => {
    return new Promise((resolve, reject) => {
      table.where(where).remove()
        .then(res => {
          if (!Utils.isOk(res)) {
            resolve(Utils.fail(res.errMsg));
          } else {
            resolve(Utils.success(res.stats.removed));
          }
        })
        .catch(err => {
          resolve(Utils.fail(err.errMsg));
        });
    });
  }

};


module.exports = { TableApi };