const AWS = require('aws-sdk');

// console.log('env DEBUG: ' + process.env.DEBUG);
// console.log('env AWS_ACCESS_KEY_ID:' +  process.env.AWS_ACCESS_KEY_ID);
// console.log('env AWS_SECRET_ACCESS_KEY:' +  process.env.AWS_SECRET_ACCESS_KEY); 
// console.log('env MYAPP_AWS_REGION:' +  process.env.MYAPP_AWS_REGION);
// console.log('env MYAPP_AWS_ENDPOINT:' +  process.env.MYAPP_AWS_ENDPOINT);
// console.log('env MYAPP_ROBOT_TABLE:' +  process.env.MYAPP_ROBOT_TABLE);
// console.log('env MYAPP_ROBOT_T_TYPE_INDEX:' +  process.env.MYAPP_ROBOT_T_TYPE_INDEX);

const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.MYAPP_AWS_REGION;
const awsEndpoint = process.env.MYAPP_AWS_ENDPOINT;
const ddbRobotTable = process.env.MYAPP_ROBOT_TABLE;
const ddbRobotTableTypeIndex = process.env.MYAPP_ROBOT_T_TYPE_INDEX;

AWS.config.update({
    region: awsRegion ,
    endpoint: awsEndpoint,
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey
});

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});


async function createTable() {
  var params = {
    TableName: ddbRobotTable,
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

  try {
    const data = await ddb.createTable(params).promise();
    console.log('Succesfully created dynamodb table: ' + JSON.stringify(data));
  } catch (error) {
    console.log('Failure creating dynamodb table: :' + error.message);
  }
}

createTable();


