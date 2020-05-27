const createRobotDebug = require('debug')('robot:createRobot');
const Joi = require('@hapi/joi');
const docClient = require('../dynamoDB/documentClient');

createRobotDebug('DEBUG robot:createRobot...');

const ddbRobotTable = process.env.MYAPP_ROBOT_TABLE;

const createRobot = async (req, res) => {
  const { name } = req.body;
  const { type } = req.body;
  const { description } = req.body;
  const { cost } = req.body;
  const { deliveryTime } = req.body;
  const { imageURL } = req.body;

  createRobotDebug(`Post${req.body}`);

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
    createRobotDebug(`Post validate error: ${error}`);
    return res.status(400).json({ error: error.details[0].message });
  }

  const params = {
    TableName: ddbRobotTable,
    Item: {
      R_NAME: value.name,
      R_TYPE: value.type,
      R_DESC: value.description,
      R_COST: value.cost,
      R_DELV_TIME: value.deliveryTime,
      R_IMG_URL: value.imageURL,
    },
    ConditionExpression: '#RN <> :rnameValue',
    ExpressionAttributeNames: {
      '#RN': 'R_NAME',
    },
    ExpressionAttributeValues: {
      ':rnameValue': value.name,
    },
  };

  try {
    const data = await docClient.put(params).promise();
    createRobotDebug(`Success add to dynamodb: ${JSON.stringify(data)}`);
    return res.status(201).json(value);
  } catch (err) {
    createRobotDebug(`add to dynamodb: Failure:${err.message}`);
    if (err.message === 'The conditional request failed') {
      return res.status(400).json({ error: 'Already exist' });
    }
    return res.status(400).json({ error: err.message });
  }
};

module.exports = createRobot;
