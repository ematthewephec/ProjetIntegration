const express = require('express')
const path = require('path')
const mysql = require('mysql2')
const cors = require('cors')

require('dotenv').config()

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(cors())

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
  db.query(
    'INSERT INTO users (username, password, email, nom, prenom) VALUE (?,?,?,?,?)',
    [username, password, email, nom, prenom],
    (err, result) => {
      console.log(err)
    }
  )
})

app.post('/Login', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  db.query(
    'SELECT * FROM users Where username = ? AND password = ?',
    [username, password],
    (err, result) => {
      if (err) {
        res.send({ err: err })
      }
      if (result.length > 0) {
        res.send(result)
      } else {
        res.send({ message: 'mauvais username ou password' })
      }
    }
  )
})
const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: 'Tintin',
  database: 'checkcomputer'
})
