const request = require('supertest');
const { app } = require('.')

describe('/customers', () => {
  describe("GET /", () => {
    it('should return OK and customers', async () => {
      await request(app)
        .get('/customers')
        .expect(200)
        .expect([
          {
            id: 'abc123',
            name: 'jane doe',
            address: '123 fake street, anytown USA'
          }
        ])
    });
  });

  describe("GET /{id}", () => {
    it('should return OK and customer when found', async () => {
      await request(app)
        .get('/customers/abc123')
        .expect(200)
        .expect({
          id: 'abc123',
          name: 'jane doe',
          address: '123 fake street, anytown USA'
        });
    });

    it('should return 404 when not found', async () => {
      await request(app)
        .get('/customers/foo42')
        .expect(404);
    });
  });
});