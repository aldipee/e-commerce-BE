var express = require('express')
const Transactions = express.Router()
const MidToken = require('../middleware/Auth')

const UserControl = require('../controllers/User')
const AdminControl = require('../controllers/Admin')
// transactions
Transactions.post('/new', MidToken.checkToken, UserControl.createTransaction)

Transactions.patch('/:id/transaction-send', MidToken.checkToken, AdminControl.updateTransactionStatusToSend)
Transactions.patch('/:id', MidToken.checkToken, AdminControl.updateTransactionStatus)

Transactions.get('/user', MidToken.checkToken, UserControl.getTransactionByUser)
Transactions.get('/all', MidToken.checkToken, AdminControl.getAllTransactionByAdmin)

module.exports = Transactions
