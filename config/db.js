const mongoose = require('mongoose')
const config = require('config')

// Get DB 
const db = config.get('mongoURI')

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
