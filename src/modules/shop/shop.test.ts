import { describe, expect, test } from "bun:test";
import { faker } from "@faker-js/faker";
import request from "supertest";
import app from "../../server";
import { type createShopInput } from "./core/shop.models";


describe("Test the shop routes", async()=> {
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
       
        const response = await request(app).post("/shop").set("Authorization", token.token).send(shop);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "Shop created");
        expect(response.body.shop).toMatchObject({
          name: "Sinergie",
          description: "test description",
          address: "Bangui",
          category: "Electronics"
        });
      });

     describe("shop creation failed", async() => {
      test("Unauthentificated user", async () => {
        const createdUser = await request(app).post('/users').send( {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: 'facteur20032009',
            role: 'admin' });
        const loginRes = await request(app).post('/auth/login').send({ email: createdUser.body.user.email,password: 'facteur20032009'});
    
        const shop: createShopInput = {
          name: "Sinergie",
          description: "test description",
          address: "Bangui",
          category: "Electronics", 
          phone:"74024015000000",
          isActive: true,
          createdBy: createdUser.body.user.id
        };
        const response = await request(app).post("/shop").send(shop);
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toEqual("You must authentificate yourself")
      });

      test("Unauthorized user", async()=> {
        const createdUser = await request(app).post('/users').send( {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: 'facteur20032009',
          role: 'client' });
         const loginRes = await request(app).post('/auth/login').send({ email: createdUser.body.user.email, password: 'facteur20032009'});
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
        const response = await request(app).post("/shop").set("Authorization", token.token).send(shop);
        expect(response.status).toBe(403);
      })
     })
     
})


describe("read all shops", async()=> {
  test("Read all shops successful", async()=> {
    const response = await request(app).get("/shop");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Shops found");
    expect(response.body.shops).toBeDefined();
  })

})


describe("read one shop", async()=> {
  test("Read one shop successful", async()=> {
    // On crée d'abord un utilisateur admin (car il faut être authentifié admin pour créer une boutique)
    const userPayload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "SuperSecure123",
      role: "admin"
    };
    const createdUser = await request(app).post("/users").send(userPayload);

    // On login pour obtenir le token
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: userPayload.email, password: userPayload.password });
    const token = loginRes.body.result.token;

    // Préparation des données de la boutique à créer
    const shopData: createShopInput = {
      name: "TechShop",
      description: "A test shop for electronics",
      address: "123 Tech Street",
      category: "Electronics",
      phone: "74024015000000",
      isActive: true,
      createdBy: createdUser.body.user.id
    };

    // On crée la boutique via une requête POST
    const shopRes = await request(app)
      .post("/shop")
      .set("Authorization", token)
      .send(shopData);

    // Récupérer l'id de la boutique créée pour le test
    const id = shopRes.body.shop.id;
    const response = await request(app).get(`/shop/${id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual("Shop found")
    expect(response.body.shop).toBeDefined();
  })

  test("Shop not found", async()=> {
    const response = await request(app).get("/shop/123");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual("Shop not found")
  })

})


describe("update shop", async()=> {
  test("Update shop successful", async()=> {
    const userPayload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "AdminPass123",
      role: "admin"
    };
    const createdUser = await request(app).post("/users").send(userPayload);
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: userPayload.email, password: userPayload.password });
    const token = loginRes.body.result.token;

    const shopData: createShopInput = {
      name: "TechShop",
      description: "A test shop for electronics",
      address: "123 Tech Street",
      category: "Electronics",
      phone: "74024015000000",
      isActive: true,
      createdBy: createdUser.body.user.id
    };
    const shopRes = await request(app)
      .post("/shop")
      .set("Authorization", `Bearer ${token}`)
      .send(shopData);
    const id = shopRes.body.shop.id;

    const response = await request(app)
      .put(`/shop/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Updated description" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Shop updated");
    expect(response.body.shop.description).toBe("Updated description");
  })

  test("Update shop not found", async()=> {
    const userPayload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "AdminPass123",
      role: "admin"
    };
    await request(app).post("/users").send(userPayload);
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: userPayload.email, password: userPayload.password });
    const token = loginRes.body.result.token;
    const response = await request(app)
      .put(`/shop/non-existing-id`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Updated description" });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual("Shop not found")
  })
})


describe("delete shop", async()=> {
  test("Delete shop successful", async()=> {
    const userPayload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "SuperSecure123",
      role: "admin"
    };
    const createdUser = await request(app).post("/users").send(userPayload);

    const loginRes = await request(app)
    .post("/auth/login")
    .send({ email: userPayload.email, password: userPayload.password });
  const token = loginRes.body.result.token;
  const shopData: createShopInput = {
    name: "TechShop",
    description: "A test shop for electronics",
    address: "123 Tech Street",
    category: "Electronics",
    phone: "74024015000000",
    isActive: true,
    createdBy: createdUser.body.user.id
  };

  const shopRes = await request(app)
    .post("/shop")
    .set("Authorization", `Bearer ${token}`)
    .send(shopData);

  const id = shopRes.body.shop.id;


  const response = await request(app)
    .delete(`/shop/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('message');
  expect(response.body.message).toEqual("Shop deleted")
  })

  describe("fail delete shop", async()=> {
    test("Unauthentificated user", async()=> {
      const response = await request(app).delete("/shop/123");
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toEqual("You must authentificate yourself")
    })

    test("Unauthorized user", async()=> {
      // Création d'un utilisateur client
      const clientUserPayload = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "ClientPassword123",
        role: "client"
      };
      await request(app).post("/users").send(clientUserPayload);

      // Connexion de l'utilisateur client pour obtenir le token
      const loginClientRes = await request(app)
        .post("/auth/login")
        .send({ email: clientUserPayload.email, password: clientUserPayload.password });
      const clientToken = loginClientRes.body.result.token;
      const response = await request(app).delete("/shop/123").set("Authorization", `Bearer ${clientToken}`);
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual("Access denied")
    })
  })
})
  
})
