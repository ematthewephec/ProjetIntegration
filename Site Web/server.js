const express = require('express')
const path = require('path')
const mysql = require('mysql2')
const cors = require('cors')
const bcrypt = require('bcrypt')
const saltRounds = 10
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(cors({
  origin: ['http://localhost:5000'],
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

app.get('/api/teste', (_, res) => {
  res.send({
    msg: 'HELLO le MONDES'
  })
})

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})
app.listen(PORT, () => {
  console.log(`le serveur est lancé sur le port : ${PORT}`)
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
    db.query(
      'INSERT INTO users (username, password, email, nom, prenom) VALUE (?,?,?,?,?)',
      [username, hash, email, nom, prenom],
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
  db.query(
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
const db = mysql.createConnection({
  user: process.env.USER,
  host: process.env.HOST,
  password: process.env.PASSWORDDB,
  database: process.env.DATABASE
})
