const AWS = require('aws-sdk');

const awsRegion = process.env.MYAPP_AWS_REGION;
const awsEndpoint = process.env.MYAPP_AWS_ENDPOINT
const ddbRobotTable = process.env.MYAPP_TABLE_NAME
const ddbRobotTableTypeIndex = process.env.MYAPP_ROBOT_T_TYPE_INDEX

AWS.config.update({
    region: awsRegion ,
    endpoint: awsEndpoint
})

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var params = {
    AttributeDefinitions: [
      { 
        AttributeName: 'R_NAME',
        AttributeType: 'S' 
      },
      { 
        AttributeName: 'R_TYPE',
        AttributeType: 'S' 
      }      
    ],
    KeySchema: [
      { 
        AttributeName: 'R_NAME',
        KeyType: 'HASH' 
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    },
    TableName: ddbRobotTable,
    StreamSpecification: {
      StreamEnabled: false
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: ddbRobotTableTypeIndex,
        KeySchema: [ 
          {
            AttributeName: 'R_TYPE',
            KeyType: 'HASH'
          }
        ],
        Projection: {
          NonKeyAttributes: [
            'R_NAME',
            'R_IMG_URL'
          ],
          ProjectionType: 'INCLUDE'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: '1',
          WriteCapacityUnits: '1'
        }
      }
    ],
  };
  
  // Call DynamoDB to create the table
  ddb.createTable(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Table Created", data);
    }
  });


