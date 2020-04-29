const db = require('../../utils/db')
const table = 'topup'

module.exports = {
  createRequestTopUp: function(idUser, nominal) {
    const query = `INSERT INTO ${table} (id_user, nominal) VALUES (${idUser}, ${nominal})`
    return new Promise (function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results.insertId)
        }
      })
    })
  },
  getAllTopup: function(conditions) {
    const {page, perPage, sort, search} = conditions
    const query = `SELECT * FROM ${table} WHERE ${search.key} LIKE '${search.value}%'
    ORDER BY ${sort.key} ${sort.value ? 'ASC' : 'DESC'}
    LIMIT ${perPage} OFFSET ${(page - 1) * perPage}` 
    return new Promise (function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  },
  checkTopupId: function(id) {
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
  },
  getTotalTopup: function(conditions) {
    let { search } = conditions
    const query = `SELECT COUNT(*) AS total FROM ${table}
    WHERE ${search.key} LIKE '${search.value}%' `
    return new Promise(function (resolve, reject) {
      db.query(query, function( err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].total)
        }
      })
    })
  },
  getTopupByUser: function (idUser, conditions) {
    const {page, perPage, sort} = conditions
    const query = `SELECT * FROM ${table} WHERE id_user = ${idUser} AND status = 1
    ORDER BY ${sort.key} ${sort.value ? 'ASC' : 'DESC'}
    LIMIT ${perPage} OFFSET ${(page-1) * perPage}`
    return new Promise (function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  },
  getTopupById: function (id) {
    const query = `SELECT * FROM ${table} WHERE id = ${id}`
    return new Promise( function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0])
        }
      })
    })
  },
  updateStatus: function (idUser, status) {
    const query = `UPDATE ${table} SET status= ${status} WHERE id_user = ${idUser}`
    return new Promise( function (resolve, reject) {
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
  deleteTopup: function (id, idUser, isDeleted) {
    const query = `UPDATE ${table} SET is_deleted = ${isDeleted} WHERE id_user = ${idUser} AND id = ${id}`
    return new Promise( function (resolve, reject) {
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