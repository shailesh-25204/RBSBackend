require('dotenv').config()
const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const {users} = require('./server.js')

app.use(express.json())

let refreshTokens  = []

app.post('/users/token', (req,res) => {
    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,user) => {
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({name: user.name})
        res.json({accessToken: accessToken})
    })
})

app.delete('/logout', (req,res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/users/login', async (req,res) => {
    const user = users.find(user=> user.username = req.body.username)
    console.log(user)
    if(!user){
        return res.status(400).send("Cannot Find User")
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)){
            const username = req.body.username
            const client = {name: username}
            const accessToken = generateAccessToken(client)
            const refreshToken = jwt.sign(client,process.env.REFRESH_TOKEN_SECRET)
            refreshTokens.push(refreshToken)
            res.json({accessToken: accessToken, refreshToken: refreshToken})

        }
        else{
            res.send("Not Allowed")
        }
    } catch (e) {
        res.status(500).send(e)
    }
})

function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})

}


app.listen(4000)