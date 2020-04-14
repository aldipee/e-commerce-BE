var express = require('express')
const User = express.Router()
const UserControl = require('../controllers/User')

User.post('/register', UserControl.registerUser)
User.post('/activate', UserControl.activateUser)
User.post('/login', UserControl.login)

module.exports = User
