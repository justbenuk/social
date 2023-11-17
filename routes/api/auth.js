const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
//@route -> api/auth
//@desc -> test route
//@access -> Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

/*
?   @param POST api/auth
?   @desc authenticate the user and get the token
?   @access Public
*/
router.post('/', [
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Please enter your password').exists()
], async (req, res) => {
  const errors = validationResult(req)

  //? Form Validation
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  // ? Main function for user registration
  try {
    //* check if a user exits
    let user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] })
    }

    //compare the passwords
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" })
    }

    // asign a token
    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload,
      process.env.JWTSECRET,
      // TODO: Change back to 3600 in prodution
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err
        res.json({ token })
      })

  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }

})

module.exports = router
