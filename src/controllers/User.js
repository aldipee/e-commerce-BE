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
  },
  
}
