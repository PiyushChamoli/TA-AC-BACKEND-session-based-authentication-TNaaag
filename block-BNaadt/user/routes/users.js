var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', (req,res,next) => {
  res.send('Welcome to All Users')
})

router.get('/register', (req,res,next) => {
  console.log(req.flash('error'))
  res.render('userRegisterForm', { error: req.flash('error')[0] })
})

router.get('/login', (req,res,next) => {
  res.render('userLogin', { error: req.flash('error')[0] })
})

router.get('/dashboard', (req,res,next) => {
  console.log(req.session)
  res.send('Login Successfull')
})

//Login User
router.post('/login', (req,res,next) => {
  var { email,password } = req.body

  //email or passsword field empty
  if (!email || !password) {
    req.flash('error', 'Email/password is required')
    return res.redirect('/users/login')
  }

  // Find User
  User.findOne({ email }, (err,user) => {
    if(err) return next(err)

    // null handle
    if(!user) {
      req.flash('error', 'This email is not registered')
      return res.redirect('/users/login')
    }

    // Found user
    user.verifyPassword(password, (err,result) => {
      if(err) return next(err)

      // wrong password
      if(!result) {
        req.flash('error', 'Incorrect password')
        return res.redirect('/users/login')
      }

      // password match
      req.session.userId = user.id
      console.log(req.session)
      res.redirect('/users/dashboard')
    })
  })
})

// Register New User
router.post('/register', (req,res,next) => {
  User.create(req.body, (err,user) => {
    if (err) {
      
      // email already registered
      if(err.code === 11000) {
        req.flash('error', 'this email is taken')
        return res.redirect('/users/register')
      }

      // password less than 4
      if (err.name === 'ValidationError') {
        req.flash('error', err.message)
        return res.redirect('/users/register')
      }
      return res.json({ err })
    }
    res.redirect('/')
  })
})

// logout
router.get('/logout', (req,res) => {
  req.session.destroy()
  res.clearCookie('connect.sid')
  res.redirect('/users')
})

module.exports = router;
