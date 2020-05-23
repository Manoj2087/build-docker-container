const robots = require('./routes/robots')
const express = require('express');
const {
    createLightship
  } = require('lightship')
// Lightship will start a HTTP service on port 9000.
const lightship = createLightship()

const app = express();

app.use(express.json());
app.use('/v1/robots', robots);

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
    lightship.signalReady();
});