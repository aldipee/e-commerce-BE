var express = require('express')
const admin = express.Router()

admin.get('/hello', function (req, res) {
  res.send('hello world')
})

module.exports = admin
