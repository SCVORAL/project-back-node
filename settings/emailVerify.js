const nodemailer = require('nodemailer')
const config = require('config')
const bcrypt = require('bcrypt')
const {db} = require('./db')

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.get("email"),
    pass: config.get("emailPassword"),
  },
})

let sendEmailVerify = async (email) => {

  var verificationCode = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for ( var i = 0; i < 5; i++ ) {
    verificationCode += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  await db.EmailVerify.create({
    email,
    code: verificationCode
  })

  let result = await transporter.sendMail({
    from: config.get("email"),
    to: email,
    subject: 'Message from Node js',
    html:
      `<div>Code: ${verificationCode}</div>`,
  })

  return true
}

module.exports = {transporter, sendEmailVerify}