const express = require('express')
const router = express.Router()

require('dotenv').config()
const pool = require('../helpers/database')

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

module.exports = router
