const express = require( 'express' )
const router = express.Router()
const { check, validationResult } = require( 'express-validator' )
const gravatar = require( 'gravatar' )
const bcrypt = require( 'bcryptjs' )

//Models
const User = require( '../../models/User' )

/*
?   @param GET api/users
?   @desc Normally you would get a list oif users, im using it to test the endpoint
?   @access Public
*/
router.get( '/', ( req, res ) => {
  res.status( 200 ).json( {
    msg: "Users API is working"
  } )
} )

/*
?   @param POST api/users
?   @desc register a user
?   @access Public
*/
router.post( '/', [
  check( 'name', 'Name is required' ).not().isEmpty(),
  check( 'email', 'Please enter a valid email' ).isEmail(),
  check( 'password', 'Please enter a password with 6 or more characters' ).isLength( { min: 6 } )
], async ( req, res ) => {
  const errors = validationResult( req )

  //? Form Validation
  if ( !errors.isEmpty() ) {
    return res.status( 400 ).json( { errors: errors.array() } )
  }

  const { name, email, password } = req.body

  // ? Main function for user registration
  try {
    //* check if a user exits
    let user = await User.findOne( { email } )

    if ( user ) {
      return res.status( 400 ).json( { errors: [ { msg: "User already registered" } ] } )
    }

    //? check if user has a gravatar
    const avatar = gravatar.url( email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    } )

    user = new User( {
      name,
      email,
      avatar,
      password
    } )

    const salt = await bcrypt.genSalt( 10 )

    //? hash the password
    user.password = await bcrypt.hash( password, salt )

    //? save the user
    await user.save()

    res.send( 'User Registered' )

  } catch ( err ) {
    console.log( err.message )
    res.status( 500 ).send( 'Server Error' )
  }

} )

module.exports = router
