const CategoryModel = require('../models/Categories')
const ProductModel = require('../models/Products')
const ProductDetail = require('../models/ProductDetails')
function message (value, message) {
  const data = {
    true: value,
    msg: message
  }
  return data
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
  }
}
