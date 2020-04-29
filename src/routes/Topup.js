var express = require('express')
const Topup = express.Router()
const MidToken = require('../middleware/Auth')

const UserControl = require('../controllers/User')
const AdminControl = require('../controllers/Admin')

// path : topup/
Topup.post('/user', MidToken.checkToken, UserControl.requestTopup)
Topup.get('/user/history', MidToken.checkToken, UserControl.getAllTopUp)
Topup.put('/admin/:id', MidToken.checkToken, AdminControl.updateSaldo)
Topup.get('/admin/all', MidToken.checkToken, AdminControl.getAllTopup)


module.exports = Topup