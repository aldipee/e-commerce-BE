var express = require('express')
const product = express.Router()
const multer = require('multer')
const path = require('path')

const MidToken = require('../middleware/Auth')
const AdminControl = require('../controllers/Admin')
const UserControl = require('../controllers/User')

const storage = multer.diskStorage({
  destination: 'files/',
  filename: function (req, file, callbck) {
    callbck(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({
  storage: storage,
  limits: { fileSize: 7000000 },
  fileFilter: function (req, file, callbck) {
    fileCheck(file, callbck)
  }
}).single('picture')

function fileCheck (file, callbck) {
  const typeFile = /jpeg|jpg|png|gif/
  const extName = typeFile.test(path.extname(file.originalname).toLowerCase())
  console.log(extName)
  const mimetype = typeFile.test(file.mimetype)
  console.log(mimetype)
  if (mimetype && extName) {
    return callbck(null, true)
  } else {
    return callbck(null, false)
  }
}

function filterPicture (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      res.send('Error: File too large')
      console.log(err)
    } else {
      if (req.file === undefined) {
        res.send('Error: no file selected')
      } else {
        next()
      }
    }
  })
}

// product
product.post('/create', MidToken.checkToken, filterPicture, AdminControl.createProduct)
product.post('/create/:idProduct/detail', MidToken.checkToken, AdminControl.createProductDetail)

product.get('/all', UserControl.getAllProduct)
product.get('/category/:id', UserControl.getProductByCategory)

module.exports = product
