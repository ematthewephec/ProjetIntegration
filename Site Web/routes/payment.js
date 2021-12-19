const pool = require('../helpers/database')
const express = require('express')
const router = express.Router()
require('dotenv').config()
const verifyJWT = require('./verifyToken')
const stripe = require('stripe')(process.env.PUBLISH_KEY_STRIPE)
const uuidv4 = require('uuid/v4')

router.post('/payment', verifyJWT, (req, res) => {
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
    .then(res.status(200).send({ result: product, user: req.userId }))
    .catch(err => console.log(err))
})

router.post('/NewOrder', verifyJWT, async function (req, res) {
  try {
    const { idUser, prix, type } = req.body
    const sqlQuery = 'INSERT INTO commande (idUser, test_date, prix) VALUES (?,?,?)'
    const result = await pool.query(sqlQuery, [idUser, '10/12/2021', prix])
    if (res.status(200)) {
      if (prix === 60000) {
        const sqlQuery = 'INSERT INTO produit (idCom, test_date, prix, type) VALUES (?,?,?,?)'
        const result1 = await pool.query(sqlQuery, [result.insertId, '10/12/2021', prix - 50, type])
        const sqlQuery2 = 'INSERT INTO produit (idCom, test_date, prix, type) VALUES (?,?,?,?)'
        const result2 = await pool.query(sqlQuery2, [result.insertId, '10/12/2021', prix, type])
        res.status(200).json({ produitid1: result1.insertId, produitid2: result2.insertId })
      } else {
        const sqlQuery = 'INSERT INTO produit (idCom, test_date, prix, type) VALUES (?,?,?,?)'
        const result1 = await pool.query(sqlQuery, [result.insertId, '10/12/2021', prix, type])
        res.status(200).json({ produitid: result1.insertId })
      }
    }
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
