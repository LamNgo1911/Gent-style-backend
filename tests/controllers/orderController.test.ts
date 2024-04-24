import request, { Response, SuperTest, Test } from "supertest";
import path from "path";

import app from "../../src/app";
import connect, { MongoHelper } from "../db-helper";
import { createCategory, createUser, getAccess_token } from "../commonUse";
import { CategoryDocument } from "../../src/models/Category";

export const filePath = path.resolve(__dirname, "sample-asset", "image.png");

describe("Order controller test", () => {
  let mongoHelper: MongoHelper;
  let agent: request.SuperTest<request.Test>;
  let access_token: string;
  const requestBody = {
    name: "Test Order",
  };
  let userinfo: Response;
  let newCategory: CategoryDocument;

  beforeAll(async () => {
    mongoHelper = await connect();
    agent = request(app) as unknown as SuperTest<Test>;
    userinfo = await createUser("user1@gmail.com", "123lam", "ADMIN", "Lam");

    const userData = await getAccess_token(
      userinfo.body.newUser.email,
      "123lam"
    );
    access_token = userData.body.access_token;

    newCategory = (await createCategory("Jacket", filePath, access_token)).body
      .newCategory;
  });

  afterAll(async () => {
    await mongoHelper.clearDatabase();
    await mongoHelper.closeDatabase();
  });

  it("should create a new order if role is user and has valid access_token", async () => {
    const productResponse: Response = await agent
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${access_token}`)
      .field("name", "product2")
      .field("price", "10")
      .field("description", "Haha")
      .field("category", newCategory._id.toString())
      .field("variants[0][color]", "Blue")
      .field("variants[0][size]", "M")
      .field("variants[0][stock]", "20")
      .attach("images", filePath);

    const orderData = {
      userId: userinfo.body.newUser.id,
      shipment: {
        method: "express",
        trackingNumber: "XYZ123456",
        address: {
          street: "123 Main St",
          city: "Cityville",
          state: "Stateville",
          postalCode: "12345",
          country: "Countryland",
        },
      },
      priceSum: 100.0,
      orderItems: [
        {
          quantity: 2,
          product: productResponse.body.newProduct.id,
        },
      ],
      status: "PAID",
    };

    // Call the createOrder endpoint
    const response = await agent
      .post("/api/v1/orders")
      .set("Authorization", "Bearer " + access_token)
      .send(orderData);

    // Assertions
    expect(response.status).toBe(201);
  });

  it("should get a single order", async () => {
    const productResponse: Response = await agent
      .post("/api/v1/products")
      .set("Authorization", `Bearer ${access_token}`)
      .field("name", "product2")
      .field("price", "10")
      .field("description", "Haha")
      .field("category", newCategory._id.toString())
      .field("variants[0][color]", "Blue")
      .field("variants[0][size]", "M")
      .field("variants[0][stock]", "20")
      .attach("images", filePath);

    const orderData = {
      userId: userinfo.body.newUser.id,
      shipment: {
        method: "express",
        trackingNumber: "XYZ123456",
        address: {
          street: "123 Main St",
          city: "Cityville",
          state: "Stateville",
          postalCode: "12345",
          country: "Countryland",
        },
      },
      priceSum: 100.0,
      orderItems: [
        {
          quantity: 2,
          product: productResponse.body.newProduct.id,
        },
      ],
      status: "PAID",
    };

    const createOrderRes = await agent
      .post("/api/v1/orders")
      .set("Authorization", "Bearer " + access_token)
      .send(orderData);
    // Call the getSingleOrder endpoint
    const response = await agent
      .get(`/api/v1/orders/${createOrderRes.body.newOrder._id}`)
      .set("Authorization", "Bearer " + access_token);

    // Assertions
    expect(response.status).toBe(200);
  });

  it("should get all orders", async () => {
    // Call the getAllOrders endpoint
    const response = await agent
      .get("/api/v1/orders")
      .set("Authorization", "Bearer " + access_token);

    // Assertions
    expect(response.status).toBe(200);
  });
});
