require('dotenv').config()
var nodemailer = require('nodemailer')
const useremail = process.env.EMAIL
const passmail = process.env.PASS_MAIL

module.exports = {
  sendMail: function (sendTo, subject, bodyEmail) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: useremail,
        pass: passmail,
      },
    })
    // console.log('apaaja', bodyEmail)
    const mailOptions = {
      from: useremail, // sender address
      to: `${sendTo}`, // list of receivers
      subject: `${subject}`, // Subject line
      html: `${bodyEmail}`, // plain text body
    }

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info)
      }
    })
  },
}
