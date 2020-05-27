const debug = require('debug')('ddb:deleteDDBTable');
const AWS = require('aws-sdk');

const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.MYAPP_AWS_REGION;
const awsEndpoint = process.env.MYAPP_AWS_ENDPOINT;
const ddbRobotTable = process.env.MYAPP_ROBOT_TABLE;

AWS.config.update({
  region: awsRegion,
  endpoint: awsEndpoint,
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretKey,
});

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

async function deleteDDBTable() {
  const params = {
    TableName: ddbRobotTable,
  };

  try {
    const data = await ddb.deleteTable(params).promise();
    // eslint-disable-next-line no-console
    debug(`Succesfully deleted dynamodb table: ${JSON.stringify(data)}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    debug(`Failure deleting dynamodb table: :${error.message}`);
  }
}

module.exports = deleteDDBTable;
