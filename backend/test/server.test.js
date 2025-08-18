const request = require('supertest');
const app = require('../server');

describe('Server API', () => {
  test('GET /health should return 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
  });

  test('GET / should return API info', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('endpoints');
  });

  test('GET /api/skills should return skills data', async () => {
    const response = await request(app).get('/api/skills');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('skills');
    expect(response.body).toHaveProperty('categories');
  });

  test('GET /api/projects should return projects data', async () => {
    const response = await request(app).get('/api/projects');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('projects');
    expect(Array.isArray(response.body.projects)).toBe(true);
  });

  test('POST /api/contact should validate required fields', async () => {
    const response = await request(app).post('/api/contact').send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('POST /api/contact should accept valid data', async () => {
    const validData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test message'
    };
    
    const response = await request(app).post('/api/contact').send(validData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
  });
});

