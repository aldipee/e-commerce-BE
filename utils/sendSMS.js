require('dotenv').config()
module.exports = {
  sendSMS: function (body, sendTo) {
    const accountSSID = process.env.ACCOUNT_TWILIO
    const token = process.env.TOKEN_TWILIO

    const accountSid = accountSSID
    const authToken = token
    const client = require('twilio')(accountSid, authToken)

    client.messages
      .create({
        body: `Your reset code is: ${body}`,
        from: '+14154291587',
        to: sendTo
      })
      .then(message => console.log(message.sid))
  }
}
