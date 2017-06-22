'use strict';

console.log('Loading function');


/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // const done = (err, res) => callback(null, {
    //     statusCode: err ? '400' : '200',
    //     body: err ? err.message : JSON.stringify(res),
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // });
    console.log(event);
    console.log(context);

    // switch (event.httpMethod) {
    //     case 'DELETE':
    //         // dynamo.deleteItem(JSON.parse(event.body), done);
    //         console.log('DELETE' + JSON.parse(event.body));
    //         break;
    //     case 'GET':
    //         // dynamo.scan({ TableName: event.queryStringParameters.TableName }, done);
    //         console.log('GET' + JSON.parse(event.body));
    //         break;
    //     case 'POST':
    //         // dynamo.putItem(JSON.parse(event.body), done);
    //         console.log('POST' + JSON.parse(event.body));
    //         break;
    //     case 'PUT':
    //         // dynamo.updateItem(JSON.parse(event.body), done);
    //         console.log('PUT' + JSON.parse(event.body));
    //         break;
    //     default:
    //         done(new Error(`Unsupported method "${event.httpMethod}"`));
    // }
};
