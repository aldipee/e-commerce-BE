const db = require('../../utils/db')
const table = 'products'

module.exports = {
  createProduct: function (idCategory, name, picture, price) {
    const query = `INSERT INTO ${table} (id_category, name, price, picture) VALUES(${idCategory}, '${name}', ${price}, '${picture}')`
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
  checkProduct: function (id) {
    const query = `SELECT COUNT (*) AS total FROM ${table} WHERE id = ${id}`
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].total)
        }
      })
    })
  }
}