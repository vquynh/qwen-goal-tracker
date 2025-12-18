// src/__tests__/cors.test.ts
import request from 'supertest';
import app from '../app'; // Import from app, not index

describe('CORS Configuration', () => {
    it('should include CORS headers in responses', async () => {
        const response = await request(app)
            .get('/goals')
            .set('Origin', 'http://localhost:3000');

        expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
        expect(response.status).toBe(200);
    });
});