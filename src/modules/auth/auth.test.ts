import { describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import request from "supertest";
import app from "../../server";
import type {LoginInput } from "./core/auth.models";


describe("Authentification ", async()=> {

      test('Login success', async()=>{
            const createdUser = await request(app).post('/users').send( {
                  name: faker.person.fullName(),
                  email: faker.internet.email(),
                  password: 'facteur20032009',
                  role: 'client' });
            const loginInput: LoginInput = {
                    email: createdUser.body.user.email,
                    password: 'facteur20032009',
                 };
            const response = await request(app).post('/auth/login').send(loginInput);

          expect(response.status).toBe(200);
          expect(response.body.message).toEqual('Connected');
          expect(response.body.result).toBeDefined();
      
      })

      test('Missing data', async() => {
            const loginInput= {
                  
               };
            const response = await request(app).post('/auth/login').send(loginInput);
            expect(response.status).toBe(400)
      })
      test('Invalid data', async() => {
            const loginInput= {
                  email:"pasunmail",
                  password:'123'
               };
            const response = await request(app).post('/auth/login').send(loginInput);
            expect(response.status).toBe(400)
      })

      test('Wrong email address', async()=> {
            const createdUser = await request(app).post('/users').send( {
                  name: faker.person.fullName(),
                  email: faker.internet.email(),
                  password: 'facteur20032009',
                  role: 'client' });
                const loginInput: LoginInput = {
                    email: 'incorrectmail@gmail.com',
                    password: 'facteur20032009',
                 };
                const response = await request(app).post('/auth/login').send(loginInput);
                expect(response.status).toBe(404);
      })

      test('Wrong password', async()=> {
            const createdUser = await request(app).post('/users').send( {
                  name: faker.person.fullName(),
                  email: faker.internet.email(),
                  password: 'facteur20032009',
                  role: 'client' });
            const loginInput: LoginInput = {
                    email: createdUser.body.user.email,
                    password: 'facteur20032010',
                 };
            const response = await request(app).post('/auth/login').send(loginInput);
            expect(response.status).toBe(401);
      })
})