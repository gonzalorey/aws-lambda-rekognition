'use strict';

var File = require('file-api').File;

var AWS = require('aws-sdk');
if (!AWS.config.region) {		// ugly hack :´(
  AWS.config.update({
    region: 'eu-west-1'
  });
}
var rekognition = new AWS.Rekognition();

var multiparty = require('multiparty');
var form = new multiparty.Form();

var FileReader = require('filereader');
var fileReader = new FileReader();

var fs = require('fs')

console.log('Loading function...');

/**
 * The goal behind this Lambda function is to receive a base64 encoded image,
 * send it to Rekognition and return the labels.
 */
exports.handler = (event, context, callback) => {
	console.log(event);
	// console.log(context);
};

exports.parseImage = (req, res) => {
	form.parse(req);

	form.on('error', (err) => {
		console.log('Error parsing form: ' + err.stack);
	});

	form.on('part', (part) => {
		part.resume();
		// if (!part.filename) {
		// 	// filename is not defined when this is a field and not a file
		// 	console.log('got field named ' + part.name);
		// 	// ignore field's content
		// 	part.resume();
		// }
		//
		// if (part.filename) {
		// 	// filename is defined when this is a file
		// 	console.log('got file named ' + part.name);
		// 	// ignore file's content here
		// 	part.resume();
		// }
		//
		// part.on('error', function(err) {
		// 	console.log('Error processing file part: ' + err.stack);
		// });
	});

	form.on('file', (name, file) => {
		console.log('Uploaded file: ' + name)

		rekognizeImage(file, (err, labels) => {
			console.log('rekognizing image...')

			if (err) {
				console.log(err, err.stack)
				res.status(500).send(err.stack)
		  } else {
				console.log(data)
				res.end('Labels: ' + labels)
			}
		})

	})

	// form.on('close', function() {
	// 	console.log('Upload completed!');
	// 	res.setHeader('Content-Type', 'text/plain');
	// 	res.end('Received file');
	// });
};

function rekognizeImage(file, callback) {
	console.log(file)

	// fs.readFile(file.path, { 'encoding': 'base64' }, (err, data) => {
	// 	console.log('reading file...')
	//
	// 	if(err) {
	// 		console.log(err)
	// 	} else {
	// 		console.log('file successfuly read, calling rekognition...')
	//
	// 		var rekognitionRequest = {
	// 			'Image': {
	// 				'Bytes': data
	// 			}
	// 		}
	//
	// 		rekognition.detectLabels(rekognitionRequest, callback)
	//
	// 	}
	// })

	var bitmap = fs.readFileSync(file.path, { 'encoding': 'base64' })

	var rekognitionRequest = {
		'Image': {
			'Bytes': new Buffer(bitmap).toString('base64')
		}
	}

	rekognition.detectLabels(rekognitionRequest, callback)
}
