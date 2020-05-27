const robotDebug = require('debug')('robot');
const express = require('express');
const routes = require('./routes/robot-routes');

const app = express();
app.use(express.json());

robotDebug('DEBUG robot...');

robotDebug(`env AWS_ACCESS_KEY_ID:${process.env.AWS_ACCESS_KEY_ID}`);
robotDebug(`env AWS_SECRET_ACCESS_KEY:${process.env.AWS_SECRET_ACCESS_KEY}`);
robotDebug(`env MYAPP_AWS_REGION:${process.env.MYAPP_AWS_REGION}`);
robotDebug(`env MYAPP_AWS_ENDPOINT:${process.env.MYAPP_AWS_ENDPOINT}`);
robotDebug(`env MYAPP_ROBOT_T_TYPE_INDEX:${process.env.MYAPP_ROBOT_T_TYPE_INDEX}`);
robotDebug(`env DEBUG:${process.env.DEBUG}`);
robotDebug(`env PORT:${process.env.PORT}`);

app.use('/v1/robots', routes);

const PORT = process.env.PORT || 3000;

// eslint-disable-next-line no-console
const server = app.listen(PORT, () => console.log(`app is live at localhost:${PORT}...`));

module.exports = server;
