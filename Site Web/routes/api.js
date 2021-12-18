const pool = require('../helpers/database')
const express = require('express')
const router = express.Router()

router.get('/:idpc/dashboard', async function (req, res) {
  const id = req.params.idpc

  try {
    const sqlQuery = `SELECT percent_virtual FROM ram Where id = (SELECT MAX(id) FROM ram WHERE idPc = ?); 
                          SELECT cpu_percent FROM cpu Where id = (SELECT MAX(id) FROM cpu WHERE idPc = ?);
                          SELECT battery_percent FROM battery Where id = (SELECT MAX(id) FROM battery WHERE idPc = ?);
                          SELECT total_storage, used_storage FROM storage Where id = (SELECT MAX(id) FROM storage WHERE idPc = ?);`
    const rows = await pool.query(sqlQuery, [id, id, id, id])
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/:idpc/ram', async function (req, res) {
  const id = req.params.idpc

  try {
    const sqlQuery = 'SELECT test_date, total_virtual, percent_virtual, total_swap FROM ram Where idPc=? ORDER BY STR_TO_DATE(test_date, "%d/%m/%Y") ASC'
    const rows = await pool.query(sqlQuery, id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/:idpc/battery', async function (req, res) {
  const id = req.params.idpc

  try {
    const sqlQuery = 'SELECT test_date, battery_percent FROM battery Where idPc=? ORDER BY STR_TO_DATE(test_date, "%d/%m/%Y") ASC'
    const rows = await pool.query(sqlQuery, id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/:idpc/cpu', async function (req, res) {
  const id = req.params.idpc
  try {
    const sqlQuery = 'SELECT test_date, cpu_percent FROM cpu Where idPc=? ORDER BY STR_TO_DATE(test_date, "%d/%m/%Y") ASC'
    const rows = await pool.query(sqlQuery, id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/:idpc/storage', async function (req, res) {
  const id = req.params.idpc

  try {
    const sqlQuery = 'SELECT test_date, total_storage, used_storage FROM storage Where idPc=? ORDER BY STR_TO_DATE(test_date, "%d/%m/%Y") ASC'
    const rows = await pool.query(sqlQuery, id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
