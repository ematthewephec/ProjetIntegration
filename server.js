const express = require('express')
const path = require('path')
const mysql = require('mysql')

require('dotenv').config()

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())

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

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: process.env.PASSMYSQL,
  database: 'checkcomputer'
})
