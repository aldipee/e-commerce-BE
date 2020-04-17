var express = require('express')
const Transactions = express.Router()
const MidToken = require('../middleware/Auth')

const UserControl = require('../controllers/User')
const AdminControl = require('../controllers/Admin')
// transactions
Transactions.post('/new', MidToken.checkToken, UserControl.createTransaction)
Transactions.patch('/:id', MidToken.checkToken, AdminControl.updateTransactionDetail)
Transactions.get('/user', MidToken.checkToken, UserControl.getTransactionByUser)

module.exports = Transactions