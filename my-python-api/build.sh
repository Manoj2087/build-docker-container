#!/bin/bash

# Cmd to remove all running and stopped container
docker rm -f $(docker ps -a -q)

# list all running and stopped container
docker ps -a

# remove all local docker images
docker image rm -f $(docker images -q)

# list all docker images
docker images

# cmd to build the docker image
# -t : tag
docker build -t my-app:latest .

# Cmd to run the docker locally 
# -d - run in background
# -p <hostport>:<container port>
# --name
# -v
docker run -d -p 8080:80 \
    --name=my-app \
     my-app:latest