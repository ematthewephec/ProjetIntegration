const express = require('express')
const router = express.Router()
const pool = require('../helpers/database')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

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

router.get('/isUserAuth', verifyJWT, (req, res) => {
  res.send('tu est authentifié')
})

router.get('/:id', async function (req, res) {
  try {
    const sqlQuery = 'SELECT id, email, password, created_at FROM user WHERE id=?'
    const rows = await pool.query(sqlQuery, req.params.id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }

  res.status(200).json({ id: req.params.id })
})

router.post('/Register', async function (req, res) {
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

router.get('/Login', (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user })
  } else {
    res.send({ loggedIn: false })
  }
})

router.post('/Login', async function (req, res) {
  try {
    const { username, password } = req.body

    const sqlGetUser = 'SELECT * FROM users WHERE username=?'
    const rows = await pool.query(sqlGetUser, username)
    if (rows) {
      const isValid = await bcrypt.compare(password, rows[0].password)
      // res.status(200).json({ valid_password: isValid })
      const id = rows[0].id
      const token = jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: 300
      })
      req.session.user = rows
      res.json({ auth: isValid, token: token, result: rows })
    }
    // res.status(200).send(`User with id ${username} was not found`)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
