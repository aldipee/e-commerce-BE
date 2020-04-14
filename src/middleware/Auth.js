const jwt = require('jsonwebtoken')

module.exports = {
  checkToken: function (req, res, next) {
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
      let tokenJwt = authorization.slice(7, authorization.length)
      try {
        tokenJwt = jwt.verify(tokenJwt, process.env.APP_KEY)
        if (tokenJwt) {
          req.user = tokenJwt
          next()
        } else {
          const data = {
            success: false,
            msg: 'Unauthorized'
          }
          res.send(data)
        }
      } catch (err) {
        const data = {
          success: false,
          msg: err.message
        }
        res.send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'Unknown Token'
      }
      res.send(data)
    }
  }
}
