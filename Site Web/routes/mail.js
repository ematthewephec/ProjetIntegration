const express = require('express')
const router = express.Router()
require('dotenv').config()
const nodemailer = require('nodemailer')
const fetch = require('node-fetch')
const verifyJWT = require('./verifyToken')

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
  return data.success
}

router.post('/', async (req, res) => {
  const human = await validateHuman(req.body.data.isVerif)
  if (exports.validateEmail(req.body.data.email) && req.body.data.name !== '' && req.body.data.message !== '' && human) {
    console.log('mail : ' + process.env.MAIL, process.env.MAIL_PASS)
    const transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net',
      port: 587,
      secure: false,
      auth: {
        user: 'contact@checkpcs.com',
        pass: process.env.MAIL_PASS
      }
    })

    const mailOptions = {
      from: req.body.data.email,
      to: 'contact@checkpcs.com',
      subject: 'Email de : ' + req.body.data.name,
      text: req.body.data.message
    }
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err)
      console.log(info)
    }
    )
    res.send('success')
  } else {
    console.log('error: ')
    res.send('error')
  }
})

router.post('/client', verifyJWT, async (req, res) => {
  if (exports.validateEmail(req.body.data.email) && req.body.data.name !== '' && req.body.data.message !== '') {
    console.log('mail : ' + process.env.MAIL, process.env.MAIL_PASS)
    const transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net',
      port: 587,
      secure: false,
      auth: {
        user: 'contact@checkpcs.com',
        pass: process.env.MAIL_PASS
      }
    })

    const mailOptions = {
      from: req.body.data.email,
      to: 'contact@checkpcs.com',
      subject: 'Email de : ' + req.body.data.name,
      text: req.body.data.message
    }
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err)
      console.log(info)
    }
    )
    res.send('success')
  } else {
    console.log('error: ')
    res.send('error')
  }
})

module.exports = router
