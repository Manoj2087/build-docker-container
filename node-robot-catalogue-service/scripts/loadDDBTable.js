const debug = require('debug')('ddb:loadDDBTable');
const AWS = require('aws-sdk');
const fs = require('fs');

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

const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

// eslint-disable-next-line no-console
console.log('Importing Robot into DynamoDB. Please wait...');
const robots = JSON.parse(fs.readFileSync('dummy-robot-catalogue.json', 'utf8'));

async function loadDDBTable(robot) {
  const params = {
    TableName: ddbRobotTable,
    Item: {
      R_NAME: robot.R_NAME,
      R_TYPE: robot.R_TYPE,
      R_DESC: robot.R_DESC,
      R_COST: robot.R_COST,
      R_DELV_TIME: robot.R_DELV_TIME,
      R_IMG_URL: robot.R_IMG_URL,
    },
  };
  try {
    const data = await docClient.put(params).promise();
    // eslint-disable-next-line no-console
    debug(`Sucessfully added robot: "${robot.R_NAME}" dynamodb table: ${JSON.stringify(data)}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    debug(`create dynamodb table: Failure:${error.message}`);
  }
}

function loadDummyDDBData() {
  robots.forEach((robot) => {
    // console.log(robot);
    loadDDBTable(robot);
  });
}

module.exports = loadDummyDDBData;
