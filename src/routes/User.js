var express = require('express')
const User = express.Router()
const multer = require('multer')
const path = require('path')

const MidToken = require('../middleware/Auth')
const UserControl = require('../controllers/User')

const storage = multer.diskStorage({
  destination: 'files/',
  filename: function (req, file, callbck) {
    callbck(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000000 },
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

// auth
User.post('/register', UserControl.registerUser)
User.get('/activate', UserControl.activateUser)
User.post('/login', UserControl.login)
User.post('/username-check', UserControl.usernameCheck)
User.post('/forgot', UserControl.forgetPass)
User.post('/reset-password', UserControl.resetPass)
User.post('/email-check', UserControl.emailCheck)
User.post('/insert-address', MidToken.checkToken, UserControl.addAddress)

User.patch('/update-personal', MidToken.checkToken, UserControl.updatePersonal)
User.patch('/update-pic', MidToken.checkToken, filterPicture, UserControl.updatePict)

User.get('/detail', MidToken.checkToken, UserControl.getProfileDetail)

module.exports = User
