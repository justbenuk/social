const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function(req, res, next) {
  //get the token from the header
  const token = req.header('x-auth-token')

  //check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No Token, Authorisation Denied' })
  }

  //verify token
  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET)

    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Not Authorised' })
  }
}
