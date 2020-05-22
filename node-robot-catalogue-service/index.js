const robots = require('./routes/robots')
const express = require('express');
const app = express();


app.use(express.json());
app.use('/v1/robots', robots);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));