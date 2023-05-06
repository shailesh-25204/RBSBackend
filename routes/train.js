const express = require('express')
const router = express.Router()
const Train = require('../models/train')



  

router.post('/add', async (req,res) => {
    const newtrain = new Train({
        trainName: 'Rajdhani Express',
        trainNumber: 12345,
        journeyDate: new Date('2023-06-01'),
        journeyTime: '10:00 AM',
        acCoaches: [
          { capacity: 50 },
          { capacity: 50 }
        ],
        sleeperCoaches: [
          { capacity: 100 },
          { capacity: 100 },
          { capacity: 100 }
        ],
        source: 'New Delhi',
        destination: 'Mumbai',
        stops: [
          { stationName: 'Agra', arrivalTime: '12:00 PM', departureTime: '12:10 PM', duration: '10 minutes' },
          { stationName: 'Jaipur', arrivalTime: '2:00 PM', departureTime: '2:20 PM', duration: '20 minutes' },
          { stationName: 'Udaipur', arrivalTime: '4:30 PM', departureTime: '4:45 PM', duration: '15 minutes' }
        ]
      });
    try {
        const addedTrain = await newtrain.save()
        res.status(201).json(addedTrain)
    } catch (err) {
        res.status(400).json({message: err.message })
    }
})

module.exports = router