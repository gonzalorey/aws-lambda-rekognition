'use strict'

var AWS = require('aws-sdk')
if (!AWS.config.region) {		// ugly hack :´(
  AWS.config.update({
    region: 'eu-west-1'
  })
}
var rekognition = new AWS.Rekognition()

console.log('Loading function...')

/**
 * The goal behind this Lambda function is to receive a base64 encoded image,
 * send it to Rekognition and return the labels.
 */
exports.handler = (event, context, callback) => {
	console.log(event)
}

exports.parseImage = (req, res) => {
	var params = {
	  Image: {
	      Bytes: req.file.buffer
	  },
	  MinConfidence: 50
	}

	rekognition.detectLabels(params, (err, rekognitionRes) => {
		if (err) {
		  console.log(err, err.stack)
			rekognitionRes.status(500).send(err.stack)
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
