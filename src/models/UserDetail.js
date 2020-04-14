const db = require('../../utils/db')

module.exports = {
  createUserDetail: function (idUser, fullName, phone) {
    const table = 'user_details'
    const query = `INSERT INTO ${table} (id_user, full_name, phone) VALUES (${idUser}, '${fullName}', '${phone}')`
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
