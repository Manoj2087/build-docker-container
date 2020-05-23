const AWS = require('aws-sdk');
const fs = require('fs');

// console.log('env DEBUG: ' + process.env.DEBUG);
// console.log('env AWS_ACCESS_KEY_ID:' +  process.env.AWS_ACCESS_KEY_ID);
// console.log('env AWS_SECRET_ACCESS_KEY:' +  process.env.AWS_SECRET_ACCESS_KEY); 
// console.log('env MYAPP_AWS_REGION:' +  process.env.MYAPP_AWS_REGION);
// console.log('env MYAPP_AWS_ENDPOINT:' +  process.env.MYAPP_AWS_ENDPOINT);
// console.log('env MYAPP_ROBOT_TABLE:' +  process.env.MYAPP_ROBOT_TABLE);

const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.MYAPP_AWS_REGION;
const awsEndpoint = process.env.MYAPP_AWS_ENDPOINT
const ddbRobotTable = process.env.MYAPP_ROBOT_TABLE

AWS.config.update({
    region: awsRegion ,
    endpoint: awsEndpoint,
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey
})

const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

console.log("Importing Robot into DynamoDB. Please wait...");
const robots = JSON.parse(fs.readFileSync('dummy-robot-catalogue.json', 'utf8'));

async function loadTable(robot) {
    var params = {
        TableName: ddbRobotTable,
        Item: {
            "R_NAME" : robot.R_NAME,
            "R_TYPE" : robot.R_TYPE,
            "R_DESC" : robot.R_DESC,
            "R_COST" : robot.R_COST,
            "R_DELV_TIME" : robot.R_DELV_TIME,
            "R_IMG_URL": robot.R_IMG_URL
        }
    };
    try {
        const data = await docClient.put(params).promise();
        console.log('Sucessfully added robot: "' + robot.R_NAME + '" dynamodb table: ' + JSON.stringify(data));
    } catch (error) {
        console.log('create dynamodb table: Failure:' + error.message);
    }    
}

robots.forEach(robot => {
    // console.log(robot);
    loadTable(robot);
});
