const express = require('express')
const router = express.Router()

//@route -> api/profile
//@desc -> test route
//@access -> Public
router.get('/', (req, res) => res.send('Profile Route'))

module.exports = router
