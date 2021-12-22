const jwt = require('jsonwebtoken')
const { TokenExpiredError } = jwt
require('dotenv').config()
/*
const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: 'Unauthorized! Access Token was expired!' })
  }

  return res.json({ auth: false, message: 'Failed to authenticate token.' })
}
*/
const verifyJWT = (req, res, next) => {
  const token = req.headers['x-access-token']
  console.log(token)
  if (!token) {
    res.send({ auth: false, message: 'No token provided.' })
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        // return catchError(err, res)
        res.json({ auth: false, message: 'Failed to authenticate token.', token: token })
      } else {
        req.userId = decoded
        next()
      }
    })
  }
}

module.exports = verifyJWT
