const request = require('supertest');
const express = require('express');
const app = require('../server');

describe('Authentication Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                username: 'testuser',
                password: 'password123',
                email: 'test@example.com'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'User created successfully');
    });

    it('should login an existing user', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'password123'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});

describe('Event Endpoints', () => {
    let authToken;

    beforeAll(async () => {
        // Login to get token
        const res = await request(app)
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'password123'
            });
        authToken = res.body.token;
    });

    it('should create a new event', async () => {
        const res = await request(app)
            .post('/api/events')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Test Event',
                description: 'Test Description',
                date: '2024-03-20',
                time: '14:00',
                category: 'Meetings'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('name', 'Test Event');
    });

    it('should get user events', async () => {
        const res = await request(app)
            .get('/api/events')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
}); 