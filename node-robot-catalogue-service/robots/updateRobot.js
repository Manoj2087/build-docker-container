const updateRobotDebug = require('debug')('robot:updateRobot')
const Joi = require('@hapi/joi')
const docClient = require('../dynamoDB/documentClient')

updateRobotDebug('DEBUG robot:updateRobot...');

const ddbRobotTable = process.env.MYAPP_ROBOT_TABLE;

const updateRobot = async (req, res) => {
    const name = req.params.name;
    const type = req.body.type;
    const description = req.body.description;
    const cost = req.body.cost;
    const deliveryTime = req.body.deliveryTime;
    const imageURL = req.body.imageURL;

    // validate input
    const schema = Joi.object({
        name: Joi.string()
            .lowercase()
            .min(3)
            .max(15)
            .required(),
        type: Joi.string()
            .lowercase()
            .valid('good','bad')
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
        name: name,
        type: type,
        description: description,
        cost: cost,
        deliveryTime: deliveryTime,
        imageURL: imageURL
     });

     if (error !== undefined) {
        updateRobotDebug('Put validate error: ' + error)
        return res.status(400).json({error: error.details[0].message});
    }
    var params = {
        TableName: ddbRobotTable,
        Key: {
            "R_NAME" : value.name
        },
        UpdateExpression: "SET #a=:a, #b=:b, #c=:c, #d=:d, #e=:e",
        ConditionExpression: "#rn = :rn",
        ExpressionAttributeNames: {
            "#rn" : "R_NAME",
            "#a" : "R_TYPE",
            "#b" : "R_DESC",
            "#c" : "R_COST",
            "#d" : "R_DELV_TIME",
            "#e" : "R_IMG_URL"
        },
        ExpressionAttributeValues: {
            ":rn" : value.name,
            ":a" : value.type,
            ":b" : value.description,
            ":c" : value.cost,
            ":d" : value.deliveryTime,
            ":e" : value.imageURL
        }
    };

    try {
        const data = await docClient.update(params).promise();
        updateRobotDebug('Success update to dynamodb: ' + JSON.stringify(data))
        return res.status(200).json(value);
    } catch (error) {
        updateRobotDebug('update to dynamodb: Failure:' + error.message)
        if (error.message == "The conditional request failed") {
            return res.status(404).json({error: "Not Found"});
        }
        return res.status(400).json({error: error.message});
    }    
};

module.exports = updateRobot
