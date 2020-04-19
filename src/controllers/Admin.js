const uuid = require('uuid').v4
const CategoryModel = require('../models/Categories')
const ProductModel = require('../models/Products')
const ProductDetail = require('../models/ProductDetails')
const TransactionModel = require('../models/Transaction')
function message (success, msg, data) {
  if (data) {
    return {
      success: success,
      msg: msg,
      data: data
    }
  } else {
    return {
      success: success,
      msg: msg
    }
  }
}

module.exports = {
  createCategory: async function (req, res) {
    if (req.user.roleId === 1) {
      const picture = (req.file && req.file.filename) || null
      const { name } = req.body
      if (name && picture) {
        const result = await CategoryModel.createCategory(name, picture)
        if (result) {
          res.send(message(true, 'Category created'))
        } else {
          res.send(message(false, 'Cant create category'))
        }
        res.send(message(true, req.user))
      } else {
        res.send(message(false, 'Please fill the form input'))
      }
    } else {
      res.send(message(false, 'U cant access this feature'))
    }
  },
  deleteCategory: async function (req, res) {
    try {
      const { id } = req.params
      if (req.user.roleId === 1) {
        const results = await CategoryModel.checkCategory(id)
        if (results) {
          await CategoryModel.deleteCategory(id)
          res.send(message(true, 'Category deleted'))
        } else {
          res.send(message(false, 'Category not found'))
        }
      } else {
        res.send(message(false, 'U cant access this feature'))
      }
    } catch (err) {
      res.send(message, err)
    }
  },
  updateCategory: async function (req, res) {
    const idUser = req.user.id
    const { id } = req.params
    const infoCategory = await CategoryModel.getCategoryById(id)
    const { name } = req.body
    const newName = name || infoCategory.name
    const picture = (req.file && req.file.filename) || null
    if (idUser === 1) {
      await CategoryModel.updateCategory(id, newName, picture)
      res.send(message(true, 'Category updated'))
    } else {
      res.send(message(false, 'U cant access this feature'))
    }
  },
  createProduct: async function (req, res) {
    if (req.user.roleId === 1) {
      const { idCategory, name, price, stock } = req.body
      const picture = (req.file && req.file.filename) || null
      if (idCategory && name && price) {
        const result = await CategoryModel.checkCategory(idCategory)
        if (result === 1) {
          await ProductModel.createProduct(idCategory, name, picture, price, stock)
          res.send(message(true, 'Product created'))
        } else {
          res.send(message(false, 'id category not found'))
        }
      } else {
        res.send(message(false, 'Please insert all field'))
      }
    } else {
      res.send(message(false, 'U cant access this feature'))
    }
  },
  createProductDetail: async function (req, res) {
    const { idProduct } = req.params
    const { size, stock } = req.body
    if (req.user.roleId === 1) {
      if (size && stock) {
        const checkProduct = await ProductModel.checkProduct(idProduct)
        if (checkProduct === 1) {
          ProductDetail.createProductDetails(idProduct, size, stock)
          res.send(message(true, 'Product detail created'))
        } else {
          res.send(message(false, 'id product not found'))
        }
      } else {
        res.send(message(false, 'Please fill all input'))
      }
    } else {
      res.send(message(false, 'U cant access this feature'))
    }
  },
  updateTransactionStatusToSend: async function (req, res) {
    const { id } = req.params
    const { status } = req.body
    const role = req.user.roleId
    const receiptCode = uuid()
    const newReceiptCode = receiptCode.substr(0, 8)
    if (role === 1) {
      await TransactionModel.updateStatusItemSend(id, status, newReceiptCode)
      res.send(message(true, `Transaction status updated to ${status}`))
    } else {
      res.send(message(false, 'U cant access this feature'))
    }
  },
  updateTransactionStatus: async function (req, res) {
    const role = req.user.roleId
    const { id } = req.params
    const { status } = req.body
    if (role === 1) {
      await TransactionModel.updateStatusTransaction(id, status)
      res.send(message(true, `Transaction status updated to ${status}`))
    } else {
      res.send(message(false, 'U cant access this feature'))
    }
  },
  getAllTransactionByAdmin: async function (req, res) {
    const roleId = req.user.roleId
    let { page, limit, search, sort } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 5
    search = (search && { key: search.key, value: search.value }) || { key: 'status', value: '' }
    sort = (sort && { key, value }) || { key: 'id', value: 1 }
    const conditions = { page, perPage: limit, search, sort }
    if (roleId === 1) {
      const infoTransaction = await TransactionModel.getAllTransactionByAdmin(conditions)
      conditions.totalData = await TransactionModel.getTotalTransactions(conditions)
      conditions.totalPage = Math.ceil(conditions.totalData / conditions.perPage)
      delete conditions.search
      delete conditions.sort
      delete conditions.limit
      const dataTransaction = { data: infoTransaction, pageInfo: conditions }
      res.send(message(true, 'List of transactions', dataTransaction))
    } else {
      res.send(message(false, 'U cant access this feature'))
    }
  },
  updateProductStatus: async function (req, res) {
    const role = req.user.roleId
    const { id } = req.params
    const { isDeleted } = req.body
    if (role === 1) {
      if (await ProductModel.updateProduct(id, isDeleted)) {
        res.send(message(true, 'Product is_deleted updated'))
      } else {
        res.send(message(false, 'Unable to updated, id product not found'))
      }
    } else {
      res.send(message(false, 'U cant access this feature'))
    }
  },
  updateProductStock: async function (req, res) {
    const { id } = req.params
    const role = req.user.roleId
    const { stock } = req.body
    if (role === 1) {
      if (await ProductModel.updateStockProduct(stock, id)) {
        res.send(message(true, `Stock product with id ${id} updated`))
      } else {
        res.send(message(false, 'Product not found'))
      }
    } else {
      res.send(message(false, 'U cant access this feature'))
    }
  }
}
