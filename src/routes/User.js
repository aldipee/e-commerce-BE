var express = require('express')
const User = express.Router()
const UserControl = require('../controllers/User')

User.post('/register', UserControl.registerUser)

module.exports = User
