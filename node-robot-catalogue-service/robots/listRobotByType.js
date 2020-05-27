const listRobotsByTypeDebug = require('debug')('robot:listRobotsByType');
const Joi = require('@hapi/joi');
const docClient = require('../dynamoDB/documentClient');
const renameKeys = require('../utils/renameKeys');

listRobotsByTypeDebug('DEBUG robot:listRobotsByType...');

const ddbRobotTable = process.env.MYAPP_ROBOT_TABLE;
const ddbRobotTableTypeIndex = process.env.MYAPP_ROBOT_T_TYPE_INDEX;

const listRobotsByType = async (req, res) => {
  listRobotsByTypeDebug(`request query: ${JSON.stringify(req.query)}`);
  const { type } = req.query;

  // Validate type
  const schema = Joi.object({
    type: Joi.string()
      .lowercase()
      .valid('good', 'bad')
      .required(),
  });
  const { error, value } = schema.validate({
    type,
  });

  if (error !== undefined) {
    listRobotsByTypeDebug(`Get all robots by type validate error: ${JSON.stringify(error)}`);
    return res.status(400).json({ error: error.details[0].message });
  }
  const params = {
    TableName: ddbRobotTable,
    IndexName: ddbRobotTableTypeIndex,
    KeyConditionExpression: '#RT = :RT',
    ExpressionAttributeNames: {
      '#RT': 'R_TYPE',
    },
    ExpressionAttributeValues: {
      ':RT': value.type,
    },
    ProjectionExpression: 'R_NAME, R_IMG_URL',
  };

  try {
    const data = await docClient.query(params).promise();
    listRobotsByTypeDebug(`Success query items by type from dynamodb: ${JSON.stringify(data)}`);
    // change the data.Items object keys from DDB col to regular col name
    const obj = data.Items;
    const newKeys = ['name', 'imageURL'];
    const renamedObj = renameKeys(obj, newKeys);
    listRobotsByTypeDebug(`renamed object: ${JSON.stringify(renamedObj)}`);
    return res.status(200).json(renamedObj);
  } catch (err) {
    listRobotsByTypeDebug(`query items by type from dynamodb: Failure:${err.message}`);
    return res.status(400).json({ error: err.message });
  }
};


module.exports = listRobotsByType;
