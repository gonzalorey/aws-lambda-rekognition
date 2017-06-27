'use strict'

var AWS = require('aws-sdk')
if (!AWS.config.region) {		// ugly hack :´(
  AWS.config.update({
    region: 'us-east-1'
  })
}
var rekognition = new AWS.Rekognition()

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

exports.parseImage = (bucket_name, image_name, res) => {
  var params = {
    Image: {
      S3Object: {
        Bucket: bucket_name,
        Name: image_name
      }
    },
    MinConfidence: 70
  }

	rekognition.detectLabels(params, (err, rekognitionRes) => {
		if (err) {
		  console.log(err, err.stack)

			res.status(err.statusCode).send(err.message)
		} else {
		  console.log("-------- START: Object and scene detection --------")
		  var labels = rekognitionRes.Labels
		  var data = {}
		  for(var i=0; i<labels.length; i++) {
		      console.log('Name =' + labels[i].Name + ', Confidence =' + labels[i].Confidence)
		      data[labels[i].Name] = labels[i].Confidence + ''
		  }
		  console.log("-------- END: Object and scene detection --------")
		  console.log("\n")

			res.status(200).send(data)
		}
  })
}
