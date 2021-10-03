const express = require('express')
require('dotenv').config()
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())

app.get('/api/youtube', (_,res) => {
    res.send({
        msg: 'HELLO le MONDE' 
    })
})

app.listen(PORT, () => {
    console.log(`le serveur est lancé sur le port : ${PORT}`)
})