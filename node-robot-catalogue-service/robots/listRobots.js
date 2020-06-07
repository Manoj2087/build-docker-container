const listRobotsDebug = require('debug')('robot:listRobots');
const docClient = require('../dynamoDB/documentClient');
const renameKeys = require('../utils/renameKeys');

listRobotsDebug('DEBUG robot:listRobots...');

const ddbRobotTable = process.env.MYAPP_ROBOT_TABLE;

const listRobots = async (req, res) => {
  const params = {
    TableName: ddbRobotTable,
    ProjectionExpression: 'R_NAME, R_IMG_URL',
  };

  try {
    const data = await docClient.scan(params).promise();
    listRobotsDebug(`Success scan all items from dynamodb: ${JSON.stringify(data)}`);
    // change the data.Items object keys from DDB col to regular col name
    const obj = data.Items;
    const newKeys = ['name', 'imageURL'];
    const renamedObj = renameKeys(obj, newKeys);
    listRobotsDebug(`renamed object: ${JSON.stringify(renamedObj)}`);
    return res.status(200).json(renamedObj);
  } catch (error) {
    listRobotsDebug(`scan all items from dynamodb: Failure:${error.message}`);
    return res.status(400).json({ error: error.message });
  }
};


module.exports = listRobots;
