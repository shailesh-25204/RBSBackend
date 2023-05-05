require('dotenv').config()
const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

app.use(express.json())
const users = []

app.get('/users', authenticateToken,  (req,res) => {
    console.log(req.user.name)
    res.json(users.filter(user => user.name === req.user.name))
})

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

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,client) => {
        if(err) res.sendStatus(403)
        req.user = client
        next()
    })
}


app.listen(3000)

module.exports = {users}