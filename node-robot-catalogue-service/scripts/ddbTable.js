const debug = require('debug')('ddb');
const createDDBTable = require('./createDDBTable');
const loadDDBTable = require('./loadDDBTable');
const deleteDDBTable = require('./deleteDDBTable');

debug('DEBUG Dynamobd');
debug(`env DEBUG: ${process.env.DEBUG}`);
debug(`env AWS_ACCESS_KEY_ID:${process.env.AWS_ACCESS_KEY_ID}`);
debug(`env AWS_SECRET_ACCESS_KEY:${process.env.AWS_SECRET_ACCESS_KEY}`);
debug(`env MYAPP_AWS_REGION:${process.env.MYAPP_AWS_REGION}`);
debug(`env MYAPP_AWS_ENDPOINT:${process.env.MYAPP_AWS_ENDPOINT}`);


// fetch the first passe argument
const option = process.argv[2];

switch (option) {
  case 'create':
    debug('Create Dynamobd Table....');
    createDDBTable();
    break;
  case 'load':
    debug('Load Dummy data to Dynamobd Table....');
    loadDDBTable();
    break;
  case 'delete':
    debug('Delete Dynamobd Table....');
    deleteDDBTable();
    break;
  default:
    // eslint-disable-next-line no-console
    console.log('Invalid argument passed');
    break;
}
