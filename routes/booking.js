const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.post('/:trainId/:seatClass' , (req,res) => {
    res.send(req.params)
})

module.exports = router