const db = require('../../utils/db')
const table = 'user_details'

module.exports = {
  createUserDetail: function (idUser, fullName, phone) {
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
  },
  updateUserDetail: function (name, dateBirth, gender, phone, photo, idUser) {
    const query = `UPDATE ${table} SET full_name = '${name}', date_birth = '${dateBirth}', gender = ${gender}, phone = '${phone}', photo = '${photo}' WHERE id_user = ${idUser}`
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
  getUserDetail: function (idUser) {
    const query = `SELECT * FROM ${table} WHERE id_user = ${idUser}`
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0])
        }
      })
    })
  }
}
