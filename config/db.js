const mongoose = require('mongoose')
require('dotenv').config()
// Get DB 
const db = process.env.MONGOURI

//connect to the db
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true
    })
    console.log('MongoDB Connected')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

module.exports = connectDB
