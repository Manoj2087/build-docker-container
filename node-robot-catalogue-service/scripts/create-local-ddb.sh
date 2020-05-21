#!/bin/bash

tableName="robot-calalogue"
hostPort="8000"
hostName="localhost"
awsRegion="ap-southeast-2"

echo -e "---------------------------------------"
echo -e "remove any already runnign container..."
echo -e "---------------------------------------"
docker rm -f $(docker ps -a -q --filter name=${tableName})

echo -e "---------------------------------------"
echo -e "Create to run DynamoDB local container.."
echo -e "---------------------------------------"
docker run \
    -d \
    -p ${hostPort}:8000 \
    --name ${tableName} \
    amazon/dynamodb-local

echo -e "---------------------------------------"
echo -e "check if the local DDB container is running..."
echo -e "---------------------------------------"
aws dynamodb list-tables \
    --endpoint-url "http://${hostName}:${hostPort}"


echo -e "---------------------------------------"
echo -e "Create a DynamoDB Table..."
echo -e "---------------------------------------"
MYAPP_AWS_REGION=${awsRegion} \
    MYAPP_AWS_ENDPOINT="http://${hostName}:${hostPort}" \
    MYAPP_TABLE_NAME=${tableName} \
    node createDDBTable.js