import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 1: API Integration Tests', () => {
  it('creates a user successfully', async () => {
    const response = await request(app)
      .post('/users')
      .set('X-User-Id', '1')
      .send({
        name: 'Test User',
        email: 'test@example.com',
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Test User');
    expect(response.body.email).toBe('test@example.com');
  });

  it('rejects POST requests without X-User-Id', async () => {
    const response = await request(app).post('/users').send({
      name: 'Test User',
      email: 'test@example.com',
    });

    expect(response.status).toBe(401);
  });

  it('returns 404 for a user that does not exist', async () => {
    const response = await request(app).get('/users/999');

    expect(response.status).toBe(404);
  });

  it('creates a ticket successfully', async () => {
    const userResponse = await request(app)
      .post('/users')
      .set('X-User-Id', '1')
      .send({
        name: 'Ticket Creator',
        email: 'creator@example.com',
      });

    const userId = userResponse.body.id;

    const response = await request(app)
      .post('/tickets')
      .set('X-User-Id', String(userId))
      .send({
        title: 'Test Ticket',
        description: 'Test description',
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Ticket');
    expect(response.body.description).toBe('Test description');
    expect(response.body.creator_id).toBe(userId);
  });

  it('returns 404 for a ticket that does not exist', async () => {
    const response = await request(app).get('/tickets/999');

    expect(response.status).toBe(404);
  });

  it('supports pagination on GET /tickets', async () => {
    const userResponse = await request(app)
      .post('/users')
      .set('X-User-Id', '1')
      .send({
        name: 'Pagination User',
        email: 'pagination@example.com',
      });

    const userId = userResponse.body.id;

    for (let i = 1; i <= 3; i++) {
      await request(app)
        .post('/tickets')
        .set('X-User-Id', String(userId))
        .send({
          title: `Ticket ${i}`,
          description: `Description ${i}`,
        });
    }

    const response = await request(app).get('/tickets?limit=2&offset=0');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe('Ticket 1');
    expect(response.body[1].title).toBe('Ticket 2');
  });

  it('supports status filtering on GET /tickets', async () => {
    const userResponse = await request(app)
      .post('/users')
      .set('X-User-Id', '1')
      .send({
        name: 'Filter User',
        email: 'filter@example.com',
      });

    const userId = userResponse.body.id;

    const ticketResponse = await request(app)
      .post('/tickets')
      .set('X-User-Id', String(userId))
      .send({
        title: 'Filtered Ticket',
        description: 'Testing status filtering',
      });

    await request(app)
      .patch(`/tickets/${ticketResponse.body.id}/status`)
      .set('X-User-Id', String(userId))
      .send({
        status: 'DONE',
      });

    const response = await request(app).get('/tickets?status=DONE');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].status).toBe('DONE');
  });
});
