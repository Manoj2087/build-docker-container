const request = require('supertest');
const createDDBTable = require('../../scripts/createDDBTable');
const loadDDBTable = require('../../scripts/loadDDBTable');
const deleteDDBTable = require('../../scripts/deleteDDBTable');

let server;

describe('/v1/robots', () => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach(async () => {
    await createDDBTable();
    await loadDDBTable();
    // eslint-disable-next-line global-require
    server = require('../../index');
  });
  // eslint-disable-next-line jest/no-hooks
  afterEach(async () => {
    server.close();
    await deleteDDBTable();
  });

  // Test GET health
  describe('healthcheckRobotCatalogueService GET /healthcheck', () => {
    it('should return the status os the service', async () => {
      expect.hasAssertions();
      const res = await request(server)
        .get('/v1/robots/healthcheck');
      expect(res.status).toBe(200);
    });
  });

  // Test POST robots
  describe('createRobots POST /', () => {
    it('should retun 200, create the robot if send right body format', async () => {
      expect.hasAssertions();
      const body = {
        name: 't2000',
        type: 'bad',
        description: 'T2000',
        cost: 700,
        deliveryTime: 4,
        imageURL: 'http://t2000',
      };
      const res = await request(server)
        .post('/v1/robots')
        .send(body);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(body);
    });
    it('should return 400 if missing required body parameters', async () => {
      expect.hasAssertions();
      const body = {
        type: 'bad',
        description: 'T2000',
        cost: 700,
        deliveryTime: 4,
        imageURL: 'http://t2000',
      };
      const res = await request(server)
        .post('/v1/robots')
        .send(body);
      expect(res.status).toBe(400);
    });
    it('should return 400 if robot with name already exist', async () => {
      expect.hasAssertions();
      const body = {
        name: 'T800',
        type: 'bad',
        description: 'T2000',
        cost: 700,
        deliveryTime: 4,
        imageURL: 'http://t2000',
      };
      const res = await request(server)
        .post('/v1/robots')
        .send(body);
      expect(res.status).toBe(400);
    });
  });

  // Test GET robots
  describe('listRobots GET /', () => {
    it('should get all the robots', async () => {
      expect.hasAssertions();
      const res = await request(server)
        .get('/v1/robots');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
      // eslint-disable-next-line jest/no-truthy-falsy
      expect(res.body.some((g) => g.name === 'wall-e')).toBeTruthy();
      // eslint-disable-next-line jest/no-truthy-falsy
      expect(res.body.some((g) => g.name === 't1000')).toBeTruthy();
      // eslint-disable-next-line jest/no-truthy-falsy
      expect(res.body.some((g) => g.name === 't800')).toBeTruthy();
    });
  });

  // Test GET robots/filterbytype?type=<value>
  describe('listRobotByType GET /filterbytype', () => {
    it('should list robot of specific type', async () => {
      expect.hasAssertions();
      const res = await request(server)
        .get('/v1/robots')
        .query({ type: 'bad' });
      expect(res.status).toBe(200);
    });
  });

  // Test GET robots/{name}
  describe('getRobot GET /{name}', () => {
    it('should get the robot with specific name', async () => {
      expect.hasAssertions();
      const res = await request(server)
        .get('/v1/robots/t1000');
      expect(res.status).toBe(200);
    });
  });

  // Test PUT robots/{name}
  describe('updateRobot GET /{name}', () => {
    it('should update the robot with the specific value', async () => {
      expect.hasAssertions();
      const body = {
        name: 't800',
        type: 'bad',
        description: 'T800',
        cost: 700,
        deliveryTime: 4,
        imageURL: 'http://t800v2',
      };
      const res = await request(server)
        .put('/v1/robots/t1000')
        .send(body);
      expect(res.status).toBe(200);
    });
  });

  // Test DELETE robots/{name}
  describe('deleteRobot DELETE /{name}', () => {
    it('should return 200 and delete the robot with specific name', async () => {
      expect.hasAssertions();
      const res = await request(server)
        .delete('/v1/robots/t1000');
      expect(res.status).toBe(204);
    });
    it('should return not 404 found', async () => {
      expect.hasAssertions();
      const res = await request(server)
        .delete('/v1/robots/t100');
      expect(res.status).toBe(404);
    });
  });
});
