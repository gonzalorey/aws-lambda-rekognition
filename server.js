var express = require('express');
var app = express();

var lambda = require('./lambda.js');

var multer = require('multer')
let upload = multer({ storage: multer.memoryStorage() })

app.get('/', (req, res) => {
  res.send('hello world');
});

app.post('/lambda', upload.single('image'), (req, res) => {
  lambda.parseImage(req, res);
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

app.use((err, req, res, next) => {
  console.error(err.stack)

  if(req.path == '/lambda' && !req.file) {
    res.status(400).send(`'image' parameter wrong or missing!`)
  } else {
    res.status(500).send('Something broke!')
  }
})
