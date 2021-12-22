const pool = require('../helpers/database')
const express = require('express')
const router = express.Router()
require('dotenv').config()
const verifyJWT = require('./verifyToken')

router.get('/pcs', verifyJWT, async function (req, res) {
  try {
    const sqlQuery = 'SELECT idPc, user_name FROM pcs Where idUser=?'
    const rows = await pool.query(sqlQuery, [req.userId.id])
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/dashboard', verifyJWT, async function (req, res) {
  try {
    const sqlQuery = `SELECT pcs.idPc, ram.percent_virtual, Max(ram.id) FROM pcs INNER JOIN ram ON pcs.idPc=ram.idPc WHERE pcs.idUser=? GROUP BY pcs.idPc;
                          SELECT pcs.idPc, cpu.cpu_percent, Max(cpu.id) FROM pcs INNER JOIN cpu ON pcs.idPc=cpu.idPc WHERE pcs.idUser=? GROUP BY pcs.idPc; 
                          SELECT pcs.idPc, battery.battery_percent, Max(battery.id) FROM pcs INNER JOIN battery ON pcs.idPc=battery.idPc WHERE pcs.idUser=? GROUP BY pcs.idPc;
                          SELECT pcs.idPc, storage.total_storage, storage.used_storage, Max(storage.id) FROM pcs INNER JOIN storage ON pcs.idPc=storage.idPc WHERE pcs.idUser=? GROUP BY pcs.idPc;`
    const rows = await pool.query(sqlQuery, [req.userId.id, req.userId.id, req.userId.id, req.userId.id])
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/ram', verifyJWT, async function (req, res) {
  try {
    const sqlQuery = 'SELECT pcs.idPc, ram.test_date, ram.total_virtual, ram.percent_virtual, ram.total_swap FROM pcs INNER JOIN ram ON pcs.idPc=ram.idPc WHERE pcs.idUser =? ORDER BY ram.id ASC;'
    const rows = await pool.query(sqlQuery, req.userId.id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/battery', verifyJWT, async function (req, res) {
  try {
    const sqlQuery = 'SELECT pcs.idPc, battery.test_date, battery.battery_percent FROM pcs INNER JOIN battery ON pcs.idPc=battery.idPc WHERE pcs.idUser =? ORDER BY battery.id ASC;'
    const rows = await pool.query(sqlQuery, req.userId.id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})
router.get('/cpu', verifyJWT, async function (req, res) {
  try {
    const sqlQuery = 'SELECT pcs.idPc, cpu.test_date, cpu.cpu_percent FROM pcs INNER JOIN cpu ON pcs.idPc=cpu.idPc WHERE pcs.idUser =? ORDER BY cpu.id ASC;'
    const rows = await pool.query(sqlQuery, req.userId.id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/storage', verifyJWT, async function (req, res) {
  try {
    const sqlQuery = 'SELECT pcs.idPc, storage.test_date, storage.total_storage, storage.used_storage FROM pcs INNER JOIN storage ON pcs.idPc=storage.idPc WHERE pcs.idUser =? ORDER BY storage.id ASC;'
    const rows = await pool.query(sqlQuery, req.userId.id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
