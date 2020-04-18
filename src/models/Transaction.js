const db = require('../../utils/db')
const table = 'transactions'

module.exports = {
  createTransaction: function (idUser, totalPrice, postalFee, invoiceNumber) {
    const query = `INSERT INTO ${table} (id_user, total_price, postal_fee, invoice_number) VALUES (${idUser}, ${totalPrice}, ${postalFee}, '${invoiceNumber}') `
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
  getTransactionByUser: function (idUser, conditions) {
    const { page, perPage, sort, search } = conditions
    const query = `SELECT * FROM ${table}  
                  WHERE ${search.key} LIKE '${search.value}%' AND id_user = ${idUser}
                  ORDER BY ${sort.key} ${sort.value ? 'ASC' : 'DESC'} 
                  LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`
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
  getTotalTransactionByUser: function (idUser, conditions = {}) {
    let { search } = conditions
    search = search || { key: 'id', value: '' }
    const query = `SELECT COUNT(*) AS total FROM ${table}
                  WHERE ${search.key} LIKE '${search.value}%' AND id_user = ${idUser}`
    console.log(query)
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
