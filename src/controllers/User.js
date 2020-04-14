const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const uuid = require('uuid').v4

const UserModel = require('../models/User')
const UserDetailModel = require('../models/UserDetail')

function message (success, msg) {
  const data = {
    success: success,
    msg: msg
  }
  return data
}

module.exports = {
  registerUser: async function (req, res) {
    const { username, password, fullname, email, phone } = req.body
    if (username && password && fullname && email && phone) {
      const checkUser = await UserModel.checkUsername(username)
      if (checkUser !== 0) {
        res.send(message(false, 'Username already exists'))
      } else {
        const encryptPass = bcrypt.hashSync(password)
        const resultUser = await UserModel.createUser(username, encryptPass, email)
        const infoUser = await UserModel.getUserByUsername(username)
        await UserDetailModel.createUserDetail(infoUser.id, fullname, phone)
        if (resultUser) {
          if (await UserModel.createVerificationCode(infoUser.id, uuid())) {
            const code = await UserModel.getVerificationCode(username)
            res.send(message(true, `Verification code: ${code.verification_code}`))
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
  },
  activateUser: async function (req, res) {
    const { username, verifyCode } = req.body
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
            const payload = { id: infoUser.id, username, roleId: infoUser.role_id }
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
  }
}
