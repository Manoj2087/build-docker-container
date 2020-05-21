const AWS = require('aws-sdk');

// console.log(process.env.MYAPP_AWS_REGION);
// console.log(process.env.MYAPP_AWS_ENDPOINT);
// console.log(process.env.MYAPP_TABLE_NAME);

AWS.config.update({
    region: process.env.MYAPP_AWS_REGION ,
    endpoint: process.env.MYAPP_AWS_ENDPOINT
})

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var params = {
    AttributeDefinitions: [
      { AttributeName: 'R_NAME', AttributeType: 'S' }
    ],
    KeySchema: [
      { AttributeName: 'R_NAME', KeyType: 'HASH' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    },
    TableName: process.env.MYAPP_TABLE_NAME,
    StreamSpecification: {
      StreamEnabled: false
    }
  };
  
  // Call DynamoDB to create the table
  ddb.createTable(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Table Created", data);
    }
  });


