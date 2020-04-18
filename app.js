// package
var createError = require('http-errors')
var express = require('express')
var cors = require('cors')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const bodyParser = require('body-parser')
require('dotenv').config()

// routes
var user = require('./src/routes/User')
var item = require('../src/routes/Item
var product = require('./src/routes/Product')
var transaction = require('./src/routes/Transactions')

var app = express()

app.use(bodyParser.urlencoded({ extended: false })) // for x-www-urlencoded
app.use(bodyParser.json())
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/public/image', express.static(path.join(__dirname, 'files')))
app.use('/item', item)
app.use('/auth', user)
app.use('/product', product)
app.use('/transactions', transaction)
app.use('/migrate', function (req, res) {
  require('./src/migrations/Roles')
  require('./src/migrations/User')
  require('./src/migrations/UserDetails')
  require('./src/migrations/Address')
  require('./src/migrations/Category')
  require('./src/migrations/Products')
  require('./src/migrations/ProductDetails')
  require('./src/migrations/Transactions')
  require('./src/migrations/TransactionDetails')
  res.send('Migrate roles, user, userd, address')
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
  res.send('404 not found')
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// port
const port = process.env.PORT

app.listen(port, function () {
  console.log(`listening on port ${port}`)
})
