const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const uuid = require('uuid').v4

const UserModel = require('../models/User')
const UserDetailModel = require('../models/UserDetail')
const TransactionModel = require('../models/Transaction')
const TransactionDetailModel = require('../models/TransactionDetails')
const ProductModel = require('../models/Products')
const ProductDetailModel = require('../models/ProductDetails')
const AddressModel = require('../models/Address')
const Mail = require('../../utils/sendMail')
const SMS = require('../../utils/sendSMS')

function message (success, msg, data) {
  if (data) {
    return {
      success: success,
      msg: msg,
      data: data
    }
  } else {
    return {
      success: success,
      msg: msg
    }
  }
}

module.exports = {
  registerUser: async function (req, res) {
    try {
      const { username, password, fullname, email, phone } = req.body
      if (username && password && fullname && email && phone) {
        const checkUser = await UserModel.checkUsername(username)
        if (checkUser !== 0) {
          res.send(message(false, 'Username already exists'))
        } else {
          const encryptPass = bcrypt.hashSync(password)
          const resultUser = await UserModel.createUser(
            username,
            encryptPass,
            email
          )
          const infoUser = await UserModel.getUserByUsername(username)
          await UserDetailModel.createUserDetail(infoUser.id, fullname, phone)
          console.log(infoUser)
          if (resultUser) {
            if (await UserModel.createVerificationCode(infoUser.id, uuid())) {
              const code = await UserModel.getVerificationCode(username)
              Mail.sendMail(email, code.verification_code)
              res.send(
                message(true, `Verification code: ${code.verification_code}`)
              )
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
          res.send(message(true, 'Account has been activate'))
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
        // console.log(infoUser)
        // console.log(infoUser.password)
        // console.log(password)
        const checkPassword = bcrypt.compareSync(password, infoUser.password)
        console.log(checkPassword)
        const checkRegistered = await UserModel.checkRegistered(username)
        if (checkRegistered) {
          if (checkPassword) {
            const payload = {
              id: infoUser.id,
              username,
              roleId: infoUser.role_id
            }
            const options = { expiresIn: '15m' }
            const key = process.env.APP_KEY
            const token = jwt.sign(payload, key, options)
            res.send(message(true, 'Login Success', token))
          } else {
            res.send(message(false, 'Wrong password !'))
          }
        } else {
          res.send(message(false, 'Register first'))
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
        // const userDetail = await UserDetailModel.getUserDetail(userInfo.id)
        if (userInfo.is_registered === 1) {
          await UserModel.createVerificationCode(userInfo.id, uuid())
          const resetCode = await UserModel.getVerificationCode(userInfo.username)
          if (resetCode) {
            // SMS.sendSMS(resetCode.verification_code, userDetail.phone)
            res.send(message(true, `Reset code : ${resetCode.verification_code}`))
          } else {
            res.send(message(false, 'Reset code can\'t generate'))
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

    res.send(infoUser)
  },
  updatePict: async function (req, res) {
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
      const id = req.user.id
      const invoiceNumber = uuid()
      const newInvoiceNumber = invoiceNumber.substring(0, 8)
      const { totalPrice, postalFee, Product } = req.body
      const infoBalance = await UserDetailModel.getUserDetail(id)
      const newBalance = infoBalance.balance - totalPrice
      console.log(newBalance)
      if (newBalance > 0) {
        await UserDetailModel.updateBalance(id, newBalance)
        res.send(message(true, 'Success', newBalance))
        const idTrans = await TransactionModel.createTransaction(id, totalPrice, postalFee, newInvoiceNumber)
        for (let i = 0; i <= Product.length; i++) {
          await TransactionDetailModel.createTransactionDetails(idTrans, Product[i].idProduct, Product[i].price, Product[i].quantity)
          await ProductModel.buy(Product[i].quantity, Product[i].idProduct)
        }
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

    // let key = search && Object.keys(search)[0]
    // let value = search && Object.values(search)[0]
    search = (search && { key: search.key, value: search.value }) || { key: 'name', value: '' }
    // const key = sort && Object.keys(sort)[0]
    // const value = sort && Object.values(sort)[0]
    sort = (sort && { key, value }) || { key: 'price', value: 1 }
    const conditions = { page, perPage: limit, search, sort }
    const results = await ProductModel.getAllProducts(conditions)
    conditions.totalData = await ProductModel.getTotalProducts(conditions)
    conditions.totalPage = Math.ceil(conditions.totalData / conditions.perPage)
    delete conditions.search
    delete conditions.sort
    delete conditions.limit
    const data = { data: results, pageInfo: conditions }
    res.send(message(true, 'true', data))
  },
  getProfileDetail: async function (req, res) {
    const id = req.user.id
    const infoDetail = await UserModel.ProfileDetail(id)
    console.log(infoDetail)
    const userDetail = await UserDetailModel.getUserDetail(id)
    console.log(userDetail)
    const address = await AddressModel.getByidUserDetail(userDetail.id)
    console.log(address)
    infoDetail.address = address
    // const data = {
    //   infoDetail, userDetail, address
    // }
    res.send(message(true, infoDetail))
  },
  getTransactionByUser: async function (req, res) {
    try {
      const id = req.user.id
      let { page, limit, search, sort } = req.query
      page = parseInt(page) || 1
      limit = parseInt(limit) || 5
      search = (search && { key: search.key, value: search.value }) || { key: 'receipt_number', value: '' }
      sort = (sort && { key, value }) || { key: 'created_at', value: 1 }
      const conditions = { page, perPage: limit, search, sort }
      const fetchTradeDetail = async () => {
        const results = await TransactionModel.getTransactionByUser(id, conditions)
        conditions.totalData = await TransactionModel.getTotalTransactionByUser(id, conditions)
        conditions.totalPage = Math.ceil(conditions.totalData / conditions.perPage)
        delete conditions.search
        delete conditions.sort
        delete conditions.limit
        if (results.length) {
          const promisess = results.map(async obj => {
            const infoTradeDetail = await TransactionDetailModel.getTransactionDetailsByIdTransaction(
              obj.id
            )
            return { ...obj, transactionDetail: infoTradeDetail }
          })
          // wait to all promises complete
          const promiseDone = Promise.all(promisess)
          return promiseDone
        } else {
          // res.status(200).send({
          //   status: 'OK',
          //   message: 'User Dont HaveAny TRX'
          // })

          res.send(message(false, 'You dont have any Transaction', results))
        }
      }
      // Function END HERE
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
  }
}
