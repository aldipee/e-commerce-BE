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
  updateStatusItemSend: function (id, status, receiptCode) {
    const query = `UPDATE ${table} SET status = ${status}, receipt_number = '${receiptCode}' WHERE id=${id}`
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
  updateStatusTransaction: function (id, status) {
    const query = `UPDATE ${table} SET status = ${status} WHERE id = ${id}`
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
  // getTransactionById: function (idTransaction) {
  //   const query = `SELECT * FROM ${table} WHERE id = ${idTransaction}`
  //   return new Promise(function (resolve, reject) {
  //     db,query(query, function( err, results, fields) {

  //     })
  //   })
  // }
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
  },
  getAllTransactionByAdmin: async function (conditions) {
    const { page, perPage, sort, search } = conditions
    const query = `SELECT * FROM ${table} WHERE CAST(${search.key} AS VARCHAR(5)) LIKE '${search.value}%'
                  ORDER BY ${sort.key} ${sort.value ? 'ASC' : 'DESC'}
                  LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`
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
  getTotalTransactions: function (conditions = {}) {
    let { search } = conditions
    search = search || { key: 'status', value: '' }
    return new Promise(function (resolve, reject) {
      const query = `SELECT COUNT(*) AS total FROM ${table}
                    WHERE CAST(${search.key} AS VARCHAR(5)) LIKE '${search.value}%'`
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
