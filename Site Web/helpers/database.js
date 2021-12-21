const mariadb = require('mariadb')
require('dotenv').config()
const pool = mariadb.createPool({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORDDB,
  database: process.env.DATABASE,
  port: process.env.PORTDB,
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
  multipleStatements: true
})

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('DATABASE CONNECTION LOST')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('DATABASE TO MANY CONNECTION')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('DATABASE CONNECTION REFUSED')
    }
  }
  if (connection) {
    connection.release()
  }
})

module.exports = pool
