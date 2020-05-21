const express = require('express');
const router = express.Router();
const getRobotDebug = require('debug')('app:createRobot')
// const Joi = require('@hapi/joi')
// const AWS = require('aws-sdk');

// AWS.config.update({
//     region: process.env.MYAPP_AWS_REGION ,
//     endpoint: process.env.MYAPP_AWS_ENDPOINT
// })

// const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

// var params = {
//     TableName: process.env.MYAPP_TABLE_NAME,
//     Item: {
//         "R_NAME" : robot.R_NAME,
//         "R_TYPE" : robot.R_TYPE,
//         "R_DESC" : robot.R_DESC,
//         "R_COST" : robot.R_COST,
//         "R_DELV_TIME" : robot.R_DELV_TIME,
//         "R_IMG_URL": robot.R_IMG_URL
//     }
// };

// function validation(id) {
//     const schema = Joi.object({
//         id : Joi.number().integer().required()
//     });
    
//     return schema.validate({id: id})
// }

router.post('/', (req, res) => {
    console.log(req)
    res.send('POST request to the homepage')
})

module.exports = router;