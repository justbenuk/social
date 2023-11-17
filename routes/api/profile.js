const express = require('express')
const request = require('request')
require('dotenv').config()
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')

//@route -> GETR api/profile/me
//@desc -> get user profile
//@access -> Private
router.get('/me', auth, async (req, res) => {
  try {

    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])

    //check if no profile
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }

    res.json(profile)

  } catch (err) {
    console.error(err.message)
    res.status(500).json('Server Error')
  }
})

//@route -> POST api/profile
//@desc -> create or update the user profile
//@access -> Private
router.post('/', [auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Atleast one skill is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)

  //check for erros
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  //destructure the req
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body

  //build the profile
  const profileFields = {}

  //link the user to the profile
  profileFields.user = req.user.id

  //link all the other fields
  if (company) profileFields.company = company
  if (website) profileFields.website = website
  if (location) profileFields.location = location
  if (bio) profileFields.bio = bio
  if (status) profileFields.status = status
  if (githubusername) profileFields.githubusername = githubusername

  //change skills into an array
  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim())
  }

  //build social object
  profileFields.social = {}
  if (youtube) profileFields.social.youtube = youtube
  if (twitter) profileFields.social.twitter = twitter
  if (facebook) profileFields.social.facebook = facebook
  if (linkedin) profileFields.social.linkedin = linkedin
  if (instagram) profileFields.social.instagram = instagram

  try {
    let profile = await Profile.findOne({ user: req.user.id })

    //if there is a profile we need to update it
    if (profile) {
      profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })

      return res.json(profile)
    }
    // create
    profile = new Profile(profileFields)

    //save
    await profile.save()

    res.json(profile)

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg: 'Server Error' })
  }
})

//@route -> GET api/profile
//@desc -> get all profiles
//@access -> Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg: 'Server Error' })
  }

})

//@route -> GET api/profile/user/:user_id
//@desc -> get the profile of a user
//@access -> Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' })
    }
    res.json(profile)
  } catch (err) {
    console.error(err.message)

    //check error, if no user id
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' })
    }
    res.status(500).json({ msg: 'Server Error' })
  }

})

//@route -> DELET api/profile
//@desc -> delete profile, user and posts
//@access -> Private
router.delete('/', auth, async (req, res) => {
  try {
    // remove users profile
    await Profile.findOneAndDelete({ user: req.user.id })
    //remove user 
    await User.findOneAndDelete({ _id: req.user.id })
    // TODO: remove users posts
    res.json({ msg: 'User deleted' })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg: 'Server Error' })
  }

})

//@route -> PUT api/profile/experiance
//@desc -> add expirence to a users profile
//@access -> Private
router.put('/experience', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  //destructure the body
  const { title, company, location, from, to, current, description } = req.body

  const newEXP = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  try {
    //fetch the profile to add experiance to
    const profile = await Profile.findOne({ user: req.user.id })

    //push new experiance on to array
    profile.experience.unshift(newEXP)

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg: 'Server Error' })
  }
})

//@route -> DELETE api/profile/experiance/:exp_id
//@desc -> delete an experiance item
//@access -> Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    //get the remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

    profile.experience.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg: 'Server Error' })
  }
})

//@route -> PUT api/profile/education
//@desc -> add education to a users profile
//@access -> Private
router.put('/education', [auth, [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),
  check('fieldofstudy', 'Field Of Study is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  //destructure the body
  const { school, degree, fieldofstudy, from, to, current, description } = req.body

  const newEDU = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }

  try {
    //fetch the profile to add experiance to
    const profile = await Profile.findOne({ user: req.user.id })

    //push new experiance on to array
    profile.education.unshift(newEDU)

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg: 'Server Error' })
  }
})

//@route -> DELETE api/profile/experiance/:exp_id
//@desc -> delete an experiance item
//@access -> Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    //get the remove index
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

    profile.education.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg: 'Server Error' })
  }
})

//@route -> GET api/profile/github/:username
//@desc -> get the hithub repos from the user
//@access -> Public
router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUBID}&client_secret=${process.env.GITHUBSECRET}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    }

    request(options, (error, response, body) => {
      if(error) console.error(error)

      if(response.statusCode !== 200){
        return res.status(404).json({msg: 'Profile Not Found'})
      }

      res.json(JSON.parse(body))
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg: 'Server Error' })
  }
})
module.exports = router
