var app = require('express')()

var lambda = require('./lambda.js')

var multer = require('multer')
var upload = multer({ storage: multer.memoryStorage() })

const BUCKET_NAME = 'gonzalorey-test-bucket'
const IMAGE_NAME = 'elmo-face.jpg'

app.get('/', (req, res) => {
	res.send('hello world')
})

app.get('/lambda/handler', (req, res) => {
	var s3event = {
		'Records': [
			{
				'eventVersion': '2.0',
				'eventTime': '1970-01-01T00:00:00.000Z',
				'requestParameters': {
					'sourceIPAddress': '127.0.0.1'
				},
				's3': {
					'configurationId': 'testConfigRule',
					'object': {
						'eTag': '0123456789abcdef0123456789abcdef',
						// 'key': 'HappyFace.jpg',
						'key': IMAGE_NAME,
						'sequencer': '0A1B2C3D4E5F678901',
						'size': 1024
					},
					'bucket': {
						'ownerIdentity': {
							'principalId': 'EXAMPLE'
						},
						// 'name': 'sourcebucket',
						'name': BUCKET_NAME,
						'arn': 'arn:aws:s3:::mybucket'
					},
					's3SchemaVersion': '1.0'
				},
				'responseElements': {
					'x-amz-id-2': 'EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH',
					'x-amz-request-id': 'EXAMPLE123456789'
				},
				'awsRegion': 'us-east-1',
				'eventName': 'ObjectCreated:Put',
				'userIdentity': {
					'principalId': 'EXAMPLE'
				},
				'eventSource': 'aws:s3'
			}
		]
	}

	// send an empty context
	var context = {}

	lambda.handler(s3event, {}, (err, data) => {
		if(err)
			res.status(err.statusCode).send(err.message)
		else
			res.status(200).send(data)
	})
})

app.get('/lambda', (req, res) => {
	lambda.analyzeImage(BUCKET_NAME, IMAGE_NAME, (err, data) => {
		if(err)
			res.status(err.statusCode).send(err.message)
		else
			res.status(200).send(data)
	})
})

app.post('/lambda', upload.single('image'), (req, res) => {
	lambda.uploadImage(BUCKET_NAME, req.file, (err, data) => {
		if(err)
			res.status(err.statusCode).send(err.message)
		else
			res.status(200).send(data)
	})
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
