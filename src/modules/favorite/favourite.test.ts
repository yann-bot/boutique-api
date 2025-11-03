import {describe, test, expect} from 'bun:test'
import {faker} from  "@faker-js/faker"
import request from "supertest";
import app from "@/server";
import type { createShopInput } from '../shop/core/shop.models';



describe("testing favorite route", async()=>{

    describe("create a favourite", async()=> {
    test("create a favourite successful", async()=> {
        const createdUser = await request(app).post('/users').send( {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: 'facteur20032009',
            role: 'admin' });
        const shopData: createShopInput = {
            name: "TechShop",
            description: "A test shop for electronics",
            address: "123 Tech Street",
            category: "Electronics",
            phone: "74024015000000",
            isActive: true,
            createdBy: createdUser.body.user.id
          };
        
        const loginRes = await request(app).post('/auth/login').send({ email: createdUser.body.user.email,password: 'facteur20032009'});
        const token = loginRes.body.result;
        const shopCreated =  await request(app).post('/shop').send(shopData).set("Authorization", token.token);
        const favorite = {
            shop_id: shopCreated.body.shop.id,
            user_id: createdUser.body.user.id,
        };
        const favoriteCreated = await request(app).post('/favorites').send(favorite).set("Authorization", token.token);


        expect(favoriteCreated.status).toBe(201);
        expect(favoriteCreated.body).toHaveProperty('message', 'Favorite created');
        expect(favoriteCreated.body.favorite).toHaveProperty('id');
        expect(favoriteCreated.body.favorite.shop_id).toBe(shopCreated.body.shop.id);
        expect(favoriteCreated.body.favorite.user_id).toBe(createdUser.body.user.id);
    });

    describe("create a favourite failed", async()=> {
        test("create a favourite failed with missing header authorization", async()=> {
        const createdUser = await request(app).post('/users').send( {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: 'facteur20032009',
            role: 'admin' });
        const shopData: createShopInput = {
            name: "TechShop",
            description: "A test shop for electronics",
            address: "123 Tech Street",
            category: "Electronics",
            phone: "74024015000000",
            isActive: true,
            createdBy: createdUser.body.user.id
          };
        
        const loginRes = await request(app).post('/auth/login').send({ email: createdUser.body.user.email,password: 'facteur20032009'});
        const token = loginRes.body.result;
        const shopCreated =  await request(app).post('/shop').send(shopData).set("Authorization", token.token);
        const favorite = {
            shop_id: shopCreated.body.shop.id,
            user_id: createdUser.body.user.id,
        };
        const favoriteCreated = await request(app).post('/favorites').send(favorite);


        expect(favoriteCreated.status).toBe(401);
    
    });

    test("Invalid favorite data", async()=> {
        const createdUser = await request(app).post('/users').send( {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: 'facteur20032009',
            role: 'admin' });
        const loginRes = await request(app).post('/auth/login').send({ email: createdUser.body.user.email,password: 'facteur20032009'});
        const token = loginRes.body.result;
        const favorite = {
            user_id: createdUser.body.user.id,
            // shop_id manquant volontairement pour forcer une erreur
        };
        const favoriteCreated = await request(app).post('/favorites').send(favorite).set("Authorization", token.token);
        
        expect(favoriteCreated.status).toBe(400);
        expect(favoriteCreated.body).toHaveProperty('message', 'Invalid favorite data');
    });

   });
  
  });

   describe("delete a favourite", async()=> {
    test("delete a favourite successful", async()=> {
        const createdUser = await request(app).post('/users').send( {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: 'facteur20032009',
            role: 'admin' });
        const shopData: createShopInput = {
            name: "TechShop",
            description: "A test shop for electronics",
            address: "123 Tech Street",
            category: "Electronics",
            phone: "74024015000000",
            isActive: true,
            createdBy: createdUser.body.user.id
          };
        
        const loginRes = await request(app).post('/auth/login').send({ email: createdUser.body.user.email,password: 'facteur20032009'});
        const token = loginRes.body.result;
        const shopCreated =  await request(app).post('/shop').send(shopData).set("Authorization", token.token);
        const favorite = {
            shop_id: shopCreated.body.shop.id,
            user_id: createdUser.body.user.id,
        };
        const favoriteCreated = await request(app).post('/favorites').send(favorite).set("Authorization", token.token);
        const favoriteDeleted = await request(app).delete(`/favorites/${favoriteCreated.body.favorite.id}`).set("Authorization", token.token);
        expect(favoriteDeleted.status).toBe(200);
        expect(favoriteDeleted.body).toHaveProperty('message', 'Favorite deleted');
        expect(favoriteDeleted.body.result).toHaveProperty('success', true);
    });
   });

   
});