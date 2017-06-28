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
exports.handler = function(event, context, callback) {
	var bucket_name = event.Records[0].s3.bucket.name;
	var image_name = event.Records[0].s3.object.key;

	exports.analyzeImage(bucket_name, image_name, callback)
}

exports.analyzeImage = (bucket_name, image_name, callback) => {
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
			callback(err)
		} else {
			console.log('Image successfuly analized: ' + JSON.stringify(data))
			callback(null, data)
		}
	})
}

exports.uploadImage = (bucket_name, file, callback) => {
	var params = {
		Body: file.buffer,
		Bucket: bucket_name,
		Key: file.originalname
	}

	s3.putObject(params, (err, data) => {
		if(err) {
			console.log(err, err.stack)
			callback(err)
		} else {
			console.log('Image successfuly uploaded: ' + JSON.stringify(data))
			exports.analyzeImage(params.Bucket, params.Key, callback)
		}
	})
}
