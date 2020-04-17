const db = require('../../utils/db')
const table = 'transaction_details'

module.exports = {
  createTransactionDetails: function (idTransaction, idProduct, price, quantity) {
    const newPrice = price * quantity
    const query = `INSERT INTO ${table} (id_transaction, id_product, price, quantity) VALUES (${idTransaction}, ${idProduct}, ${newPrice}, ${quantity})`
    console.log(query)
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
  getTransactionDetailsByIdTransaction: function (idTransaction) {
    const query = `SELECT * FROM ${table} WHERE id_transaction = ${idTransaction}`
    console.log(query)
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  },
  getTransactionJoinProduct: function (id) {
    const query = `SELECT transaction_details.id_transaction, transaction_details.price
                  , transaction_details.quantity, products.name
                  FROM transaction_details INNER JOIN products ON transaction_details.id_product = products.id
                  WHERE transaction_details.id_transaction = ${id}`
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
