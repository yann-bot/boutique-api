import { describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import request from "supertest";
import app from "@/server";


describe('test user routes', async()=> {
    describe('Create user', async () => {
        test('Create a valid user', async() => {
            const user = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: 'client'
            };
    
            const response = await request(app).post('/users').send(user)
            const body = response.body
    
            expect(response.status).toBe(201);
            expect(body.success).toBe(true);
            expect(body.message).toEqual('User created');
            expect(body.user).toHaveProperty('id');
            expect(body.user.name).toEqual(user.name)
    
        })
    
        test('duplicate email returns 409', async() => {
            const user = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: 'client'
            };
            await request(app).post('/users').send(user);
            const response = await request(app).post('/users').send(user);
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('message');
        })
    
        test('invalid data', async() => {
            const response = await request(app).post('/users').send({name: 'A' ,email: "invalid", password: "123"})
            const body = response.body;
            expect(response.status).toBe(400);
            expect(body.success).toBe(false);
            expect(body.errors).toBeDefined();
            expect(body.errors.length).toBeGreaterThan(0);
    
            expect(body.errors.some((e: any) => e.path.includes("name"))).toBe(true);
            expect(body.errors.some((e: any) => e.path.includes("email"))).toBe(true);
            expect(body.errors.some((e: any) => e.path.includes("password"))).toBe(true);
    
        })
    
    
    })
    
    describe('Update and delete user', async () => {
        test('update user successful', async () => {
            const user = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: 'client'
            };
            await request(app).post('/users').send(user);
            const response = await request(app).put(`/users/${user.email}`).send({ name: 'New Name' });
            expect(response.status).toBe(200);
            expect(response.body.user.name).toBe('New Name');
        })
    
        test('update user not found', async () => {
            const response = await request(app).put(`/users/absent@example.com`).send({ name: 'Valid Name' });
            expect(response.status).toBe(404);
        })
    
        test('delete user successful', async () => {
            const user = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: 'client'
            };
            await request(app).post('/users').send(user);
            const response = await request(app).delete(`/users/${user.email}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
        })
    
        test('delete user not found', async () => {
            const response = await request(app).delete(`/users/missing@example.com`);
            expect(response.status).toBe(404);
        })
    })
    
    
    describe('Get one user by mail', async() => {
        test('found user', async () => {
            const user = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: 'client'
        }; 
    
        const userCreated = await request(app).post('/users').send(user)
        const body = userCreated.body;
        const userFound = await request(app).get(`/users/${body.user.email}`)
    
        expect(userFound.status).toBe(200);
        expect(userFound.body.user.email).toEqual(body.user.email);
    
        })
    
        test('not found returns 404', async () => {
            const userFound = await request(app).get(`/users/notfound@example.com`)
            expect(userFound.status).toBe(404);
            expect(userFound.body).toHaveProperty('message');
        })
       
    })
})
