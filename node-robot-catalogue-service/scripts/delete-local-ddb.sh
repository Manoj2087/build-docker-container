#!/bin/bash

tableName="robot-catalogue"
hostPort="8000"
hostName="localhost"
awsRegion="ap-southeast-2"


echo -e "---------------------------------------"
echo -e "delete a DynamoDB Table..."
echo -e "---------------------------------------"
MYAPP_AWS_REGION=${awsRegion} \
    MYAPP_AWS_ENDPOINT="http://${hostName}:${hostPort}" \
    MYAPP_TABLE_NAME=${tableName} \
    node deleteDDBTable.js


echo -e "---------------------------------------"
echo -e "remove any already runnign container..."
echo -e "---------------------------------------"
docker rm -f $(docker ps -a -q --filter name=${tableName})