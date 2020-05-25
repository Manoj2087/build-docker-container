const deleteRobotDebug = require('debug')('robot:deleteRobot')
const Joi = require('@hapi/joi')
const docClient = require('../dynamoDB/documentClient')

deleteRobotDebug('DEBUG robot:deleteRobot...');

const ddbRobotTable = process.env.MYAPP_ROBOT_TABLE;

const deleteRobot = async (req, res) => {
    const name = req.params.name;

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
        name: name
     });

    if (error !== undefined) {
        deleteRobotDebug('Delete robot validate error: ' + error)
        return res.status(400).json({error: error.details[0].message});
    }

    var params = {
        TableName: ddbRobotTable,
        Key: {
            "R_NAME" : value.name
        },
        ConditionExpression: "#rn = :rn",
        ExpressionAttributeNames: {
            "#rn" : "R_NAME"
        },
        ExpressionAttributeValues: {
            ":rn" : value.name
        }
    };

    try {
        const data = await docClient.delete(params).promise();
        deleteRobotDebug('Success delete item from dynamodb: ' + JSON.stringify(data))
        return res.status(204).json(data);
    } catch (error) {
        deleteRobotDebug('delete item from dynamodb: Failure:' + error.message)
        if (error.message == "The conditional request failed") {
            return res.status(404).json({error: "Not Found"});
        }
        return res.status(400).json({error: error.message});
    }   
};

module.exports = deleteRobot
