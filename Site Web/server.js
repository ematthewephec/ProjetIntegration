const express = require('express')
const path = require('path')
const cors = require('cors')
const config = require('./config/auth.conf')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const userRouter = require('./routes/user')
const shopRouter = require('./routes/payment')
const mailRouter = require('./routes/mail')
require('dotenv').config()
const api = require('./routes/api')
const PORT = process.env.PORT || 5000
const app = express()
app.use(express.json())
app.use(cors({
  origin: ['http://checkpcs.com/api'],
  methods: ['GET', 'POST'],
  credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session(config))

if (process.env.NODE_ENV === 'dev') {
  app.use(express.static('client/build'))
}
/*
async function hash(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(8).toString('hex')

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err)
      resolve(salt + ':' + derivedKey.toString('hex'))
    })
  })
}
async function verify(password, hash) {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':')
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err)
      resolve(key === derivedKey.toString('hex'))
    })
  })
}
*/

// Routes

app.use('/api/resource', api)
app.use('/api/user', userRouter)
app.use('/api/shop', shopRouter)
app.use('/api/mail', mailRouter)

if (process.env.NODE_ENV === 'dev') {
  app.get('/*', (_, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`le serveur est lancé sur le port : ${PORT}`)
})
