const updateRobotDebug = require('debug')('robot:updateRobot');
const Joi = require('@hapi/joi');
const docClient = require('../dynamoDB/documentClient');

updateRobotDebug('DEBUG robot:updateRobot...');

const ddbRobotTable = process.env.MYAPP_ROBOT_TABLE;

const updateRobot = async (req, res) => {
  const { name } = req.params;
  const { type } = req.body;
  const { description } = req.body;
  const { cost } = req.body;
  const { deliveryTime } = req.body;
  const { imageURL } = req.body;

  // validate input
  const schema = Joi.object({
    name: Joi.string()
      .lowercase()
      .min(3)
      .max(15)
      .required(),
    type: Joi.string()
      .lowercase()
      .valid('good', 'bad')
      .required(),
    description: Joi.string()
      .max(50),
    cost: Joi.number()
      .required(),
    deliveryTime: Joi.number()
      .required(),
    imageURL: Joi.string()
      .uri()
      .required(),
  });
  const { error, value } = schema.validate({
    name,
    type,
    description,
    cost,
    deliveryTime,
    imageURL,
  });

  if (error !== undefined) {
    updateRobotDebug(`Put validate error: ${error}`);
    return res.status(400).json({ error: error.details[0].message });
  }
  const params = {
    TableName: ddbRobotTable,
    Key: {
      R_NAME: value.name,
    },
    UpdateExpression: 'SET #a=:a, #b=:b, #c=:c, #d=:d, #e=:e',
    ConditionExpression: '#rn = :rn',
    ExpressionAttributeNames: {
      '#rn': 'R_NAME',
      '#a': 'R_TYPE',
      '#b': 'R_DESC',
      '#c': 'R_COST',
      '#d': 'R_DELV_TIME',
      '#e': 'R_IMG_URL',
    },
    ExpressionAttributeValues: {
      ':rn': value.name,
      ':a': value.type,
      ':b': value.description,
      ':c': value.cost,
      ':d': value.deliveryTime,
      ':e': value.imageURL,
    },
  };

  try {
    const data = await docClient.update(params).promise();
    updateRobotDebug(`Success update to dynamodb: ${JSON.stringify(data)}`);
    return res.status(200).json(value);
  } catch (err) {
    updateRobotDebug(`update to dynamodb: Failure:${err.message}`);
    if (err.message === 'The conditional request failed') {
      return res.status(404).json({ error: 'Not Found' });
    }
    return res.status(400).json({ error: err.message });
  }
};

module.exports = updateRobot;
