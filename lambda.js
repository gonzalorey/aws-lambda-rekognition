'use strict'

var AWS = require('aws-sdk')
if (!AWS.config.region) {		// ugly hack :´(
	AWS.config.update({
		region: 'us-east-1'
	})
}
var rekognition = new AWS.Rekognition()
var s3 = new AWS.S3()

console.log('Loading function...')

/**
 *  Automate creation and publication of the AWS Lambda function:
 *  http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#createFunction-property
 */

/**
 * The goal behind this Lambda function is to receive a base64 encoded image,
 * send it to Rekognition and return the labels.
 */
exports.handler = function(event, context) {
	return exports.parseImage(event.bucket_name, event.image_name)
}

exports.analyzeImage = (bucket_name, image_name, res) => {
	var params = {
		Image: {
			S3Object: {
				Bucket: bucket_name,
				Name: image_name
			}
		},
		MinConfidence: 70
	}

	rekognition.detectLabels(params, (err, data) => {
		if (err) {
			console.log(err, err.stack)
			res.status(err.statusCode).send(err.message)
		} else {
			console.log('Image successfuly analized: ' + JSON.stringify(data))
			res.status(200).send(data)
		}
	})
}

exports.uploadImage = (bucket_name, file, res) => {
	var params = {
		Body: file.buffer,
		Bucket: bucket_name,
		Key: file.originalname
	}

	s3.putObject(params, (err, data) => {
		if(err) {
			console.log(err, err.stack)
			res.status(err.statusCode).send(err.message)
		} else {
			console.log('Image successfuly uploaded: ' + JSON.stringify(data))
			exports.analyzeImage(params.Bucket, params.Key, res)
		}
	})
}
