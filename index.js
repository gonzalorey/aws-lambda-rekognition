'use strict';

console.log('Loading function...');

/**
 * The goal behind this Lambda function is to receive a base64 encoded image,
 * send it to Rekognition and return the labels.
 */
exports.handler = (event, context, callback) => {
	console.log(event);
	// console.log(context);

	// Lets asume we already have the image in base64
	var imageBytes;

	// Build the rekognition request
	var rekognitionRequest = {
		"image": {
			"Bytes": imageBytes
		}
	}

	/** An image can be extracted from an S3 bucket, or received through base64 encoded bytes,
	 *  an example for the second one can be founde here:
	 *  - http://docs.aws.amazon.com/rekognition/latest/dg/example4.html
	 *  - http://docs.aws.amazon.com/rekognition/latest/dg/get-started-exercise-detect-labels.html
	 */
	var labels = rekognitionClient.detectLabels(rekognitionRequest);

	if (labels.isNotEmpty()) {
		logger.log(labels);
	} else {
		logger.log("No labels returned. Not saving to ES");
	}
};
