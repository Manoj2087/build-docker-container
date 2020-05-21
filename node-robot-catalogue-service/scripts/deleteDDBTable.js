const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.MYAPP_AWS_REGION ,
    endpoint: process.env.MYAPP_AWS_ENDPOINT
})

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var params = {
    TableName: process.env.MYAPP_TABLE_NAME,
  };
  
  // Call DynamoDB to create the table
  ddb.deleteTable(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Table Deleted", data);
    }
  });


