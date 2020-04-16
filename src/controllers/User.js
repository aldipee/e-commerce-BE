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
        console.log(infoUser)
        console.log(infoUser.password)
        console.log(password)
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
            res.send(message(true, `Token : ${token}`))
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
        if (userInfo.is_registered === 1) {
          await UserModel.createVerificationCode(userInfo.id, uuid())
          const resetCode = await UserModel.getVerificationCode(userInfo.username)
          if (resetCode) {
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
  updateProfile: async function (req, res) {
    const id = req.user.id
    const { name, dateBirth, gender, phone } = req.body
    const picture = (req.file && req.file.filename) || null
    const infoUser = await UserDetailModel.getUserDetail(id)
    const newName = name || infoUser.fullname
    const newBirth = dateBirth || infoUser.date_birth
    const newPhone = phone || infoUser.phone
    const newPhoto = picture || infoUser.photo

    if (gender && dateBirth) {
      const result = await UserDetailModel.updateUserDetail(newName, newBirth, gender, newPhone, newPhoto, id)
      if (result) {
        res.send(message(true, 'Profile updated'))
      } else {
        res.send(message(false, 'Profile cant updated'))
      }
    } else {
      res.send(message(false, 'Insert gender and your datebirth please'))
    }

    res.send(infoUser)
  },
  addAddress: async function (req, res) {
    const id = req.user.id
    const { city, postcode, street, district } = req.body
    const infoUserDetail = await UserDetailModel.getUserDetail(id)
    if (city && postcode && street && district) {
      await AddressModel.createAddress(infoUserDetail.id, city, postcode, district, street)
      res.send(message(true, 'Address added'))
    } else {
      res.send(message(false, 'Please fill the all input'))
    }
  },
  createTransaction: async function (req, res) {
    const id = req.user.id
    const { totalPrice, postalFee, Product } = req.body
    const idTrans = await TransactionModel.createTransaction(id, totalPrice, postalFee)
    for (let i = 0; i <= Product.length; i++) {
      await TransactionDetailModel.createTransactionDetails(idTrans, Product[i].id, 800000, Product[i].quantity)
      console.log(Product[i].id)
      await ProductModel.buy(Product[i].quantity, Product[i].id)
    }
    res.send(true, 'Transaction success')
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
  }
}
