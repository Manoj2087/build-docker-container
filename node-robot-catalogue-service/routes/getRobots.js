const express = require('express');
const router = express.Router();
const getRobotDebug = require('debug')('app:getRobot')
const Joi = require('@hapi/joi')
const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.MYAPP_AWS_REGION ,
    endpoint: process.env.MYAPP_AWS_ENDPOINT
})

const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

robots = [
    {id: 1, name: 'Wall-e', type: 'good', description: 'A machine responsible for cleaning', cost: 20, deliveryTime: 1},
    {id: 2, name: 'T-1000', type: 'bad', description: 'Assasin robot', cost: 200, deliveryTime: 5},
    {id: 3, name: 'T-800', type: 'good', description: 'Assasin robot', cost: 150, deliveryTime: 4},
]


function validation(id) {
    const schema = Joi.object({
        id : Joi.number().integer().required()
    });
    
    return schema.validate({id: id})
}

function getDDBitem(id) {
    var params = {
        Key: {
         "R_ID": {
           S: id
          } 
        }, 
        TableName: process.env.MYAPP_TABLE_NAME
    };
    dynamodb.getItem(params, function(err, data) {
        if (err) return(err, err.stack); // an error occurred
        else     return data;           // successful response
    });
}

router.get('/', (req, res) => {
    res.json(robots);
});  

router.get('/:id', (req, res) => {
    const id = req.params.id

    getRobotDebug('Validate Request id format Reqest id: ' + id)
    // Validate id format
    const { error } = validation(id)
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }
    
    // check if id exists in DDB
    
    const robot = robots.find(robot => robot.id === parseInt(id))
    getRobotDebug('check if id exist, robot:' + robot)
    if (!robot) {
        return res.status(404).json({error: 'Robot does not exist'})
    }
    //return the item
    res.json(robot)
})



module.exports = router;