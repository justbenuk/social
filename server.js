const express = require('express');
const connectDB = require('./config/db')

// start express and connect db
const app = express();
connectDB()

//init middleware
app.use(express.json({extended: false}))

//defined routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/auth', require('./routes/api/auth'))
const PORT = process.env.PORT || 5000;

//routes
app.get('/', (req, res) => res.send('API Running'))
app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
