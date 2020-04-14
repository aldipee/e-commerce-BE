var express = require('express')
const User = express.Router()
const UserControl = require('../controllers/User')

User.post('/register', UserControl.registerUser)
User.post('/activate', UserControl.activateUser)
User.post('/login', UserControl.login) // still doing
User.post('/username-check', UserControl.usernameCheck)
User.post('/forgot', UserControl.forgetPass)
User.post('/reset-password', UserControl.resetPass)

module.exports = User
