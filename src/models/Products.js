const db = require('../../utils/db')
const table = 'products'

module.exports = {
  createProduct: function (idCategory, name, picture, price, stock) {
    const query = `INSERT INTO ${table} (id_category, name, price, picture, stock) VALUES(${idCategory}, '${name}', ${price}, '${picture}', ${stock})`
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
  checkProduct: function (id) {
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
  getAllProducts: function (conditions) {
    const { page, perPage, sort, search } = conditions
    return new Promise(function (resolve, reject) {
      const sql = `SELECT categories.id as idCategory, products.id as idProduct, categories.name as categoryName, categories.thumbnail, products.name, products.price, products.picture, products.stock
                  FROM ${table} INNER JOIN categories ON categories.id = products.id_category
                  WHERE ${search.key} LIKE '${search.value}%' AND products.stock != 0
                  ORDER BY ${sort.key} ${sort.value ? 'ASC' : 'DESC'} 
                   LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`
      console.log(sql)
      db.query(sql, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  },
  getTotalProducts: function (conditions = {}) {
    let { search } = conditions
    search = search || { key: 'name', value: '' }
    return new Promise(function (resolve, reject) {
      const query = `SELECT COUNT(*) AS total FROM ${table}
                  WHERE ${search.key} LIKE '${search.value}%' AND stock != 0`
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].total)
        }
      })
    })
  },
  getProductByCategory: function (idCategory) {
    const query = `SELECT * FROM ${table} WHERE id_category = ${idCategory}`
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
  checkStock: function (idProduct) {
    const query = `SELECT * FROM ${table} WHERE id=${idProduct}`
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
  buy: function (quantity, id) {
    const query = `UPDATE ${table} SET stock = stock-${quantity} WHERE id = ${id}`
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
  getProductById: function (id) {
    const query = `SELECT * FROM ${table} WHERE id = ${id}`
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
  updateProduct: function (id, isDeleted) {
    const query = `UPDATE ${table} SET is_deleted = ${isDeleted} WHERE id = ${id}`
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
  updateStockProduct: function (id, stock) {
    const query = `UPDATE ${table} SET stock = ${stock} WHERE id = ${id}`
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
