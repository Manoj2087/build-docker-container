#!/bin/bash

tableName="robot-catalogue"
hostPort="8000"
hostName="localhost"
awsRegion="ap-southeast-2"


echo -e "---------------------------------------"
echo -e "Check if the local DDB container is running..."
echo -e "---------------------------------------"
aws dynamodb list-tables \
    --endpoint-url "http://${hostName}:${hostPort}"


echo -e "---------------------------------------"
echo -e "Load Dummy Robot data to DDB Table..."
echo -e "---------------------------------------"
MYAPP_AWS_REGION=${awsRegion} \
    MYAPP_AWS_ENDPOINT="http://${hostName}:${hostPort}" \
    MYAPP_TABLE_NAME=${tableName} \
    node loadDDBTable.js