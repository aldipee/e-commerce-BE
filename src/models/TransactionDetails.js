const db = require('../../utils/db')
const table = 'transaction_details'

module.exports = {
  createTransactionDetails: function (idTransaction, idProduct, price) {
    const query = `INSERT INTO ${table} (id_transaction, id_product, price) VALUES (${idTransaction}, ${idProduct}, ${price})`
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
  }
}
