const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const uuid = require('uuid').v4
require('dotenv').config()

const UserModel = require('../models/User')
const UserDetailModel = require('../models/UserDetail')
const TransactionModel = require('../models/Transaction')
const TransactionDetailModel = require('../models/TransactionDetails')
const ProductModel = require('../models/Products')
const ProductDetailModel = require('../models/ProductDetails')
const AddressModel = require('../models/Address')
const Mail = require('../../utils/sendMail')
const SMS = require('../../utils/sendSMS')
const Invoice = require('../../utils/invoice')

function message(success, msg, data) {
  if (data) {
    return {
      success: success,
      msg: msg,
      data: data,
    }
  } else {
    return {
      success: success,
      msg: msg,
    }
  }
}

module.exports = {
  registerUser: async function (req, res) {
    try {
      const { username, password, fullname, email, phone } = req.body
      const phoneRegex = /^[0]/gs
      if (username && password && fullname && email && phone) {
        const newPhone = phone.replace(phoneRegex, '+62')
        const checkUser = await UserModel.checkUsername(username)
        if (checkUser !== 0) {
          res.send(message(false, 'Username already exists'))
        } else {
          const encryptPass = bcrypt.hashSync(password)
          const resultUser = await UserModel.createUser(username, encryptPass, email)
          const infoUser = await UserModel.getUserByUsername(username)
          await UserDetailModel.createUserDetail(infoUser.id, fullname, newPhone)
          console.log(infoUser)
          if (resultUser) {
            const verCode = uuid()
            if (await UserModel.createVerificationCode(infoUser.id, verCode)) {
              const code = await UserModel.getVerificationCode(username)
              if (code) {
                // uncomment below this for sending email when registration

                const path = process.env.ACTIVATION_PATH.concat(`username=${username}&verifyCode=${verCode}`)
                const bodyEmail = `<p>Click this <a href='${path}';>link<a/> for activate your account, or inser this code : ${verCode}</p>`
                Mail.sendMail(email, 'ACTIVATION_CODE', bodyEmail)
                res.send(message(true, `Verification code: ${code.verification_code}`))
              }
            } else {
              res.send(message(false, 'Verification code cant be generate'))
            }
          } else {
            res.send(message(false, 'Register failed'))
          }
        }
      } else {
        res.send(message(false, 'Please fill all input'))
      }
    } catch (err) {
      res.send(message(false, err.sqlMessage))
    }
  },
  activateUser: async function (req, res) {
    const { username, verifyCode } = req.query
    console.log(username, verifyCode)
    if (username && verifyCode) {
      const checkUser = await UserModel.checkUsername(username)
      if (!checkUser) {
        res.send(message(false, 'Username not found'))
      } else {
        const result = await UserModel.activateUser(username, verifyCode)
        if (result) {
          res.redirect('goldenfoot://people/jane')
          // res.send(message(true, 'account activated'))
        } else {
          res.send(message(false, 'verifyCode not valid'))
        }
      }
    } else {
      res.send(message(false, 'Please fill all input'))
    }
  },
  login: async function (req, res) {
    const { username, password } = req.body
    if (username && password) {
      const checkUser = await UserModel.checkUsername(username)
      if (checkUser) {
        const infoUser = await UserModel.getUserByUsername(username)
        const checkPassword = bcrypt.compareSync(password, infoUser.password)
        // console.log(checkPassword)
        const checkRegistered = await UserModel.checkRegistered(username)
        if (checkRegistered) {
          if (checkPassword) {
            const payload = {
              id: infoUser.id,
              username,
              roleId: infoUser.role_id,
              email: infoUser.email,
            }
            const options = { expiresIn: '1d' }
            const key = process.env.APP_KEY
            const token = jwt.sign(payload, key, options)
            res.send(message(true, 'Login Success', token))
          } else {
            res.send(message(false, 'Wrong password !'))
          }
        } else {
          res.send(message(false, 'Register and activate your account first'))
        }
      } else {
        res.send(message(false, 'Username not found'))
      }
    } else {
      res.send(message(false, 'Please fill all the input'))
    }
  },
  usernameCheck: async function (req, res) {
    const { username } = req.body
    const result = await UserModel.checkUsername(username)
    if (result) {
      res.send(message(true, 'Username exists'))
    } else {
      res.send(message(false, 'Username not found'))
    }
  },
  emailCheck: async function (req, res) {
    const { email } = req.body
    if (email) {
      const result = await UserModel.checkEmail(email)
      if (result === 0) {
        res.send(message(true, 'Your email can use'))
      } else {
        res.send(message(false, 'Email already in use'))
      }
    } else {
      res.send(message(false, 'Please insert email'))
    }
  },
  forgetPass: async function (req, res) {
    const { username } = req.body
    if (username) {
      if (await UserModel.checkUsername(username)) {
        const userInfo = await UserModel.getUserByUsername(username)
        const userDetail = await UserDetailModel.getUserDetail(userInfo.id)
        if (userInfo.is_registered === 1) {
          const code = uuid().substring(0, 4)
          await UserModel.createVerificationCode(userInfo.id, code)
          const resetCode = await UserModel.getVerificationCode(userInfo.username)
          if (resetCode) {
            // Uncomment below this for sending SMS
            SMS.sendSMS(resetCode.verification_code, userDetail.phone)
            res.send(message(true, `Reset code : ${resetCode.verification_code}`))
          } else {
            res.send(message(false, "Reset code can't generate"))
          }
        } else {
          res.send(message(false, 'active your account first'))
        }
      } else {
        res.send(message(false, 'Username not found'))
      }
    } else {
      res.send(message(false, 'Please enter username and reset code'))
    }
  },
  resetPass: async function (req, res) {
    const { resetCode } = req.query
    const { password, confirmPass, username } = req.body
    if (resetCode && username) {
      const checkUser = await UserModel.checkUsername(username)
      if (checkUser) {
        if (password === confirmPass) {
          const encryptPass = bcrypt.hashSync(password)
          if (await UserModel.forgotPassword(resetCode, encryptPass)) {
            await UserModel.deleteCode(username)
            res.send(message(true, 'Password has changed'))
          } else {
            res.send(message(false, 'failed to change password'))
          }
        } else {
          res.send(message(false, 'Your new password and confirm password not equal'))
        }
      } else {
        res.send(message(false, 'Username not found'))
      }
    } else {
      res.send(message(false, 'Please enter reset code and username'))
    }
  },
  updatePersonal: async function (req, res) {
    const id = req.user.id
    const { name, dateBirth, gender, phone } = req.body
    const infoUser = await UserDetailModel.getUserDetail(id)
    const newName = name || infoUser.full_name
    const newBirth = dateBirth || infoUser.date_birth
    const newPhone = phone || infoUser.phone
    const Gender = gender || infoUser.gender
    const result = await UserDetailModel.updateUserDetail(newName, newBirth, Gender, newPhone, id)
    if (result) {
      res.send(message(true, 'Profile updated'))
    } else {
      res.send(message(false, 'Profile cant updated'))
    }
  },
  updatePict: async function (req, res) {
    console.log(req.file)
    const id = req.user.id
    const picture = (req.file && req.file.filename) || null
    await UserDetailModel.updatePicture(picture, id)
    res.send(message(true, 'photo updated'))
  },
  addAddress: async function (req, res) {
    const id = req.user.id
    const { city, postcode, street, district, idCity } = req.body
    const infoUserDetail = await UserDetailModel.getUserDetail(id)
    if (city && postcode && street && district) {
      await AddressModel.createAddress(infoUserDetail.id, city, postcode, district, street, idCity)
      res.send(message(true, 'Address added'))
    } else {
      res.send(message(false, 'Please fill the all input'))
    }
  },
  createTransaction: async function (req, res) {
    try {
      console.log(req.user)
      const id = req.user.id
      const email = req.user.email
      const invoiceNumber = uuid()
      const newInvoiceNumber = invoiceNumber.substring(0, 8)
      const { totalPrice, postalFee, Product } = req.body
      const infoBalance = await UserDetailModel.getUserDetail(id)
      const newBalance = infoBalance.balance - totalPrice
      console.log(newBalance)
      if (newBalance > 0) {
        await UserDetailModel.updateBalance(id, newBalance)
        const idTrans = await TransactionModel.createTransaction(id, totalPrice, postalFee, newInvoiceNumber)
        // console.log('IdTrans is : ', idTrans)
        await TransactionModel.updateStatusTransaction(idTrans, 1)
        const insertDataProducts = async () => {
          const insert = Product.map(async data => {
            await TransactionDetailModel.createTransactionDetails(idTrans, data.idProduct, data.price, data.quantity)
            await ProductModel.buy(data.quantity, data.idProduct)
          })
          const PromiseDone = Promise.all(insert)
          return PromiseDone
        }
        insertDataProducts().then(data => {})
        const infoTransaction = await TransactionModel.getTransactionById(idTrans)
        // console.log(infoTransaction)
        const infoUserDetail = await UserDetailModel.getUserDetail(infoTransaction.id_user)
        const infoTransactionDetail = await TransactionDetailModel.getTransactionJoinProduct(idTrans)
        const infoAddress = await AddressModel.getByidUserDetail(infoUserDetail.id)
        // console.log(infoUserDetail)
        const data = {
          infoTransactionDetail,
          newBalance,
        }
        res.send(message(true, data))
        // const date = JSON.stringify(infoTransaction.created_at)
        const date = infoTransaction.created_at.toUTCString()
        const street = JSON.stringify(infoAddress[0].street)
        const newDate = date.substring(0, 17)
        const dataInvoice = Invoice.mailInvoice(
          infoTransaction.invoice_number,
          newDate,
          street,
          infoUserDetail.full_name,
          email,
          infoTransactionDetail,
          infoTransaction.total_price
        )
        // console.log(newDate)
        Mail.sendMail(email, '[INVOICE]', dataInvoice)
      } else {
        res.send(message(false, 'Please top up your balance', newBalance))
      }
    } catch (err) {
      console.log(err)
    }
  },
  getAllProduct: async function (req, res) {
    let { page, limit, search, sort } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 5
    console.log(req.query, 'THIS IS QUERY')
    // let key = search && Object.keys(search)[0]
    // let value = search && Object.values(search)[0]
    search = (search && { key: search.key, value: search.value }) || { key: 'name', value: '' }
    // const key = sort && Object.keys(sort)[0]
    // const value = sort && Object.values(sort)[0]
    const { key, value } = sort
    sort = (sort && { key: key || 'products.id', value }) || { key: 'price', value: 1 }

    const conditions = { page, perPage: limit, search, sort }
    console.log(conditions)
    // res.send(message(true, 'true', data))
    const fetchTradeDetail = async () => {
      const results = await ProductModel.getAllProducts(conditions)
      // console.log(results)
      conditions.totalData = await ProductModel.getTotalProducts(conditions)
      conditions.totalPage = Math.ceil(conditions.totalData / conditions.perPage)
      delete conditions.search
      delete conditions.sort
      delete conditions.limit
      // const data = { data: results, pageInfo: conditions }
      if (results.length) {
        const promisess = results.map(async obj => {
          const infoSoldProduct = await TransactionDetailModel.countSoldProduct(obj.idProduct)
          console.log(infoSoldProduct)
          return { ...obj, soldProduct: Object.values(infoSoldProduct) }
        })
        const promiseDone = Promise.all(promisess)
        return promiseDone
      } else {
        res.send(message(false, 'You dont have any Transaction', results))
      }
    }
    // function end
    fetchTradeDetail()
      .then(data => {
        const finalData = { data: data, pageInfo: conditions }
        res.send(message(true, 'List Product', finalData))
      })
      .catch(err => {
        console.log(err)
      })
  },
  getProductByCategory: async function (req, res) {
    let { page, limit, search, sort } = req.query
    const { id } = req.params
    page = parseInt(page) || 1
    limit = parseInt(limit) || 5
    search = (search && { key: search.key, value: search.value }) || { key: 'id_category', value: '' }
    sort = (sort && { key, value }) || { key: 'price', value: 1 }
    const conditions = { page, perPage: limit, search, sort }
    const infoProduct = await ProductModel.getProductByCategory(id)
    conditions.totalData = await ProductModel.getTotalProducts(conditions)
    conditions.totalPage = Math.ceil(conditions.totalData / conditions.perPage)
    delete conditions.search
    delete conditions.sort
    delete conditions.limit
    if (infoProduct) {
      const data = { data: infoProduct, pageInfo: conditions }
      res.send(message(true, 'Total product', data))
    } else {
      res.send(message(false, 'Total product', data))
    }
  },
  getProfileDetail: async function (req, res) {
    const id = req.user.id
    console.log(req.user)
    const infoDetail = await UserModel.ProfileDetail(id)
    // console.log(infoDetail)
    const userDetail = await UserDetailModel.getUserDetail(id)
    // console.log(userDetail)
    const address = await AddressModel.getByidUserDetail(userDetail.id)
    // console.log(address)
    infoDetail.address = address
    res.send(message(true, infoDetail))
  },
  getTransactionByUser: async function (req, res) {
    try {
      const id = req.user.id
      let { page, limit, search, sort } = req.query
      page = parseInt(page) || 1
      limit = parseInt(limit) || 5
      search = (search && { key: search.key, value: search.value }) || { key: 'receipt_number', value: '' }
      sort = (sort && { key: sort.key, value: sort.value }) || { key: 'id', value: 1 }
      const conditions = { page, perPage: limit, search, sort }
      // console.log(conditions)
      const fetchTradeDetail = async () => {
        const results = await TransactionModel.getTransactionByUser(id, conditions)
        conditions.totalData = await TransactionModel.getTotalTransactionByUser(id, conditions)
        conditions.totalPage = Math.ceil(conditions.totalData / conditions.perPage)
        delete conditions.search
        delete conditions.sort
        delete conditions.limit
        if (results.length) {
          const promisess = results.map(async obj => {
            const infoTradeDetail = await TransactionDetailModel.getTransactionJoinProduct(obj.id)
            return { ...obj, transactionDetail: infoTradeDetail }
          })
          const promiseDone = Promise.all(promisess)
          return promiseDone
        } else {
          res.send(message(false, 'You dont have any Transaction', results))
        }
      }
      // function end
      fetchTradeDetail()
        .then(data => {
          const finalData = { data: data, pageInfo: conditions }
          res.send(message(true, 'Your transactions', finalData))
        })
        .catch(err => {
          console.log(err)
        })
    } catch (error) {
      console.log(error)
    }
  },
}
