var express = require('express')
const User = express.Router()
const UserControl = require('../controllers/User')

// auth
User.post('/register', UserControl.registerUser)
User.post('/activate', UserControl.activateUser)
User.post('/login', UserControl.login)
User.post('/username-check', UserControl.usernameCheck)
User.post('/forgot', UserControl.forgetPass)
User.post('/reset-password', UserControl.resetPass)
User.post('/email-check', UserControl.emailCheck)

module.exports = User
