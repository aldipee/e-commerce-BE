var express = require('express')
const admin = express.Router()
const multer = require('multer')
const path = require('path')

const MidToken = require('../middleware/Auth')
const AdminControl = require('../controllers/Admin')

const storage = multer.diskStorage({
  destination: 'files/',
  filename: function (req, file, callbck) {
    callbck(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({
  storage: storage,
  limits: { fileSize: 7000 },
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
// item
admin.post('/category', filterPicture, MidToken.checkToken, AdminControl.createCategory)
admin.patch('/category/:id', MidToken.checkToken, AdminControl.deleteCategory)


module.exports = admin
