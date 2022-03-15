var express = require('express');
var router = express.Router();
var User = require('../models/User')


router.get('/', (req,res,next) => {
  res.send('Welcome to All Users')
})

router.get('/register', (req,res,next) => {
  res.render('userRegisterForm')
})

router.get('/login', (req,res,next) => {
  res.render('userLogin')
})

router.get('/dashboard', (req,res,next) => {
  console.log(req.session)
  res.send('Login Successfull')
})

router.post('/login', (req,res,next) => {
  var { email, password } = req.body
  
  // email or password field empty
  if (!email || !password) {
    res.redirect('/users/login')
  }

  // Finding User with Email
  User.findOne({ email }, (err,user) => {
    if (err) return next(err)

    // no user(null)
    if(!user) {
      return res.redirect('/users/login')
    }

    // user found
    user.verifyPassword(password, (err,result) => {
      if (err) return next(err)

      // wrong password
      if (!result) {
        return res.redirect('/users/login')
      }

      // correct password
      req.session.userId = user.id
      console.log('userId', user.id)
      res.redirect('/users/dashboard')
    })
  })
})

router.post('/register', (req,res,next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err)
    console.log('CreatedUser: ', user)
    res.redirect('/')
  })
})

module.exports = router;
