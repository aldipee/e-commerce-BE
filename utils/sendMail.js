require('dotenv').config()
var nodemailer = require('nodemailer')
const useremail = process.env.EMAIL
const passmail = process.env.PASS_MAIL

module.exports = {
  sendMail: function (sendTo, code) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: useremail,
        pass: passmail
      }
    })
    const mailOptions = {
      from: useremail, // sender address
      to: `${sendTo}`, // list of receivers
      subject: '[Verification Code]', // Subject line
      html: `<p>${code}</p>`// plain text body
    }

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info)
      }
    })
  }
}
