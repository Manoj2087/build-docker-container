const request = require('supertest');
let server

describe('/v1/robots', () => {
    beforeEach(() => { server  = require('../../index'); });
    describe('ListRobots GET /', () => {
        it('should get all the robots', async () => {
            const res = await request(server)
                .get('/v1/robots');
            expect(res.status).toBe(200);
            console.log(res)
        });
    });
    afterEach(() => { server.close(); });
});