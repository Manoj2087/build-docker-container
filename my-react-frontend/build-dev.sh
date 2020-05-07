#!/bin/bash
app="my-react-frontend"
version="dev"

# Cmd to remove all running and stopped container
docker rm -f $(docker ps -a -q)

# list all running and stopped container
docker ps -a

# remove all local docker images
docker image rm -f $(docker images -q)

# list all docker images
docker images

docker build -f Dockerfile-dev -t ${app}:${version} .

docker run -d -p 3000:80 \
    --name=${app} \
    ${app}:${version}