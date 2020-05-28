const debug = require('debug')('ddb:loadDDBTable');
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

const robots = [
  {
    R_NAME: 'wall-e',
    R_TYPE: 'good',
    R_DESC: 'Cleaning robot',
    R_COST: 100,
    R_DELV_TIME: 1,
    R_IMG_URL: 'http://wall-e',
  },
  {
    R_NAME: 't1000',
    R_TYPE: 'bad',
    R_DESC: 'Assassin robot',
    R_COST: 1000,
    R_DELV_TIME: 5,
    R_IMG_URL: 'http://t1000',
  },
  {
    R_NAME: 't800',
    R_TYPE: 'good',
    R_DESC: 'protection robot',
    R_COST: 800,
    R_DELV_TIME: 4,
    R_IMG_URL: 'http://t800',
  },
];

const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

// eslint-disable-next-line no-console
console.log('Importing Robot into DynamoDB. Please wait...');

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
    debug(`Add robot to dynamodb table: Failure:${error.message}`);
  }
}

async function loadDummyDDBData() {
  await Promise.all(robots.map(async (robot) => {
    await loadDDBTable(robot);
  }));
}

module.exports = loadDummyDDBData;
