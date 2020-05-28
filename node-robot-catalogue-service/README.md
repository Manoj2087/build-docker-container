# Node Robot Catalogue Service

## Run Dev locally
```
ENV=dev DEBUG="ddb*,robots*" \
docker-compose up --build
```
## Run Test locally
```
ENV=test docker-compose up --build
```
## Destroy Dev/Test
```
docker-compose down

# clear the local docker images
docker image prune -f
```