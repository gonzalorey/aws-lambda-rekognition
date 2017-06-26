'use strict';

var AWS = require('aws-sdk')
if (!AWS.config.region) {		// ugly hack :´(
  AWS.config.update({
    region: 'eu-west-1'
  })
}
var rekognition = new AWS.Rekognition()
var form = new (require('multiparty')).Form({encoding: 'base64'})
var fs = require('fs')

console.log('Loading function...')

/**
 * The goal behind this Lambda function is to receive a base64 encoded image,
 * send it to Rekognition and return the labels.
 */
exports.handler = (event, context, callback) => {
	console.log(event)
	// console.log(context)
}

exports.parseImage = (req, res) => {
	var buffer
	var params

	form.on('error', (err) => {
		console.log('Error parsing form: ' + err.stack)
	})

	form.on('part', (part) => {
		console.log(`Part received: ${JSON.stringify(part)}`)
		if (!part.filename) {
			console.log('filename not defined, ignoring file content...')

			return;
		}

		// console.log(`Offset: ${part._readableState}`)
		console.log(`Part received: ${JSON.stringify(part)}`)

		// if (part._readableState.objectMode) {
		// 	buffer = Buffer.concat([buffer, part.buffer.head])
		// }

		params = {
      Image: {
        Bytes: part
      },
      MinConfidence: 50
    }

		part.resume()

		part.on('error', function(err) {
     console.log(`Error received when parsing part: ${err}`)
  	})
	})

	form.on('close', () => {
		console.log('Upload completed!')

		rekognition.detectLabels(params, (err) => {
			if (err) {
			  console.log(err, err.stack) // an error occurred
				res.status(500).send(err.stack)
			} else {
			  console.log("-------- START: Object and scene detection --------")
			  var labels = res.Labels
			  var data = {}
			  for(var i=0; i<labels.length; i++) {
			      console.log('Name =' + labels[i].Name + ', Confidence =' + labels[i].Confidence)
			      data[labels[i].Name] = labels[i].Confidence + ''
			  }
			  console.log("-------- END: Object and scene detection --------")
			  console.log("\n")
			}
		})
	})

	form.parse(req)
}
