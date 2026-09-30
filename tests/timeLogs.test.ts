import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index.js';

describe('Part 2: Time Logs Tests', () => {
  it('logs time and returns the correct total hours', async () => {
    const userResponse = await request(app)
      .post('/users')
      .set('X-User-Id', '1')
      .send({
        name: 'Time Log User',
        email: 'timelog@example.com',
      });

    expect(userResponse.status).toBe(201);

    const userId = userResponse.body.id;

    const ticketResponse = await request(app)
      .post('/tickets')
      .set('X-User-Id', String(userId))
      .send({
        title: 'Time Log Ticket',
        description: 'Ticket for testing time logs',
      });

    expect(ticketResponse.status).toBe(201);

    const ticketId = ticketResponse.body.id;

    const firstLog = await request(app)
      .post(`/tickets/${ticketId}/time`)
      .set('X-User-Id', String(userId))
      .send({
        hours: 3,
      });

    expect(firstLog.status).toBe(201);

    const secondLog = await request(app)
      .post(`/tickets/${ticketId}/time`)
      .set('X-User-Id', String(userId))
      .send({
        hours: 5,
      });

    expect(secondLog.status).toBe(201);

    const response = await request(app).get(`/tickets/${ticketId}/time`);

    expect(response.status).toBe(200);
    expect(response.body.ticket_id).toBe(ticketId);
    expect(response.body.total_hours).toBe(8);
  });
});
