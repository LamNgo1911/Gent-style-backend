import request from "supertest";
import path from "path";

import app from "../../src/app";
import connect, { MongoHelper } from "../db-helper";
import { createCategory, createUser, getToken } from "../commonUse";

const filePath = path.resolve(__dirname, "sample-asset", "image.png");

describe("Product controller test", () => {
  let mongoHelper: MongoHelper;
  let token: string;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  it("should create a new product if role is admin and has valid token", async () => {
    const userinfo = await createUser(
      "user1@gmail.com",
      "123lam",
      "ADMIN",
      "Lam"
    );

    const userData = await getToken(userinfo.body.user.email, "123lam");
    token = userData.body.token;

    const newCategoryRes = await createCategory("Jacket", filePath, token);

    // Call the createCategory endpoint
    const response = await request(app)
      .post("/api/v1/products")
      .set("Authorization", "Bearer " + token)
      .field("name", "product2")
      .field("price", "10")
      .field("description", "Haha")
      .field("category", newCategoryRes.body.newCategory._id.toString())
      .field("variants[0][color]", "Blue")
      .field("variants[0][size]", "M")
      .field("variants[0][stock]", "20")
      .attach("images", filePath);

    // Assertions

    expect(response.status).toBe(201);
  });

  //   it("should return a BadRequestError if required fields are missing", async () => {
  //     const userinfo = await createUser(
  //       "user1@gmail.com",
  //       "123lam",
  //       "ADMIN",
  //       "Lam"
  //     );

  //     const userData = await getToken(userinfo.body.user.email, "123lam");
  //     token = userData.body.token;

  //     const requestBody = {};

  //     // Call the createCategory function
  //     const response = await request(app)
  //       .post("/api/v1/categories")
  //       .set("Authorization", "Bearer " + token)
  //       .send(requestBody);

  //     // Assertions
  //     expect(response.status).toBe(400);
  //   });

  //   it("should get all categories", async () => {
  //     // Call the createCategory endpoint
  //     const response = await request(app).get("/api/v1/categories");

  //     // Assertions
  //     expect(response.status).toBe(200);
  //   });

  //   it("should get a single category", async () => {
  //     const userinfo = await createUser(
  //       "user1@gmail.com",
  //       "123lam",
  //       "ADMIN",
  //       "Lam"
  //     );

  //     const userData = await getToken(userinfo.body.user.email, "123lam");
  //     token = userData.body.token;

  //     const requestBody = {
  //       name: "Test Category",
  //     };

  //     const res = await createCategory(requestBody.name, filePath, token);

  //     // Call the createCategory endpoint
  //     const response = await request(app).get(
  //       `/api/v1/categories/${res.body.newCategory._id}`
  //     );

  //     // Assertions
  //     expect(response.status).toBe(200);
  //   });

  //   it("should update a category if role is admin and has valid token", async () => {
  //     const userinfo = await createUser(
  //       "user1@gmail.com",
  //       "123lam",
  //       "ADMIN",
  //       "Lam"
  //     );

  //     const userData = await getToken(userinfo.body.user.email, "123lam");
  //     token = userData.body.token;

  //     const requestBody = {
  //       name: "Test Category",
  //     };

  //     const res = await createCategory(requestBody.name, filePath, token);

  //     // Call the createCategory endpoint
  //     const response = await request(app)
  //       .put(`/api/v1/categories/${res.body.newCategory._id}`)
  //       .set("Authorization", "Bearer " + token)
  //       .send({ name: "T-shirts" });

  //     // Assertions
  //     expect(response.status).toBe(200);
  //   });

  //   it("should delete a category if role is admin and has valid token", async () => {
  //     const userinfo = await createUser(
  //       "user1@gmail.com",
  //       "123lam",
  //       "ADMIN",
  //       "Lam"
  //     );

  //     const userData = await getToken(userinfo.body.user.email, "123lam");
  //     token = userData.body.token;

  //     const requestBody = {
  //       name: "Test Category",
  //     };

  //     const res = await createCategory(requestBody.name, filePath, token);

  //     // Call the createCategory endpoint
  //     const response = await request(app)
  //       .delete(`/api/v1/categories/${res.body.newCategory._id}`)
  //       .set("Authorization", "Bearer " + token);

  //     // Assertions
  //     expect(response.status).toBe(200);
  //   });
});
