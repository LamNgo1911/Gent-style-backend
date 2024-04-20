import request, { Response, SuperTest, Test } from "supertest";
import path from "path";

import app from "../../src/app";
import connect, { MongoHelper } from "../db-helper";
import { createCategory, createUser, getToken } from "../commonUse";

export const filePath = path.resolve(__dirname, "sample-asset", "image.png");

describe("Category controller test", () => {
  let mongoHelper: MongoHelper;
  let agent: request.SuperTest<request.Test>;
  let token: string;
  let res: Response;
  const requestBody = {
    name: "Test Category",
  };

  beforeAll(async () => {
    mongoHelper = await connect();
    agent = request(app) as unknown as SuperTest<Test>;
    const userinfo = await createUser(
      "user1@gmail.com",
      "123lam",
      "ADMIN",
      "Lam"
    );

    const userData = await getToken(userinfo.body.newUser.email, "123lam");
    token = userData.body.token;

    res = await createCategory(requestBody.name, filePath, token);
  });

  afterAll(async () => {
    await mongoHelper.clearDatabase();
    await mongoHelper.closeDatabase();
  });

  it("should create a new category if role is admin and has valid token", async () => {
    // Call the createCategory endpoint
    const response = await agent
      .post("/api/v1/categories")
      .set("Authorization", "Bearer " + token)
      .field("name", requestBody.name)
      .attach("image", filePath);

    // Assertions
    expect(response.status).toBe(201);
  });

  it("should get all categories", async () => {
    // Call the createCategory endpoint
    const response = await agent.get("/api/v1/categories");

    // Assertions
    expect(response.status).toBe(200);
  });

  it("should get a single category", async () => {
    // Call the createCategory endpoint
    const response = await agent.get(
      `/api/v1/categories/${res.body.newCategory._id}`
    );

    // Assertions
    expect(response.status).toBe(200);
  });

  it("should update a category if role is admin and has valid token", async () => {
    // Call the createCategory endpoint
    const response = await agent
      .put(`/api/v1/categories/${res.body.newCategory._id}`)
      .set("Authorization", "Bearer " + token)
      .send({ name: "T-shirts" });

    // Assertions
    expect(response.status).toBe(200);
  });

  it("should delete a category if role is admin and has valid token", async () => {
    // Call the createCategory endpoint
    const response = await agent
      .delete(`/api/v1/categories/${res.body.newCategory._id}`)
      .set("Authorization", "Bearer " + token);

    // Assertions
    expect(response.status).toBe(200);
  });
});
