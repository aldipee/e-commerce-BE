const db = require('../../utils/db')
const table = 'address'
module.exports = {
  createAddress: function (idUserDetail, city, postcode, district, street) {
    const query = `INSERT INTO ${table} (id_user_detail, city, postcode, street, district) VALUES (${idUserDetail}, '${city}', '${postcode}', '${street}', '${district}')`
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results.insertId)
        }
      })
    })
  },
  getByidUserDetail: function (idUserDetail) {
    const query = `SELECT * FROM ${table} WHERE id_user_detail = ${idUserDetail}`
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  }
}