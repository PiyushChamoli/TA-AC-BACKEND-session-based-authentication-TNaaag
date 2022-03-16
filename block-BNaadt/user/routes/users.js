var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', (req,res,next) => {
  res.send('Welcome to All Users')
})

router.get('/register', (req,res,next) => {
  console.log(req.flash('error'))
  res.render('userRegisterForm')
})

router.get('/login', (req,res,next) => {
  res.render('userLogin')
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
    return res.redirect('/users/login')
  }

  // Find User
  User.findOne({ email }, (err,user) => {
    if(err) return next(err)

    // null handle
    if(!user) {
      return res.redirect('/users/login')
    }

    // Found user
    user.verifyPassword(password, (err,result) => {
      if(err) return next(err)

      // wrong password
      if(!result) {
        return res.redirect('/users/login')
      }

      // password match
      req.session.userId = user.id
      res.redirect('/users/dashboard')
    })
  })
})

// Register New User
router.post('/register', (req,res,next) => {
  var { email, password } = req.body
  if (password.length<4) {
    req.flash('error', 'Password should contain min 4 char')
    return res.redirect('/users/register')
  }
  User.create(req.body, (err,user) => {
    if (err) return next(err)
    res.redirect('/')
  })
})

// logout
router.get('/logout', (req,res) => {
  req.session.destroy()
  res.clearCookie('connect.sid')
  res.redirect('/users/login')
})

module.exports = router;
