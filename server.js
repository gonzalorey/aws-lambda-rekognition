var app = require('express')()

var lambda = require('./lambda.js')

const BUCKET_NAME = 'gonzalorey-test-bucket'
const IMAGE_NAME = 'elmo-face.jpg'

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/lambda', (req, res) => {
  lambda.parseImage(BUCKET_NAME, IMAGE_NAME, res)
})

app.listen(3000, () => {
  console.log('Listening on port 3000!')
})

app.use((err, req, res, next) => {
  console.error(err.stack)

  if(err) {
    res.status(500).send('Something broke!')
  }
})
