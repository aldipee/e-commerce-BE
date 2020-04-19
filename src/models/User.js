const db = require('../../utils/db')
const table = 'users'
module.exports = {
  createUser: function (username, password, email) {
    return new Promise(function (resolve, reject) {
      const query = `INSERT INTO ${table} (username, password, email) VALUES ('${username}','${password}', '${email}')`
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results.insertId)
        }
      })
    })
  },
  checkUsername: function (username) {
    return new Promise(function (resolve, reject) {
      const query = `SELECT COUNT (*) AS total FROM ${table} WHERE username ='${username}'`
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].total)
        }
      })
    })
  },
  checkEmail: function (email) {
    return new Promise(function (resolve, reject) {
      const query = `SELECT COUNT (*) AS total FROM ${table} WHERE email ='${email}'`
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].total)
        }
      })
    })
  },
  getUserByUsername: function (username) {
    return new Promise(function (resolve, reject) {
      const query = `SELECT * FROM ${table} WHERE username = '${username}'`
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
  getUserById: function (id) {
    const query = `SELECT * FROM ${table} WHERE id = ${id}`
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
  createVerificationCode: function (id, vercode) {
    const table = 'users'
    const query = `UPDATE ${table} SET verification_code = '${vercode}' WHERE id = ${id}`
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
  getVerificationCode: async function (username) {
    const table = 'users'
    return new Promise(function (resolve, reject) {
      const query = `SELECT verification_code FROM ${table} WHERE username = '${username}'`
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
  deleteCode: async function (username) {
    const query = `UPDATE ${table} SET verification_code = NULL where username = '${username}'`
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
  activateUser: async function (username, code) {
    const table = 'users'
    const checkUser = await this.checkUsername(username)
    const query = `UPDATE ${table} SET verification_code=${null}, is_registered = 1 WHERE username='${username}' AND verification_code = '${code}'`
    return new Promise(function (resolve, reject) {
      if (!checkUser) {
        resolve(false)
      } else {
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
      }
    })
  },
  checkRegistered: async function (username) {
    const table = 'users'
    const query = `SELECT COUNT (*) AS total from ${table} WHERE username='${username}' AND is_registered = 1`
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
  forgotPassword: async function (uuid, newPassword) {
    const table = 'users'
    const query = `SELECT COUNT (*) AS total FROM ${table} WHERE verification_code ='${uuid}' AND is_registered = 1`
    const checkUser = new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].total)
        }
      })
    })
    if (await checkUser) {
      return new Promise(function (resolve, reject) {
        db.query(`UPDATE ${table} SET password='${newPassword}' WHERE verification_code='${uuid}'`, function (err, results, fields) {
          console.log('a')
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
  },
  ProfileDetail: async function (id) {
    const query = `SELECT users.username, users.email, user_details.full_name, user_details.date_birth, user_details.gender, user_details.phone, user_details.balance, user_details.photo
                    FROM users 
                    INNER JOIN user_details ON users.id = user_details.id_user 
                    WHERE users.id = ${id}`
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
