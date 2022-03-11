var express = require('express')
var cookieParser = require('cookie-parser')

var app = express()

app.use(cookieParser())

app.use((req,res,next) => {
    res.cookie('name', 'piyush')
    next()
})

app.get('/', (req,res) => {
    res.send('Home Page')
})

app.get('/cookies', (req,res) => {
    res.json(req.cookies)
})

app.listen(3000, () => {
    console.log('server listening on port 3000')
})