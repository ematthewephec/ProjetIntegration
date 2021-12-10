const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const userRouter = require('./routes/user')
const nodemailer = require('nodemailer')
const fetch = require('node-fetch')
require('dotenv').config()

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  key: 'userId',
  secret: process.env.SECRETSESSION,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 24
  }
}))

app.use(express.static('client/build'))

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

app.post('/api/mail', async (req, res) => {
  const human = await validateHuman(req.body.isVerif)

  if (exports.validateEmail(req.body.email) && req.body.name !== '' && req.body.message !== '' && human) {
    const transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS
      }
    })

    const mailOptions = {
      from: req.body.email,
      to: process.env.MAIL,
      subject: 'Email de : ' + req.body.name,
      text: req.body.message
    }

    transporter.sendMail(mailOptions)
    res.send('success')
  } else {
    res.send('error')
  }
})

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

app.use('/user', userRouter)

app.listen(PORT, () => {
  console.log(`le serveur est lancé sur le port : ${PORT}`)
})
