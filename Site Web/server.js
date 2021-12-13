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

const api = require('./routes/api')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const pool = require('./helpers/database')
const saltRounds = 10
const stripe = require('stripe')(process.env.PUBLISH_KEY_STRIPE)
const uuidv4 = require('uuid/v4')

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
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

app.post('/Register', async function (req, res) {
  try {
    const { username, password, email, nom, prenom } = req.body

    const encryptedPassword = await bcrypt.hash(password, saltRounds)

    const sqlQuery = 'INSERT INTO users (username, password, email, nom, prenom, role) VALUES (?,?,?,?,?,?)'
    const result = await pool.query(sqlQuery, [username, encryptedPassword, email, nom, prenom, 'client'])

    res.status(200).json({ userId: result.insertId })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

const verifyJWT = (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token) {
    res.send({ auth: false, message: 'No token provided.' })
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: 'Failed to authenticate token.' })
      } else {
        req.userId = decoded
        next()
      }
    })
  }
}

app.get('/isUserAuth', verifyJWT, (req, res) => {
  res.send({ user: req.userId })
})

app.get('/Login', (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user })
  } else {
    res.send({ loggedIn: false, user: [{ role: 'visitor' }] })
  }
})

app.get('/Logout', verifyJWT, (req, res) => {
  req.session = null
  res.redirect('/Login')
})

app.post('/Login', async function (req, res) {
  try {
    const { username, password } = req.body

    const sqlGetUser = 'SELECT id, username, password, role FROM users WHERE username = ?;'
    const rows = await pool.query(sqlGetUser, username)
    if (rows.length > 0) {
      const isValid = await bcrypt.compare(password, rows[0].password)
      // res.status(200).json({ valid_password: isValid })
      const id = rows[0].id
      let isAdmin = false
      if (rows[0].role === 'Admin') {
        isAdmin = true
      }
      const token = jwt.sign({ id: id, isAdmin: isAdmin }, process.env.TOKEN_SECRET, {
        expiresIn: 300
      })
      req.session.user = rows
      res.json({ auth: isValid, token: token, result: rows })
    } else {
      res.json({ auth: false, message: 'wrong username/password' })
    }
    // res.status(200).send(`User with id ${username} was not found`)
  } catch (error) {
    res.status(400).send(error.message)
    res.json({ auth: false, message: 'no user exits' })
  }
})

app.post('/payment', (req, res) => {
  const { product, token } = req.body
  console.log('Product ', product)
  console.log('Price ', product.price)
  console.log('Price ', product.title)
  const idempontencyKey = uuidv4()
  return stripe.customers.create({
    email: token.email,
    source: token.id
  }).then(customer => {
    stripe.charges.create({
      amount: product.price * 100,
      currency: 'usd',
      customer: customer.id,
      receipt_email: token.email,
      description: 'Acheter la version' + product.title,
      shipping: {
        name: token.card.name,
        address: {
          country: token.card.address_country
        }
      }
    }, { idempontencyKey })
  })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err))
})

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

app.use('/api', api);

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})


app.post('/Register', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const email = req.body.email
  const nom = req.body.nom
  const prenom = req.body.prenom
  bcrypt.hash(password, saltRounds, (_err, hash) => {
    if (_err) {
      console.log(_err)
    }
    pool.query(
      'INSERT INTO users (username, password, email, nom, prenom, role) VALUE (?,?,?,?,?,?)',
      [username, hash, email, nom, prenom, 'client'],
      (err, result) => {
        console.log(err)
      }
    )
  })
})
const verifyJWT = (req, res, next) => {
  const token = req.header('x-access-token')
  if (!token) {
    res.send('on a besoin d un token')
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: 'vous n avez pas reussi a vous auth' })
      } else {
        req.userId = decoded.id
        next()
      }
    })
  }
}
app.get('/isUserAuth', verifyJWT, (req, res) => {
  res.send('tu est authentifié')
})

app.get('/Login', (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user })
  } else {
    res.send({ loggedIn: false })
  }
})
app.post('/Login', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  pool.query(
    'SELECT * FROM users Where username = ?;',
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err })
      }
      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (_error, response) => {
          if (response) {
            const id = result[0].id
            const token = jwt.sign({ id }, process.env.TOKEN_SECRET, {
              expiresIn: 300
            })
            req.session.user = result
            res.json({ auth: true, token: token, result: result })
          } else {
            res.json({ auth: false, message: 'mauvais password et username combinaison' })
          }
        })
      } else {
        res.json({ auth: false, message: 'pas de user connu' })
      }
    }
  )
})

app.use('/user', userRouter)

app.listen(PORT, () => {
  console.log(`le serveur est lancé sur le port : ${PORT}`)
})
