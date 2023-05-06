require('dotenv').config()
const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.post('/signup', async (req,res) => {
    try {
    const hashed_password = await bcrypt.hash(req.body.password, 10)
    const newUser = new User({
          username: req.body.username,
          givenName: req.body.givenName,
          address: req.body.address,
          email:req.body.email,
          info: req.body.info,
          phone: req.body.phone,
          hashed_password: hashed_password,
    })
        const addedUser = await newUser.save()
        res.status(201).json(addedUser)
    } catch (err) {
        res.status(400).json({message: err.message })
    }
})

router.post('/logout', authenticateToken,   async (req, res) => {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: 'Authorization fail!' });
      }
    //   console.log(req.user)
      const tokens = req.user.tokens;
  
      const newTokens = tokens.filter(t => t.token !== token);
  
      await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
      res.json({ success: true, message: 'Sign out successfully!' });
    }
  })

router.post('/login', async (req,res) => {
    try {
    const {username,password} = req.body
    const user = await User.findOne({username})
    if(!user){
        return res.status(400).send("Cannot Find User")
    }

        if(await bcrypt.compare(password, user.hashed_password)){
            const payload ={
                _id: user._id,
                givenName: user.givenName,
                email: user.email
            }
            const accessToken = generateAccessToken(payload)
            const refreshToken = jwt.sign(payload,process.env.JWT_TOKEN_SECRET, {expiresIn: '24h'})
            
            let oldtokens = user.tokens || []
            if(oldtokens.length){
                oldtokens = oldtokens.filter(t => {
                    const timeDif = (Date.now() - parseInt(t.signedAt)) / 1000
                    if(timeDif < 86400){
                        return t
                    }
                })
            }
            console.log({tokens: [ {token: refreshToken, signedAt: Date.now().toString() }]})
            await User.findByIdAndUpdate(user._id, {tokens: [...oldtokens,  {token: refreshToken, signedAt: Date.now().toString() }]})
            
            res.json({accessToken: accessToken, refreshToken: refreshToken})

        }
        else{
            res.send("Not Allowed")
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
})

function generateAccessToken(payload){
    return jwt.sign(payload,process.env.JWT_TOKEN_SECRET, {expiresIn: '1h'})
}

async function authenticateToken (req,res,next){

    let userid = undefined
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify(token,process.env.JWT_TOKEN_SECRET, async (err,payload) => {
        userid = payload._id
    })
    const user = await User.findById(userid)
    if (user == null) {
        return res.status(404).json({message: 'Cannot find'})
    }
    req.user = user
    next()
}

module.exports = router