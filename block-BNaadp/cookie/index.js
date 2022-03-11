var express = require('express')
var cookieParser = require('cookie-parser')

var app = express()

app.get('/', (req,res) => {
    res.send('Home Page')
})

app.listen(3000, () => {
    console.log('server listening on port 3000')
})