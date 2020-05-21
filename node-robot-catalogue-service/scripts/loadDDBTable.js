const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
    region: process.env.MYAPP_AWS_REGION ,
    endpoint: process.env.MYAPP_AWS_ENDPOINT
})

const docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing Robot into DynamoDB. Please wait...");
var robots = JSON.parse(fs.readFileSync('dummy-robot-catalogue.json', 'utf8'));

robots.forEach(robot => {
    console.log(robot);
    var params = {
        TableName: process.env.MYAPP_TABLE_NAME,
        Item: {
            "R_NAME" : robot.R_NAME,
            "R_TYPE" : robot.R_TYPE,
            "R_DESC" : robot.R_DESC,
            "R_COST" : robot.R_COST,
            "R_DELV_TIME" : robot.R_DELV_TIME,
            "R_IMG_URL": robot.R_IMG_URL
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add robot", robot.R_NAME, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", robot.R_NAME);
        }
     });
});

