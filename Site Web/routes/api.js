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

/*

router.get('/:idpc/dashboard', verifyJWT, async function (req, res) {
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
router.get('/:idpc/battery', verifyJWT, async function (req, res) {
  const id = req.params.idpc

  try {
    const sqlQuery = 'SELECT test_date, battery_percent FROM battery Where idPc=? ORDER BY STR_TO_DATE(test_date, "%d/%m/%Y") ASC'
    const rows = await pool.query(sqlQuery, id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})
router.get('/:idpc/cpu', verifyJWT, async function (req, res) {
  const id = req.params.idpc
  try {
    const sqlQuery = 'SELECT test_date, cpu_percent FROM cpu Where idPc=? ORDER BY STR_TO_DATE(test_date, "%d/%m/%Y") ASC'
    const rows = await pool.query(sqlQuery, id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})
router.get('/:idpc/storage', verifyJWT, async function (req, res) {
  const id = req.params.idpc

  try {
    const sqlQuery = 'SELECT test_date, total_storage, used_storage FROM storage Where idPc=? ORDER BY STR_TO_DATE(test_date, "%d/%m/%Y") ASC'
    const rows = await pool.query(sqlQuery, id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/:idpc/ram', verifyJWT, async function (req, res) {
  const id = req.params.idpc

  try {
    const sqlQuery = 'SELECT test_date, total_virtual, percent_virtual, total_swap FROM ram Where idPc=? ORDER BY STR_TO_DATE(test_date, "%d/%m/%Y") ASC'
    const rows = await pool.query(sqlQuery, id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})
*/

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
    const sqlQuery = 'SELECT pcs.idPc, ram.test_date, ram.total_virtual, ram.percent_virtual, ram.total_swap FROM pcs INNER JOIN ram ON pcs.idPc=ram.idPc WHERE pcs.idUser =? ORDER BY STR_TO_DATE(ram.test_date, "%d/%m/%Y") ASC'
    const rows = await pool.query(sqlQuery, req.userId.id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/battery', verifyJWT, async function (req, res) {
  try {
    const sqlQuery = 'SELECT pcs.idPc, battery.test_date, battery.battery_percent FROM pcs INNER JOIN battery ON pcs.idPc=battery.idPc WHERE pcs.idUser =? ORDER BY STR_TO_DATE(battery.test_date, "%d/%m/%Y") ASC'
    const rows = await pool.query(sqlQuery, req.userId.id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})
router.get('/cpu', verifyJWT, async function (req, res) {
  try {
    const sqlQuery = 'SELECT pcs.idPc, cpu.test_date, cpu.cpu_percent FROM pcs INNER JOIN cpu ON pcs.idPc=cpu.idPc WHERE pcs.idUser =? ORDER BY STR_TO_DATE(cpu.test_date, "%d/%m/%Y") ASC;'
    const rows = await pool.query(sqlQuery, req.userId.id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/storage', verifyJWT, async function (req, res) {
  try {
    const sqlQuery = 'SELECT pcs.idPc, storage.test_date, storage.total_storage, storage.used_storage FROM pcs INNER JOIN storage ON pcs.idPc=storage.idPc WHERE pcs.idUser =? ORDER BY STR_TO_DATE(storage.test_date, "%d/%m/%Y") ASC'
    const rows = await pool.query(sqlQuery, req.userId.id)
    res.status(200).json(rows)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
