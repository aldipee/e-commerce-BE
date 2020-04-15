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
  }
}