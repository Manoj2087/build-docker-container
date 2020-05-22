const express = require('express');
const router = express.Router();
const robotsDebug = require('debug')('robots')
const Joi = require('@hapi/joi')
const AWS = require('aws-sdk');

const awsRegion = process.env.MYAPP_AWS_REGION;
const awsEndpoint = process.env.MYAPP_AWS_ENDPOINT
const ddbRobotTable = process.env.MYAPP_ROBOT_TABLE
const ddbRobotTableTypeIndex = process.env.MYAPP_ROBOT_T_TYPE_INDEX

AWS.config.update({
    region: awsRegion ,
    endpoint: awsEndpoint
})

const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

robotsDebug('DEBUG app:robot...') 

// Joi Validation Schema
const schema = Joi.object({
    name: Joi.string()
        .lowercase()
        .min(3)
        .max(15)
        .required(),
    type: Joi.string()
        .lowercase()
        .valid('good','bad'),
    description: Joi.string()
        .max(50),
    cost: Joi.number(),
    deliveryTime: Joi.number(),
    imageURL: Joi.string()
        .uri()
});

function renameKeys(arrayObject, newKeys, index = false) {
    let newArray = [];
    arrayObject.forEach((obj,item)=>{
        const keyValues = Object.keys(obj).map((key,i) => {
            return {[newKeys[i] || key]:obj[key]}
        });
        let id = (index) ? {'ID':item} : {}; 
        newArray.push(Object.assign(id, ...keyValues));
    });
    return newArray;
}

//POST robots
//createRobot
router.post('/', (req, res) => {
    const name = req.body.name;
    const type = req.body.type;
    const description = req.body.description;
    const cost = req.body.cost;
    const deliveryTime = req.body.deliveryTime;
    const imageURL = req.body.imageURL;
    
    robotsDebug('Post' + req.body)    

    // validate input
    const { error, value } = schema.validate({ 
        name: name,
        type: type,
        description: description,
        cost: cost,
        deliveryTime: deliveryTime,
        imageURL: imageURL
        });

    if (error !== undefined) {
        robotsDebug('Post validate error: ' + error)
        return res.status(400).json({error: error.details[0].message});
    }

    async function createRobot(value) {
        var params = {
            TableName: ddbRobotTable,
            Item: {
                "R_NAME" : value.name,
                "R_TYPE" : value.type,
                "R_DESC" : value.description,
                "R_COST" : value.cost,
                "R_DELV_TIME" : value.deliveryTime,
                "R_IMG_URL": value.imageURL        
            },
            ConditionExpression: "#RN <> :rnameValue",
            ExpressionAttributeNames: {
                "#RN" : "R_NAME"
            },
            ExpressionAttributeValues: {
                ":rnameValue" : value.name
            }
        };

        try {
            const data = await docClient.put(params).promise();
            robotsDebug('add to dynamodb: Success')
            robotsDebug('add to dynamodb: ' + data)
            return res.status(201).json(value);
        } catch (error) {
            robotsDebug('add to dynamodb: Failure:' + error.message)
            if (error.message == "The conditional request failed") {
                return res.status(400).json({error: "Already exist"});
            }
            return res.status(400).json({error: error.message});
        }    
    }

    // putItem to dynamodb
    // success return 201
    // Fail return 400
    createRobot(value)
});

//GET robots
//listRobot
router.get('/', (req, res) => {
    async function listRobot() {
        var params = {
            TableName: ddbRobotTable,
            ProjectionExpression: 'R_NAME, R_IMG_URL'
        };

        try {
            const data = await docClient.scan(params).promise();
            robotsDebug('scan all items from dynamodb: Success');
            robotsDebug('scan all items from dynamodb: ' + data);
            // change the data.Items object keys from DDB col to regular col name
            const obj = data.Items;
            const newKeys = ['name','imageURL'];
            const renamedObj = renameKeys(obj, newKeys);
            robotsDebug('renamed object: ' + renamedObj);
            return res.status(200).json(renamedObj);
        } catch (error) {
            robotsDebug('scan all items from dynamodb: Failure:' + error.message)
            return res.status(400).json({error: error.message});
        }    
    }
    // scan tem from dynamodb
    // success return 200
    // Fail return 400
    listRobot();
});

//GET robots/filterbytype?type=<value>
//listRobotByType
router.get('/filterbytype', (req, res) => {
    robotsDebug('request query: ' + JSON.stringify(req.query));
    const type = req.query.type;

    //Validate query type
    if (!type) {
        return res.status(400).json({error: 'query \"type\" not found'});
    } 

    // Validate type
    const schema = Joi.object({
        type: Joi.string()
            .lowercase()
            .valid('good','bad')
            .required()
    });
    const { error, value } = schema.validate({ 
        type: type
        });

    if (error !== undefined) {
        robotsDebug('Get all robots by type validate error: ' + JSON.stringify(error));
        return res.status(400).json({error: error.details[0].message});
    }

    async function listRobotByType(value) {
        var params = {
            TableName: ddbRobotTable,
            IndexName: ddbRobotTableTypeIndex,
            KeyConditionExpression: '#RT = :RT',
            ExpressionAttributeNames: {
                '#RT' : 'R_TYPE'
            },            
            ExpressionAttributeValues: {
              ':RT': value.type
            },
            ProjectionExpression: 'R_NAME, R_IMG_URL'
          };

        try {
            const data = await docClient.query(params).promise();
            robotsDebug('query items by type from dynamodb: Success');
            robotsDebug('query items by type from dynamodb: ' + JSON.stringify(data));
            // change the data.Items object keys from DDB col to regular col name
            const obj = data.Items;
            const newKeys = ['name','imageURL'];
            const renamedObj = renameKeys(obj, newKeys);
            robotsDebug('renamed object: ' + renamedObj);
            return res.status(200).json(renamedObj);
        } catch (error) {
            robotsDebug('query items by type from dynamodb: Failure:' + error.message)
            return res.status(400).json({error: error.message});
        }    
    }
    // query item from dynamodb
    // success return 200
    // Fail return 400
    listRobotByType(value)
});


//GET robots/{name}
//getRobot
router.get('/:name', (req, res) => {
    const name = req.params.name;

    // validate input
    // return 400 if invalid
    const { error, value } = schema.validate({ 
        name: name
     });

    if (error !== undefined) {
        console.log(error);
        
        robotsDebug('Get robot validate error: ' + error.details[0])
        return res.status(400).json({error: error.details[0].message});
    }

    async function getRobot(value) {
        var params = {
            TableName: ddbRobotTable,
            Key: {
                "R_NAME" : value.name
            }
        };

        try {
            const data = await docClient.get(params).promise();
            robotsDebug('get item from dynamodb: Success')
            robotsDebug('get item from dynamodb: ' + data)
            if (Object.entries(data).length === 0) {
                return res.status(404).json({error: 'Not Found'});
            }
            // change the data.Items object keys from DDB col to regular col name
            const obj = [data.Item];
            const newKeys = ['type','deliveryTime','imageURL','name','cost','description'];
            const renamedObj = renameKeys(obj, newKeys);
            robotsDebug('renamed object: ' + renamedObj[0]);
            return res.status(200).json(renamedObj[0]);
        } catch (error) {
            robotsDebug('get item from dynamodb: Failure:' + error.message)
            return res.status(400).json({error: error.message});
        }    
    }
    // getitem from dynamodb
    // success return 200
    // Fail return 404
    getRobot(value)
});

//PUT robots/{name}
//updateRobot
router.put('/:name', (req, res) => {
    const name = req.params.name;
    const type = req.body.type;
    const description = req.body.description;
    const cost = req.body.cost;
    const deliveryTime = req.body.deliveryTime;
    const imageURL = req.body.imageURL;

    // validate input
    const { error, value } = schema.validate({ 
        name: name,
        type: type,
        description: description,
        cost: cost,
        deliveryTime: deliveryTime,
        imageURL: imageURL
     });

     if (error !== undefined) {
        robotsDebug('Put validate error: ' + error)
        return res.status(400).json({error: error.details[0].message});
    }

    async function updateRobot(value) {
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
            robotsDebug('update to dynamodb: Success')
            robotsDebug('update to dynamodb: ' + data)
            return res.status(200).json(value);
        } catch (error) {
            robotsDebug('update to dynamodb: Failure:' + error.message)
            if (error.message == "The conditional request failed") {
                return res.status(404).json({error: "Not Found"});
            }
            return res.status(400).json({error: error.message});
        }    
    }

    // updateItem to dynamodb
    // success return 200
    // Fail return 4xx
    updateRobot(value)
});

//DELETE robots/{name}
//deleteRobot
router.delete('/:name', (req, res) => {
    const name = req.params.name;

    // validate input
    // return 400 if invalid
    const { error, value } = schema.validate({ 
        name: name
     });

    if (error !== undefined) {
        robotsDebug('Delete robot validate error: ' + error)
        return res.status(400).json({error: error.details[0].message});
    }

    async function deleteRobot(value) {
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
            robotsDebug('delete item from dynamodb: Success')
            robotsDebug('delete item from dynamodb: ' + data)
            return res.status(204).json(data);
        } catch (error) {
            robotsDebug('delete item from dynamodb: Failure:' + error.message)
            if (error.message == "The conditional request failed") {
                return res.status(404).json({error: "Not Found"});
            }
            return res.status(400).json({error: error.message});
        }    
    }
    // getitem from dynamodb
    // success return 204
    // Fail return 404
    deleteRobot(value);
});

module.exports = router;