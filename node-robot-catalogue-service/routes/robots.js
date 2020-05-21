const express = require('express');
const router = express.Router();
const robotsDebug = require('debug')('robots')
const Joi = require('@hapi/joi')
const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.MYAPP_AWS_REGION ,
    endpoint: process.env.MYAPP_AWS_ENDPOINT
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

//GET robots
router.get('/', (req, res) => {
    res.json('GET All');
});

//GET robots/{name}
router.get('/:name', (req, res) => {
    res.json('GET ' + req.params.name);
});

//POST robots
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
        robotsDebug('Post validate error: ' + console.log(error))
        return res.status(400).json(error.details[0].message);
    }

    // add to dynamodb
    

    // if error return 400

    // Else return the added item
    res.json("success");
});

//PUT robots/{name}
router.put('/:name', (req, res) => {
    res.json('PUT ' + req.params.name);
    // validate input

    // Query Dynamodb

    // if empty return 404

    // else return the Data

});

//DELETE robots/{name}
router.delete('/:name', (req, res) => {
    res.json('DELETE ' + req.params.name);
});

module.exports = router;