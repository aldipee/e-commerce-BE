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
  },
  updateStatus: function (id, status) {
    const query = `UPDATE ${table} SET status = ${status} WHERE id=${id}`
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
  },
  getTransactionByUser: function (idUser) {
    const query = `SELECT * FROM ${table} WHERE id_user = ${idUser}`
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
