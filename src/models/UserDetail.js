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
  updateUserDetail: function (name, dateBirth, gender, phone, idUser) {
    const query = `UPDATE ${table} SET full_name = '${name}', date_birth = '${dateBirth}', gender = ${gender}, phone = '${phone}' WHERE id_user = ${idUser}`
    console.log(query)
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
  updatePicture: function (photo, idUser) {
    const query = `UPDATE ${table} SET photo = '${photo}' where id_user = ${idUser}`
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
  },
  updateBalance: function (idUser, balance) {
    const query = `UPDATE ${table} SET balance = ${balance} WHERE id_user = ${idUser}`
    console.log(query)
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
  topupBalance: function (idUser, balance) {
    const query = `UPDATE ${table} SET balance = balance + ${balance} WHERE id_user = ${idUser}`
    console.log(query)
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
  }
}
