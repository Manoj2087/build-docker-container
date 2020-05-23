# Node Robot Catalogue Service

## Run locally
```
MYAPP_AWS_REGION=ap-southeast-2 \
MYAPP_AWS_ENDPOINT="http://0.0.0.0:8000" \
MYAPP_ROBOT_TABLE=robot-catalogue  \
MYAPP_ROBOT_T_TYPE_INDEX=type-index \
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE" \
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" \
DEBUG=robots \
npm run start
```

```
MYAPP_AWS_REGION=ap-southeast-2 \
MYAPP_AWS_ENDPOINT="http://0.0.0.0:8000" \
MYAPP_ROBOT_TABLE=robot-catalogue  \
MYAPP_ROBOT_T_TYPE_INDEX=type-index \
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE" \
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" \
DEBUG=robots \
npm run dev
```
## Docker Container
### Build
```
docker build -t node-robot-catalogue-service .
```
### Run
```
docker run -p 3000:3000 \
-d \
-e MYAPP_AWS_REGION=ap-southeast-2 \
-e MYAPP_AWS_ENDPOINT="http://0.0.0.0:8000" \
-e MYAPP_ROBOT_TABLE=robot-catalogue \
-e MYAPP_ROBOT_T_TYPE_INDEX=type-index \
-e AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE \
-e AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY \
-e DEBUG=robots \
--name node-robot-catalogue-service \
node-robot-catalogue-service
```
```
docker run -p 3000:3000 \
-d \
-e MYAPP_AWS_REGION=ap-southeast-2 \
-e MYAPP_AWS_ENDPOINT="http://0.0.0.0:8000" \
-e MYAPP_ROBOT_TABLE=robot-catalogue \
-e MYAPP_ROBOT_T_TYPE_INDEX=type-index \
-e AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE \
-e AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY \
-e DEBUG=robots \
--name node-robot-catalogue-service \
node-robot-catalogue-service run dev
```

```
docker run \
--rm -it \
-e AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE" \
-e AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" \
amazon/aws-cli \
dynamodb list-tables \
--endpoint-url "http://localhost:8000" \
--region "ap-southeast-2"
```