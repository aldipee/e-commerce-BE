const db = require('../../utils/db')
const table = 'transactions'

module.exports = {
  createTransaction: function (idUser, totalPrice, postalFee) {
    const query = `INSERT INTO ${table} (id_user, total_price, postal_fee) VALUES (${idUser}, ${totalPrice}, ${postalFee}) `
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results.insertId)
        }
      })
    })
  }
}
