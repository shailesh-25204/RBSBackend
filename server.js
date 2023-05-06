require('dotenv').config()
const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

//Database Connection
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))


// Middleware
app.use(express.json())

// Routes 
app.use('/api/train', require('./routes/train'))
app.use('/api/auth-user', require('./routes/auth-user'))
app.use('/api/booking', require('./routes/booking'))

// app.get('/users', authenticateToken,  (req,res) => {
//     console.log(req.user.name)
//     res.json(users.filter(user => user.name === req.user.name))
// })

app.post('/users', async(req,res) => {
    try {
        const hashed_password = await bcrypt.hash(req.body.password, 10)
        const user = {"name": req.body.username, "password": hashed_password, "age": req.body.age || 21}
        users.push(user)
        res.status(201).send()
    } catch (e) {

        res.status(500).send("in ")
    }

})




app.listen(3000, () => console.log("Server has started at 3000"))