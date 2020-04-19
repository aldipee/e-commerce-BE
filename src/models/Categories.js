const db = require('../../utils/db')
const table = 'categories'

module.exports = {
  createCategory: function (name, thumbnail) {
    const query = `INSERT INTO ${table} (name, thumbnail) VALUES ('${name}','${thumbnail}')`
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
  getAllCategory: function () {
    const query = `SELECT * FROM ${table}`
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          if (results.length) {
            resolve(results[0])
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  getCategoryById: function (id) {
    const query = `SELECT * FROM ${table} WHERE id = ${id}`
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0])
        }
      })
    })
  },
  updateCategory: function (id, name, picture) {
    const query = `UPDATE ${table} SET name = '${name}', thumbnail = '${picture}' WHERE id = ${id}`
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          if (results.affectedRows) {
            resolve(results.affectedRows)
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  checkCategory: function (id) {
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
  deleteCategory: function (id) {
    const query = `UPDATE ${table} SET is_deleted = 1 WHERE id = ${id}`
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          if (results.affectedRows) {
            resolve(results.affectedRows)
          } else {
            resolve(false)
          }
        }
      })
    })
  }
}
