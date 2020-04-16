const db = require('../../utils/db')
const table = 'product_details'

module.exports = {
  createProductDetails: function (idProduct, size, stock) {
    const query = `INSERT INTO ${table} (id_product, size, stock) VALUES (${idProduct}, ${size}, ${stock})`
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
  updateStock: function (idProduct, size, quantity) {
    const query = `UPDATE ${table} SET stock=stock-${quantity} WHERE id_product = ${idProduct} AND size = ${size}`
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          if (results.affectedRows) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
      })
    })
  }
}
