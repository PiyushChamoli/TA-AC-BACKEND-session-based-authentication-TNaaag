var express = require('express');
var router = express.Router();
var User = require('../models/User')


router.get('/', (req,res,next) => {
  res.send('Welcome to All Users')
})

router.get('/register', (req,res,next) => {
  res.render('userRegisterForm')
})

router.post('/register', (req,res,next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err)
    console.log('CreatedUser: ', user)
    res.send('User Created!')
  })
})

module.exports = router;
