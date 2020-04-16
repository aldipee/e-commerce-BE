var express = require('express')
const Transactions = express.Router()
const MidToken = require('../middleware/Auth')

const UserControl = require('../controllers/User')

Transactions.post('/new', MidToken.checkToken, UserControl.createTransaction)

module.exports = Transactions