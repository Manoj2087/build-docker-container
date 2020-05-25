const AWS = require('aws-sdk');

const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.MYAPP_AWS_REGION;
const awsEndpoint = process.env.MYAPP_AWS_ENDPOINT;

AWS.config.update({
    region: awsRegion ,
    endpoint: awsEndpoint,
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey
})

const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

module.exports = docClient