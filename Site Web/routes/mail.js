const express = require('express')
const router = express.Router()
require('dotenv').config()
const nodemailer = require('nodemailer')
const fetch = require('node-fetch')

exports.validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

async function validateHuman (token) {
  const secret = process.env.SECRET_KEY
  const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
      {
        method: 'POST'
      }
  )
  const data = await response.json()
  console.log('data :' + data.success)
  return data.success
}

router.post('/', async (req, res) => {
  console.log(req.body.data.name)
  const human = await validateHuman(req.body.data.isVerif)
  console.log('human: ' + human)
  if (exports.validateEmail(req.body.data.email) && req.body.data.name !== '' && req.body.data.message !== '' && human) {
    const transporter = nodemailer.createTransport({
      host: 'stmp.checkpcs.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS
      }
    })

    const mailOptions = {
      from: req.body.data.email,
      to: process.env.MAIL,
      subject: 'Email de : ' + req.body.data.name,
      text: req.body.data.message
    }
    console.log('mailOptions: ' + mailOptions)
    transporter.sendMail(mailOptions)
    console.log.log(transporter.sendMail(mailOptions))
    res.send('success')
  } else {
    console.log.log('error: ')
    res.send('error')
  }
})

module.exports = router
