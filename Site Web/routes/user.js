const express = require('express')
const router = express.Router()
require('dotenv').config()
const pool = require('../helpers/database')
const verifyJWT = require('./verifyToken')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
/*
router.get('/:id', async function (req, res) {
  try {
    const sqlQuery = 'SELECT id, email, password, role FROM users WHERE id=?'
    const rows = await pool.query(sqlQuery, req.params.id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }

  res.status(200).json({ id: req.params.id })
})
*/
router.get('/Logout', verifyJWT, (req, res) => {
  req.session = null
  res.redirect('/Login')
})

router.get('/Forgot/:mail', async function (req, res) {
  try {
    console.log(req.params.mail)
    const sqlGetUser = 'SELECT id, password, role, email FROM users where email=?;'
    const rows = await pool.query(sqlGetUser, req.params.mail)

    if (rows.length > 0) {
      const id = rows[0].id
      let isAdmin = false
      if (rows[0].role === 'Admin') {
        isAdmin = true
      }
      const accessToken = jwt.sign({ id: id, isAdmin: isAdmin }, process.env.TOKEN_SECRET, {
        expiresIn: '15m'
      })
      req.session.user = rows
      res.json({ result: rows, accessToken: accessToken, valid: true })
    } else {
      res.json({ message: 'wrong username/password', valid: false })
    }
    // res.status(200).send(`User with id ${username} was not found`)
  } catch (error) {
    res.status(400).send(error.message)
    res.json({ message: 'no user exits', valid: false })
  }
})

router.post('/NewPassword', verifyJWT, async function (req, res) {
  try {
    const { password } = req.body
    // const salt = await getRandomBytes(32)
    // const encryptedPassword = await argon2i.hash(password, salt)
    // const encryptedPassword = await hash(password)
    const encryptedPassword = await bcrypt.hash(password, saltRounds)

    const sqlQuery = 'UPDATE users SET password=? Where id=?;'
    const result = await pool.query(sqlQuery, [encryptedPassword, req.userId.id])

    res.status(200).json({ userId: result })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/isUserAuth', verifyJWT, (req, res) => {
  res.send({ user: req.userId })
})
function generateAccessToken (user) {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1440m' })
}
let refreshTokens = []

function generateRefreshToken (user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '40m' })
  refreshTokens.push(refreshToken)
  return refreshToken
}
router.post('/Login', async function (req, res) {
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
      const accessToken = generateAccessToken({ id: id, isAdmin: isAdmin })
      const refreshToken = generateRefreshToken({ id: id, isAdmin: isAdmin })
      /*
      const accessToken = jwt.sign({ id: id, isAdmin: isAdmin }, process.env.TOKEN_SECRET, {
        expiresIn: 300
      })
      const refreshToken = jwt.sign({ id: id, isAdmin: isAdmin }, process.env.TOKEN_SECRET, {
        expiresIn: 300
      })
      */
      req.session.user = rows
      res.json({ auth: isValid, result: rows, accessToken: accessToken, refreshToken: refreshToken })
    } else {
      res.json({ auth: false, message: 'wrong username/password' })
    }
    // res.status(200).send(`User with id ${username} was not found`)
  } catch (error) {
    res.status(400).send(error.message)
    res.json({ auth: false, message: 'no user exits' })
  }
})

router.post('/refreshToken', (req, res) => {
  if (!refreshTokens.includes(req.body.token)) {
    res.status(400).send('Refresh Token Invalid')
  }
  const rows = req.session.user
  const id = rows[0].id
  let isAdmin = false
  if (rows[0].role === 'Admin') {
    isAdmin = true
  }
  refreshTokens = refreshTokens.filter((c) => c !== req.body.token)
  const accessToken = generateAccessToken({ id: id, isAdmin: isAdmin })
  const refreshToken = generateRefreshToken({ id: id, isAdmin: isAdmin })
  res.json({ auth: true, result: rows, accessToken: accessToken, refreshToken: refreshToken })
})

router.get('/Login', (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user })
  } else {
    res.send({ loggedIn: false, user: [{ role: 'visitor' }] })
  }
})
router.post('/Register', async function (req, res) {
  try {
    const { username, password, email, nom, prenom } = req.body
    // const salt = await getRandomBytes(32)
    // const encryptedPassword = await argon2i.hash(password, salt)
    // const encryptedPassword = await hash(password)
    const encryptedPassword = await bcrypt.hash(password, saltRounds)
    const sqlQuery = 'INSERT INTO users (username, password, email, nom, prenom, role) VALUES (?,?,?,?,?,?)'
    const result = await pool.query(sqlQuery, [username, encryptedPassword, email, nom, prenom, 'client'])

    res.status(200).json({ userId: result.insertId })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.post('/Register/Admin', verifyJWT, async function (req, res) {
  try {
    const { username, password, email, nom, prenom, passwordAdmin } = req.body
    if (passwordAdmin === process.env.PASSWORD_ADMIN) {
      const encryptedPassword = await bcrypt.hash(password, saltRounds)

      const sqlQuery = 'INSERT INTO users (username, password, email, nom, prenom, role) VALUES (?,?,?,?,?,?)'
      const result = await pool.query(sqlQuery, [username, encryptedPassword, email, nom, prenom, 'Admin'])
      res.status(200).json({ userId: result.insertId })
    } else {
      res.status(200).json({ auth: false })
    }
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
