var app = require('express')()

var lambda = require('./lambda.js')

var multer = require('multer')
var upload = multer({ storage: multer.memoryStorage() })

const BUCKET_NAME = 'gonzalorey-test-bucket'
const IMAGE_NAME = 'elmo-face.jpg'

app.get('/', (req, res) => {
	res.send('hello world')
})

app.get('/lambda', (req, res) => {
	lambda.analyzeImage(BUCKET_NAME, IMAGE_NAME, res)
})

app.post('/lambda', upload.single('image'), (req, res) => {
	lambda.uploadImage(BUCKET_NAME, req.file, res)
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
