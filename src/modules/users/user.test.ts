import { describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import request from "supertest";
import app from "../../server";
import { createElement } from "react";



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
    expect(userFound.body.user.mail).toEqual(body.email);

    })
   
})



