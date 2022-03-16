var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', (req,res,next) => {
  res.render('allUsers')
})

router.get('/register', (req,res,next) => {
  res.render('userRegister',{ error: req.flash('error')[0] })
})

router.get('/login', (req,res,next) => {
  res.render('userLogin', { error: req.flash('error')[0] })
})

router.post('/register', (req,res,next) => {
  User.create(req.body, (err,user) => {
    if (err) {

      // email registered before
      if(err.code === 11000) {
        req.flash('error', 'Email Registered Already')
        return res.redirect('/users/register')
      }

      // password less than 5
      if(err.name === 'ValidationError') {
        req.flash('error', err.message)
        return res.redirect('/users/register')
      }
    }
    res.redirect('/users')
  })
})

router.post('/login', (req,res,next) => {
  var { email,password } = req.body

  // email or password empty
  if (!email || !password) {
    req.flash('error', 'Email/Password is required')
    return res.redirect('/users/login')
  }

  // find User
  User.findOne({ email }, (err,user) => {
    if (err) return next(err)

    // null user
    if (!user) {
      req.flash('error', 'This email is not registered')
      return res.redirect('/users/login')
    }

    // user found
    user.verifyPassword(password, (err,result) => {
      if(err) return next(err)

      // password mismatch
      if (!result) {
        req.flash('error', 'Incorrect password')
        return res.redirect('/users/login')
      }

      //password match
      req.session.userId = user.id
      res.send('Login Successfull')
    })
  })
   
})

// logout
router.get('/logout', (req,res,next) => {
  req.session.destroy()
  res.clearCookie('connect.sid')
  res.redirect('/users')
})


module.exports = router;
