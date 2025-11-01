import { describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import request from "supertest";
import app from "../../server";
import { type createShopInput } from "./core/shop.models";
import type { LoginInput } from "../auth/core/auth.models";





describe("create shop", async()=> {
    test("Shop creation successful", async () => {
        const createdUser = await request(app).post('/users').send( {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: 'facteur20032009',
            role: 'admin' });
      
        const loginRes = await request(app).post('/auth/login').send({ email: createdUser.body.user.email,password: 'facteur20032009'});
        const token = loginRes.body.result;
        const shop: createShopInput = {
          name: "Sinergie",
          description: "test description",
          address: "Bangui",
          category: "Electronics", 
          phone:"74024015000000",
          isActive: true,
          createdBy: createdUser.body.user.id
        };
      
        const response = await request(app)
          .post("/shop")
          .set("Authorization", token)
          .send(shop);
      
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "Shop created");
        expect(response.body.shop).toMatchObject({
          name: "Sinergie",
          description: "test description",
          address: "Bangui",
          category: "Electronics"
        });
      });
})