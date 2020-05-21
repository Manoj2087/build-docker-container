#!/bin/bash

tableName="robot-calalogue"
hostPort="8000"
hostName="localhost"
awsRegion="ap-southeast-2"


echo -e "---------------------------------------"
echo -e "remove any already runnign container..."
echo -e "---------------------------------------"
docker rm -f $(docker ps -a -q --filter name=${tableName})