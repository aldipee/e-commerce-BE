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
          // const checkEmail = await UserModel.checkEmail(email)
          // console.log(checkEmail)
          await UserDetailModel.createUserDetail(infoUser.id, fullname, phone)
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
  }
}
