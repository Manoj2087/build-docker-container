const getRobotDebug = require('debug')('robot:getRobot');
const Joi = require('@hapi/joi');
const docClient = require('../dynamoDB/documentClient');
const renameKeys = require('../utils/renameKeys');

getRobotDebug('DEBUG robot:getRobot...');

const ddbRobotTable = process.env.MYAPP_ROBOT_TABLE;

const getRobot = async (req, res) => {
  const { name } = req.params;

  // validate input
  // return 400 if invalid
  const schema = Joi.object({
    name: Joi.string()
      .lowercase()
      .min(3)
      .max(15)
      .required(),
  });
  const { error, value } = schema.validate({
    name,
  });

  if (error !== undefined) {
    getRobotDebug(`Get robot validate error: ${error.details[0]}`);
    return res.status(400).json({ error: error.details[0].message });
  }
  const params = {
    TableName: ddbRobotTable,
    Key: {
      R_NAME: value.name,
    },
  };

  try {
    const data = await docClient.get(params).promise();
    getRobotDebug(`Success get item from dynamodb: ${JSON.stringify(data)}`);
    if (Object.entries(data).length === 0) {
      return res.status(404).json({ error: 'Not Found' });
    }
    // change the data.Items object keys from DDB col to regular col name
    const obj = [data.Item];
    const newKeys = ['type', 'deliveryTime', 'imageURL', 'name', 'cost', 'description'];
    const renamedObj = renameKeys(obj, newKeys);
    getRobotDebug(`renamed object: ${JSON.stringify(renamedObj)}`);
    return res.status(200).json(renamedObj[0]);
  } catch (err) {
    getRobotDebug(`get item from dynamodb: Failure:${err.message}`);
    return res.status(400).json({ error: err.message });
  }
};

module.exports = getRobot;
