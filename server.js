var express = require('express')
var app = express()

// var lambda = require('./lambda.js');

app.get('/', function (req, res) {
  res.send('hello world')
})

app.post('/lambda', function (req, res) {
  res.send('POST request to the homepage')
})

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})
