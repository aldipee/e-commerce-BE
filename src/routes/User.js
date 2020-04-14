var express = require('express')
const user = express.Router()

user.get('/hello', function (req, res) {
  res.send('hello world')
})

module.exports = user
